/* jshint camelcase: false */
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service provides methods to manage business.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

var config = require('config'),
    helper = require('../helpers/helper'),
    _ = require('lodash'),
    async = require('async'),
    braintree = require('braintree');

var BusinessSchema = require('../models/Business').BusinessSchema,
  db = require('../datasource').getDb(config.MONGODB_URL),
  Business = db.model('Business', BusinessSchema);

var GiftCardOfferService = require('./giftCardOfferService');
var GiftCardService = require('./giftCardService');
var geocoder = require('node-geocoder');
var extra = {};
var logger = require('../logger').getLogger();
var notifications = {
  subscriptionCanceled: 'subscriptionCanceled',
  subscriptionExpired: 'subscriptionExpired',
  subscriptionChargedUnsuccessfully: 'subscriptionChargedUnsuccessfully'
};

/**
 * Connects the braintree payment gateway
 * @private
 *
 * @return {Object}       Braintree gateway object
 */
var _connectGateway = function() {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.MERCHANT_ID,
    publicKey: config.PUBLIC_KEY,
    privateKey: config.PRIVATE_KEY
  });
  return gateway;
};

var _getGeocoder = function() {
  return geocoder.getGeocoder(config.GEOCODER_PROVIDER, config.GEOCODER_HTTPADAPTER, extra);
};

var BusinessService = {
    /**
     * Create business.
     * @param business {Business} the business
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    create: function(business, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(business, 'business', error)
            //temporary disable validation
            //social network registration doesn't provide these information
            //!helper.validateRequiredParameter(business.name, 'business.name', error) ||
            //!helper.validateRequiredParameter(business.type, 'business.type', error)
        ) {
            callback(error.Err);
        } else {
            Business.create(business, callback);
        }
    },


    /**
     * Get business.
     * @param id {String} the business id
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    get: function(id, callback) {
        Business.findOne({
            _id: id
        }).exec(callback);
    },


    /**
     * Get business by ids.
     * @param ids {[String]} the business ids
     * @param callback {Function<error:Error, result:Businesses>} the callback function
     */
    getByIds: function(ids, callback) {
        Business.find({
            _id: {
                '$in': ids
            }
        }).exec(callback);
    },


    /**
     * Update business.
     * @param business {Business} the business
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    update: function(id, business, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(business, 'business', error) ||
            !helper.validateRequiredParameter(id, 'id', error)) {
            callback(error.Err);
        } else {
            Business.findOne({
                _id: id
            }, function(err, existing) {
                if (err) {
                    callback(err);
                } else if (existing) {
                    _.extend(existing, business);
                    existing.save(callback);
                } else {
                    callback(new Error('Business not found with id: ' + business.id));
                }
            });
        }
    },

    /**
     * Delete business.
     * @param id {String} the business id
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    delete: function(id, callback) {
        // It cann't be deleted if there're active gift cards (of give card offers) existing in system
        async.waterfall([
            // Get buisness type ids by type name
            function(cb) {
                GiftCardOfferService.search({
                    'businessId': id
                }, cb);
            },
            function(giftCardOffer, cb) {
                if (giftCardOffer === null) {
                    cb(null);
                } else {
                    cb(new Error('Business with id: ' + id + ' is exist in giftCardOffer, can not be deleted'));
                }
            },
            function(cb) {
                GiftCardService.search({
                    'businessId': id
                }, cb);
            },
            function(giftCard, cb) {
                if (giftCard === null) {
                    cb(null);
                } else {
                    cb(new Error('Business with id: ' + id + ' is exist in giftCard, can not be deleted'));
                }
            },
            function() {
                Business.remove({
                    _id: id
                }, callback);
            }
        ], function(err) {
            callback(err);
        });
    },

    /**
     * Search businesses with criteria.
     * @param criteria {Object} the criteria
     * ==== The criteria parameters ===
     * pageSize              {Integer} The page size.
     * pageNumber            {Integer} The page number.
     * sortBy                {String}  The name of the property that will be used to sort the results, default to "id".
     * sortOrder             {String}  The sorting order. Must be one of "Ascending", "Descending", default to "Ascending".
     * businessName          {String}  This is used to partial match business name.
     * businessType          {String}  This is used to partial match business type.
     * businessAddress       {String}  This is used to partial match business address.
     * isVerified            {Boolean} This is used to partial match isVerified
     * isSubscriptionExpired {Boolean} This is used to partial match isSubscriptionExpired
     * ===============================
     * @param callback {Function<error:Error, result:SearchResult<Business>>} the callback function
     */
    search: function(criteria, callback) {
        var pageSize = criteria.pageSize || config.DEFAULT_PAGE_SIZE;
        var pageNumber = criteria.pageNumber || 1;
        var orderBy = criteria.sortBy || config.DEFAULT_SORT_BY;
        var order = criteria.sortOrder || config.DEFAULT_SORT_ORDER;

        var error = {};
        if (!helper.validatePageSize(pageSize, error) ||
            !helper.validatePageNumber(pageNumber, error) ||
            !helper.validateOrderBy(orderBy, error) ||
            !helper.validateOrder(order, error) ||
            !helper.validateBoolean(criteria.isVerified, error) ||
            !helper.validateBoolean(criteria.isSubscriptionExpired, error)) {
            callback(error.Err);
        } else {
            var filter = {};

            if (criteria.businessName) {
                filter.businessName = {
                    '$regex': criteria.businessName
                };
            }

            if(criteria.businessType) {
                filter.businessType = {
                    '$regex': criteria.businessType
                };
            }

            if (criteria.businessAddress) {
                filter.businessAddress = {
                    '$regex': criteria.businessAddress
                };
            }

            if (criteria.isVerified) {
                filter.isVerified = criteria.isVerified;
            }

            if (criteria.isSubscriptionExpired) {
                filter.isSubscriptionExpired = criteria.isSubscriptionExpired;
            }

            if (orderBy === 'id') {
                orderBy = '_id';
            }
            var sortBy = {};
            sortBy[orderBy] = helper.getOrder(order);

            async.waterfall([
                function(cb) {
                    if (0 === parseInt(pageNumber)) {
                        Business.find(filter).sort(sortBy).exec(function(err, items) {
                            if (err) {
                                cb(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: 1,
                                    pageNumber: 0,
                                    totalRecords: resultItems.length,
                                    items: resultItems
                                };
                                cb(null, result);
                            }
                        });
                    } else {
                        Business.paginate(filter, pageNumber, pageSize, function(err, pageCount, items, itemCount) {
                            if (err) {
                                cb(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: pageCount,
                                    pageNumber: parseInt(pageNumber),
                                    totalRecords: itemCount,
                                    items: resultItems
                                };
                                cb(null, result);
                            }
                        }, {
                            sortBy: sortBy
                        });

                    }

                }
            ], function(err) {
                callback(err);
            });
        }
    },

    /**
     * Verify the credit card.
     * @param creditCard {Object} the credit card
     * @param callback {Function<error:Error, result:Object>} the callback function
     */
    verify: function(entity, user, callback) {
        var gateway = _connectGateway();
        var creditCard = entity.creditCard;
        async.waterfall([
            function(cb) {
                // create customer
                var customerRequest = {
                    firstName: entity.firstName,
                    lastName: entity.lastName,
                    creditCard: {
                        number: creditCard.creditCardNumber,
                        cvv: creditCard.verificationCode,
                        expirationMonth: creditCard.expirationMonth,
                        expirationYear: creditCard.expirationYear
                    }
                };
                logger.info('Sending request to braintree for customer create');
                gateway.customer.create(customerRequest, function(err, result) {
                    if (err) {
                        logger.error('Error creating customer ' + JSON.stringify(err));
                    } else {
                        logger.info('Response from braintree ' + JSON.stringify(result));
                    }
                    cb(err, result);
                });
            },
            function(result, cb) {
                var customer = result.customer;
                // if customer created successfully
                if (result.success) {
                    var subscriptionRequest = {
                        paymentMethodToken: customer.creditCards[0].token,
                        planId: 'SubscriptionPlan'
                    };
                    logger.info('Sending subscription request to braintree');
                    gateway.subscription.create(subscriptionRequest, function(err, result) {
                        if (err) {
                            logger.error('Error creating subscription ' + JSON.stringify(err));
                        } else {
                            logger.info('Response from braintree ' + JSON.stringify(result));
                        }
                        cb(err, customer, result);
                    });
                } else {
                    cb(result);
                }
            },
            function(customer, result, cb) {
                // if subscription successfull
                logger.info('Business subscription status ' + JSON.stringify(result));
                // update the business and set isVerified to true
                if (result.success) {
                    Business.findOne({_id: user.userRoles[0].businessId }, function(err, business) {
                        cb(err, result, business);
                    });
                } else {
                    cb(result);
                }
            },
            function(subscription, business, cb) {
                _.extend(business, {
                    isVerified: true,
                    braintreeAccountId: subscription.merchantAccountId
                });
                business.save(function(err, savedBusiness) {
                    cb(err, savedBusiness);
                });
            }
        ], function(err, result) {
            if (err) {
                logger.error('Error verifying Business Profile ' + err);
            }
            callback(err, result);
        });
    },

    /**
     * Get the coordinate by address.
     * @param address {String} the address
     * @param callback {Function<error:Error, result:Object>} the callback function
     * the result will be like:
     * [{
     *     "latitude": xxxx,
     *     "longitude": xxxx,
     *      ...
     * }]
     */
    getCoordinateByAddress: function(address, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(address, 'address', error)) {
            callback(error.Err);
        } else {
            // Use geocoder to get coordinate
            // More detail see https://github.com/nchaulet/node-geocoder
            var geocoder = _getGeocoder();
            geocoder.geocode(address, function(err, result) {
              if (err) {
                return callback(err);
              }
              var coordinates = [];
              coordinates[0] = result[0].latitude;
              coordinates[1] = result[0].longitude;
              callback(err, coordinates);
            });
        }
    },

    /**
     * Get Business by braintreeAccountId.
     * @param id {String} the braintreeAccountId
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    getByAccountId: function(id, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(id, 'id', error)) {
            callback(error.Err);
        } else {
            Business.findOne({
                braintreeAccountId: id
            }).exec(callback);
        }
    },
    /**
     * Fetch all business entities
     *
     * @param  {Function}   callback  callback function
     */
    getAll: function(callback) {
        Business.find(callback);
    },
    parseWebhookNotification: function(payload, callback) {
      var gateway = _connectGateway();
      async.waterfall([
          function(cb) {
              gateway.webhookNotification.parse(payload.bt_signature, payload.bt_payload, cb);
          },
          function(webhookNotification, cb) {
              if (notifications[webhookNotification.kind]) {
                  // error with subscription update business profile
                  Business.findOne({braintreeAccountId: webhookNotification.subscription.merchantAccountId}, cb);
              } else {
                  cb();
              }
          },
          function(business, cb) {
              if (business) {
                  _.extend(business, {
                      isSubscriptionExpired: true
                  });
                  business.save(function(err, business) {
                      cb(err, business);
                  });
              } else {
                  cb();
              }
          }
      ], function(err, business) {
          if (business) {
              logger.info('Business subscription updated ' + JSON.stringify(business));
          }
          callback(err);
      });
  }

};

module.exports = BusinessService;
