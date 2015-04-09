/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service provides methods to manage gift card.
 *
 * @version 1.1
 * @author TCSASSEMBLER, TCCODER
 */
'use strict';

var config = require('config'),
    helper = require('../helpers/helper'),
    _ = require('lodash'),
    async = require('async'),
    crypto = require('crypto'),
    QRCode = require('qrcode');

var GiftCardSchema = require('../models/GiftCard').GiftCardSchema,
    GiftCardOfferSchema = require('../models/GiftCardOffer').GiftCardOfferSchema,
    db = require('../datasource').getDb(config.MONGODB_URL),
    GiftCard = db.model('GiftCard', GiftCardSchema),
    GiftCardOffer = db.model('GiftCardOffer', GiftCardOfferSchema);

var ValidationError = require('../errors/ValidationError'),
    UnauthorizedError = require('../errors/UnauthorizedError'),
    NotFoundError = require('../errors/NotFoundError');

var businessService = require('../services/businessService'),
    logger = require('../logger').getLogger();
// Global variable to store user coordinate for each request
var userCoordinates = null;

/**
 * Helper function to get the business coordinates for fiven business entity
 *
 * @param  {Object}     business      business entity
 * @param  {Function}   callback      callback function<error, result>
 */
var getBusinessCoordinates = function(business, callback) {
    // if business coordinate doesn't exist
    if (business.coordinates.length < 1) {
        business.coordinates = businessService.getCoordinateByAddress(business.businessAddress, function(err, coordinates) {
            var updated = _.extend(business, {
                coordinates: coordinates
            });
            callback(null, updated.toObject());
        });
    } else {
        // business is already having coordinates
        callback(null, business);
    }
};

/**
 * Helper function to calculate the distance between business coordinates and user coordinates
 *
 * @param  {Object}     business      business entity
 * @param  {Function}   callback      callback function<error, result>
 */
var calculateDistance = function(business, callback) {
    logger.info('Calculating distance POINT 1 ' + JSON.stringify(business.coordinates));
    logger.info('Calculating distance POINT 2 ' + JSON.stringify(userCoordinates));
    var lat1 = userCoordinates[0],
        lon1 = userCoordinates[1],
        lat2 = business.coordinates[0],
        lon2 = business.coordinates[1];
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    //var radlon1 = Math.PI * lon1/180;
    //var radlon2 = Math.PI * lon2/180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    // calculate distance in meters ( to minimize decimal)
    dist = dist * 1.609344 * 1000;
    logger.info('Computed distance ' + dist);
    GiftCard.findOne({
        businessId: business._id
    }, function(err, offer) {
        var result = offer.toObject();
        // adding this distance parameter only for demo purpose to show that the results are actually sorted from nearest to farthest
        result.distance = dist;
        callback(err, result);
    });
};

/**
 * Helper function to sort the cards based on the coordinates
 *
 * @param  {Object}     cards         cards to sort
 * @param  {Function}   callback      callback function<error, result>
 */
var sortByCoordinates = function(cards, callback) {
    logger.info('Sorting gift cards by user coordinates');
    async.waterfall([
        function(cb) {
            // get businesses
            var businessIds = _.pluck(cards, 'businessId');
            async.map(businessIds, businessService.get, cb);
        },
        function(businesses, cb) {
            // get businesses coordinates
            async.map(businesses, getBusinessCoordinates, cb);
        },
        function(updatedBusinesses, cb) {
            // get the distance between user coordinates and businesses coordinates
            async.map(updatedBusinesses, calculateDistance, cb);
        },
        function(result, cb) {
            // sort the gift cards
            var sortedCards = _.sortBy(result, function(card) {
                return card.distance;
            });
            cb(null, sortedCards);
        }
    ], callback);
};

var mapGiftCardOffer = function(giftCard) {
    return {
        businessId: giftCard.businessId,
        businessName: giftCard.businessName,
        businessType: giftCard.businessType,
        businessAddress: giftCard.businessAddress,
        businessPicture: giftCard.businessPicture,
        businessTelephone: giftCard.businessTelephone,
        modifiedOn: Date.now(),
        createdOn: Date.now(),
        condition: null,
        activationDateTime: null,
        endDateTime: null,
        expirationDate: null,
        status: helper.giftCardOfferStatus.DRAFT,
        price: config.OFFER_DEFAULT_PRICE,
        resaleForGiftCard: helper.giftCardStatus.FOR_RESALE,
        discount: giftCard.discount
    };
};

var GiftCardService = {
    /**
     * Create gift card.
     * @param giftCard {GiftCard} the gift card
     * @param callback {Function<error:Error, result:GiftCard>} the callback function
     */
    create: function(giftCard, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(giftCard, 'giftCard', error) ||
            !helper.validateRequiredParameter(giftCard.ownerId, 'giftCard.ownerId', error) ||
            !helper.validateRequiredParameter(giftCard.businessId, 'giftCard.businessId', error) ||
            !helper.validateRequiredParameter(giftCard.businessName, 'giftCard.businessName', error) ||
            !helper.validateRequiredIntParameter(giftCard.businessType, 'giftCard.businessType', error) ||
            !helper.validateRequiredParameter(giftCard.businessAddress, 'giftCard.businessAddress', error) ||
            !helper.validateRequiredParameter(giftCard.businessPicture, 'giftCard.businessPicture', error) ||
            !helper.validateRequiredParameter(giftCard.businessTelephone, 'giftCard.businessTelephone', error) ||
            !helper.validateRequiredFloatParameter(giftCard.discount, 'giftCard.discount', error) ||
            !helper.validateRequiredIntParameter(giftCard.quantity, 'giftCard.quantity', error) ||
            !helper.validateRequiredParameter(giftCard.description, 'giftCard.description', error) ||
            !helper.validateRequiredStatusParameter(giftCard.status, 'giftCard.status', error) ||
            !helper.validateRequiredParameter(giftCard.giftCardOfferId, 'giftCard.giftCardOfferId', error) ||
            !helper.validateRequiredParameter(giftCard.expirationDate, 'giftCard.expirationDate', error) ||
            !helper.validateRequiredParameter(giftCard.activationDateTime, 'giftCard.activationDateTime', error) ||
            !helper.validateRequiredParameter(giftCard.endDateTime, 'giftCard.endDateTime', error)) {
            callback(error.Err);
        } else {
            GiftCard.create(giftCard, callback);
        }
    },


    /**
     * Get gift card.
     * @param id {String} the gift card id
     * @param callback {Function<error:Error, result:GiftCard>} the callback function
     */
    get: function(id, callback){
        GiftCard.findOne({ _id : id}).exec(callback);
    },


    /**
     * Update gift card.
     * @param giftCard {GiftCard} the gift card
     * @param callback {Function<error:Error, result:GiftCard>} the callback function
     */
    update: function(giftCard, callback) {
        var error = {};
        if(!helper.validateRequiredParameter(giftCard, 'giftCard', error) ||
            !helper.validateRequiredParameter(giftCard.id, 'giftCard.id', error) ){
            callback(error.Err);
        }else{
            GiftCard.findOne({
                _id: giftCard.id
            }, function(err, existing) {
                if (err) {
                    callback(err);
                } else if (existing !== null) {
                    _.extend(existing, giftCard);
                    existing.save(callback);
                } else {
                    callback(new Error('Gift card not found with id: ' + giftCard.id));
                }
            });

        }
    },

    /**
     * Delete gift card.
     * @param id {String} the gift card id
     * @param callback {Function<error:Error, result:GiftCard>} the callback function
     */
    delete: function(id, callback) {
        GiftCard.remove({
            _id: id
        }, callback);
    },

    /**
     * Search gift cards with criteria.
     * @param criteria {Object} the criteria
     * ==== The criteria parameters ===
     * pageSize        {Integer} The page size.
     * pageNumber      {Integer} The page number.
     * sortBy          {String}  The name of the property that will be used to sort the results, default to 'id'.
     * sortOrder       {String}  The sorting order. Must be one of 'Ascending', 'Descending', default to 'Ascending'.
     * businessName    {String}  This is used to partial match business name.
     * businessType    {String}  This is used to partial match business type.
     * businessAddress {String}  This is used to partial match business address.
     * discountRange   {Float[]} This is used to filter by discount range.
     * dateRange       {Date[]}  This is used to filter by date range
     * description     {String}  This is used to partial match description.
     * statuses        {String}  This is used to match status.
     * coordinates     {Float[]} Filter by coordinates in related Business
     * giftCardOfferId {String}  Filter by Filter by coordinates in related Business
     * ===============================
     * @param callback {Function<error:Error, result:SearchResult<GiftCard>>} the callback function
     */
    search: function(criteria, callback) {
        var sort = {}, order, sortBy;
        userCoordinates = criteria.coordinates;
        var query = GiftCard.find();
        // pagination
        // pageNumber is 1 based indexed
        query = query.limit(criteria.pageSize).skip(criteria.pageSize * (criteria.pageNumber - 1));
        // check if each individual search criteria is present
        if (criteria.businessName) {
            query.where('businessName').equals(criteria.businessName);
        }
        if (criteria.businessType) {
            query.where('businessType').equals(criteria.businessType);
        }
        if (criteria.businessAddress) {
            query.where('businessAddress').equals(criteria.businessAddress);
        }
        if (criteria.discountRange) {
            query.where('discount').gt(criteria.discountRange[0]).lt(criteria.discountRange[1]);
        }
        if (criteria.dateRange) {
            query.where('activationDateTime').gt(criteria.dateRange[0]).lt(criteria.dateRange[1]);
        }
        if (criteria.statuses) {
            query.where('status').in(criteria.statuses);
        }
        if (criteria.quantity) {
            query.where('quantity').gt(criteria.quantity[0]).lt(criteria.quantity[1]);
        }
        if (criteria.description) {
            query.where('description').regex('/' + criteria.description + '/i');
        }
        if (criteria.sortBy && !criteria.coordinates) {
            logger.info('Sorting by ' + criteria.sortBy);
            // by default search in ascending order
            order = helper.sortOrders[criteria.sortOrder];
            sortBy = criteria.sortBy;
            sort[sortBy] = order;
            query.sort(sort);
            // skip coordinate sort
            query.exec(callback);
        } else if(criteria.coordinates) {
            async.waterfall([
                function(cb) {
                    query.exec(cb);
                },
                function(cards, cb) {
                    sortByCoordinates(cards, cb);
                }
            ], callback);
        } else {
            logger.info('Default sorting');
            // by default search in ascending order
            order = helper.sortOrders.asc;
            sortBy = 'businessName';
            sort[sortBy] = order;
            query.sort(sort);
            // skip coordinate sort
            query.exec(callback);
        }
    },

    /**
     * Resell gift card.
     * @param id {String} the gift card id
     * @param quantityToSell {Integer} the quantity to sell
     * @param {currentUser}     Current authorized user
     * @param callback {Function<error:Error, giftCardOffer:GiftCardOffer, giftCard:GiftCard>} the callback function
     */
    resell: function(id, quantityToSell, description, currentUser, callback) {
        async.waterfall([
            function(cb) {
                // validate if giftcard exists
                GiftCard.findOne({_id: id}, cb);
            },
            function(entity, cb) {
                if (entity) {
                    var reducedQuantity = entity.quantity - quantityToSell;
                    if (reducedQuantity <= 0) {
                        return cb(new ValidationError('Not enough quantity available for gift card to sell'));
                    }
                    // resell gift card
                    _.extend(entity, {
                        quantity: reducedQuantity
                    });
                    entity.save(function(err, updatedEntity) {
                        cb(err, updatedEntity);
                    });
                } else {
                    cb(new NotFoundError('Gift Card not found for id ' + id));
                }
            },
            function(updatedEntity, cb) {
                // save gift card offer
                var giftCardOffer = mapGiftCardOffer(updatedEntity);
                giftCardOffer.availableQuantity = quantityToSell;
                giftCardOffer.totalQuantity = quantityToSell;
                giftCardOffer.description = description;
                giftCardOffer.createdBy = currentUser._id;
                giftCardOffer.modifiedBy = currentUser._id;
                var offerEntity = new GiftCardOffer(giftCardOffer);
                offerEntity.save(function(err, savedOffer) {
                    cb(err, savedOffer);
                });
            }
        ], callback);
    },

    /**
     * Prepare data for redeem.
     * @param id {String} the gift card id
     * @param amount {Float} the amount
     * @param callback {Function<error:Error, result:GiftCardRedeem>} the callback function
     */
    prepareForRedeem: function(id, callback) {
        var text = crypto.randomBytes(config.QR_CODE_SIZE).toString('hex');
        async.waterfall([
            function(cb) {
                GiftCard.findOne({
                    _id: id
                }, cb);
            },
            function(giftCard, cb) {
                if (!giftCard) {
                    callback();
                } else {
                    QRCode.toDataURL(text, function(err, dataUrl) {
                        // this dataUrl is the base64 encoded string of image data as mentioned in QRCode docs
                        cb(err, giftCard, dataUrl);
                    });
                }
            },
            function(giftCard, dataUrl, cb) {
                var redeem = {
                    redeemQRCode: text,
                    redeemQRCodePicture: dataUrl,
                    redeemed: false,
                    timestamp: Date.now()
                };
                giftCard.giftCardRedeems.push(redeem);
                giftCard.save(function(err, savedCard) {
                    if(err) {
                        cb(err);
                    } else {
                        var result;
                        _.forEach(savedCard.giftCardRedeems, function(redeem) {
                            if(redeem.redeemQRCode === text) {
                                result = redeem;
                                // break early
                                return false;
                            }
                        });
                        cb(null, result);
                    }
                });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    /**
     * Redeem method
     * @param qrCode {String} the qrCode
     * @param callback {Function<error:Error, result:GiftCard>} the callback function
     */
    redeem: function(qrCode, amount, currentUser, callback) {
        logger.info('Redeeming gift card for qrCode ' + qrCode);
        async.waterfall([
            function(cb) {
                GiftCard.findOne({
                    'giftCardRedeems.redeemQRCode': qrCode
                }, cb);
            },
            function(giftCard, cb) {
                if (giftCard) {
                    cb(null, giftCard);
                } else {
                    logger.info('Gift card redeem not found for qrCode ' + qrCode);
                    cb(new NotFoundError('Gift Card not found for given QR Code'));
                }
            },
            function(giftCard, cb) {
                var isAuthorized = false;
                // authorization
                _.forEach(currentUser.userRoles, function(userRole) {
                    if (userRole.businessId === giftCard.businessId && (userRole.role === helper.userRoles.BUSINESS_ADMIN || helper.userRoles.BUSINESS_EMPLOYEE)) {
                        // user is authorized
                        isAuthorized = true;
                        // break loop early
                        return false;
                    }
                });
                if (isAuthorized) {
                    cb(null, giftCard);
                } else {
                    cb(new UnauthorizedError('user is not authorized'));
                }
            },
            function(giftCard, cb) {
                // validation
                if (amount > giftCard.quantity) {
                    cb(new ValidationError('Not enough quantity'));
                } else {
                    _.forEach(giftCard.giftCardRedeems, function(redeem) {
                        if(redeem.redeemQRCode === qrCode) {
                            _.extend(redeem, {redeemed: true, amount: amount});
                            // break early
                            return false;
                        }
                    });
                    _.extend(giftCard, { quantity: giftCard.quantity - amount });
                    giftCard.save(cb);
                }
            }
        ], callback);
    },

    /**
     * Get total Redeemed amount for ownerId
     * @param id {String} the owner Id
     * @param callback {Function<error:Error, result:Number>} the callback function
     */
    getTotalRedeemedAmount: function(id, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(id, 'id', error)) {
            callback(error.Err);
        } else {
            async.waterfall([
                function(cb) {
                    GiftCard.find({
                        ownerId: id,
                        status: helper.giftCardStatus.ACTIVE
                    }, cb);
                },
                function(giftCards, cb) {
                    if (!giftCards) {
                        return cb(new NotFoundError('GiftCard is not exist with ownerId: ' + id));
                    }
                    var amount = 0;
                    // for each gift card calculate the total redemeed amount of inner giftCardRedeems resource
                    _.forEach(giftCards, function(giftCard) {
                        _.forEach(giftCard.giftCardRedeems, function(redeem) {
                            if(redeem.amount) {
                                amount += redeem.amount;
                            }
                        });
                    });
                    cb(null, amount);
                },
            ], function(err, amount) {
                callback(err, amount);
            });
        }
    }
};

module.exports = GiftCardService;
