'use strict';

/**
 * GiftCardOfferService
 * This class exports the contract methods between GiftCardOffer Model and controllers
 *
 * Changes in version 1.1:
 *  - Convert the values to number while calculating the values.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

/* Globals */
var config = require('config');

var GiftCardOfferSchema = require('../models/GiftCardOffer').GiftCardOfferSchema,
  GiftCardSchema = require('../models/GiftCard').GiftCardSchema,
  GiftCardOfferCommentSchema = require('../models/GiftCardOfferComment').GiftCardOfferCommentSchema,
  UserSchema = require('../models/User').UserSchema,
  db = require('../datasource').getDb(config.MONGODB_URL),
  GiftCardOffer = db.model('GiftCardOffer', GiftCardOfferSchema),
  GiftCard = db.model('GiftCard', GiftCardSchema),
  GiftCardOfferComment = db.model('GiftCardOfferComment', GiftCardOfferCommentSchema),
  User = db.model('User', UserSchema);

var businessService = require('./businessService');
var async = require('async');
var logger = require('../logger').getLogger();
var helper = require("../helpers/helper");
var braintree = require('braintree');
var _ = require('lodash'),
  ValidationError = require('../errors/ValidationError'),
  InternalServerError = require('../errors/InternalServerError'),
  NotFoundError = require('../errors/NotFoundError');

var giftCardOfferStatus = {
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED'
};
var giftCardStatus = {
  ACTIVE: 'ACTIVE',
  FOR_RESALE: 'FOR_RESALE',
  INACTIVE: 'INACTIVE'
};
var sortOrders = {
  Ascending: 'asc',
  Descending: 'desc'
};
// Global variable to store user coordinate for each request
var userCoordinates = null;

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

/**
 * Create a giftCardOffer document in database
 *
 * @param  {Object}     entity      GiftCardOffer entity to create
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.create = function(entity, callback) {
  GiftCardOffer.create(entity, callback);
};

/**
 * Get a giftCardOffer from the database
 *
 * @param  {UUID}       id          id of the giftCardOffer to fetch
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
var getById = exports.get = function(id, callback) {
  GiftCardOffer.findOne({_id: id}, callback);
};

/**
 * Update a giftCardOffer
 *
 * @param  {UUID}       id          id of the giftCardOffer to update
 * @param  {Object}     entity      gift Card offer entity to persist
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.update = function(id, entity, callback) {
  async.waterfall([
    function(cb) {
      getById(id, cb);
    },
    function(giftCardOffer, cb) {
      if(giftCardOffer) {
        // only DRAFT status giftcards can be updated
        if(giftCardOffer.status.toUpperCase() === giftCardOfferStatus.DRAFT) {
          _.extend(giftCardOffer, entity);
          giftCardOffer.save(cb);
        } else {
          cb(new ValidationError('Only DRAFT status gift card offers can be updated'));
        }
      } else {
        cb(new NotFoundError('Gift Card offer not found with id ' + id));
      }
    }
  ], callback);
};

/**
 * Delete a giftCardOffer
 *
 * @param  {UUID}       id          id of the giftCardOffer to fetch
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.delete = function(id, callback) {
  async.waterfall([
    // check if giftcard offer exists
    function(cb) {
      getById(id, cb);
    },
    function(giftCardOffer, cb) {
      if(giftCardOffer) {
        giftCardOffer.remove(cb);
      } else {
        cb(new NotFoundError('Gift Card offer not found with id ' + id));
      }
    }
  ], callback);
};

/**
 * Helper function to get the business coordinates for fiven business entity
 *
 * @param  {Object}     business      business entity
 * @param  {Function}   callback      callback function<error, result>
 */
var getBusinessCoordinates = function(business, callback) {
  // if business coordinate doesn't exist
  if(business.coordinates.length < 1) {
    business.coordinates = businessService.getCoordinateByAddress(business.address, function(err, coordinates) {
      if(err) {
        return callback(err);
      }
      var updated = _.extend(business.toObject(), {coordinates: coordinates});
      callback(null, updated);
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
  var lat1 = userCoordinates[0], lon1 = userCoordinates[1], lat2 = business.coordinates[0], lon2 = business.coordinates[1];
  var radlat1 = Math.PI * lat1/180;
  var radlat2 = Math.PI * lat2/180;
  //var radlon1 = Math.PI * lon1/180;
  //var radlon2 = Math.PI * lon2/180;
  var theta = lon1-lon2;
  var radtheta = Math.PI * theta/180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515;
  // calculate distance in meters ( to minimize decimal)
  dist = dist * 1.609344 * 1000;
  logger.info('Computed distance ' + dist);
  GiftCardOffer.findOne({businessId: business._id}, function(err, offer) {
    var result = offer.toObject();
    // adding this distance parameter only for demo purpose to show that the results are actually sorted from nearest to farthest
    result.distance = dist;
    callback(err, result);
  });
};

/**
 * Helper function to calculate the distance between business coordinates and user coordinates
 *
 * @param  {Object}     offers        cards to sort
 * @param  {Function}   callback      callback function<error, result>
 */
var sortByCoordinates = function(offers, callback) {
  logger.info('Sorting gift card offers by user coordinates');
  async.waterfall([
    function(cb) {
      // get businesses
      var businessIds = _.pluck(offers, 'businessId');
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
    function(offers, cb) {
      // sort the gift offers
      var sortedOffers = _.sortBy(offers, function(card) {
        return card.distance;
      });
      cb(null, sortedOffers);
    }
  ], callback);
};

/**
 * Search the gift card offers based on the given criteria
 *
 * @param  {Object}     criteria      criteria upon which to sort the gift card offers
 * @param  {Function}   callback      callback function<error, result>
 */
exports.search = function(criteria, callback) {

  var pageSize = criteria.pageSize || config.DEFAULT_PAGE_SIZE;
  var pageNumber = criteria.pageNumber || 1;
  var orderBy = criteria.sortBy || config.DEFAULT_SORT_BY;
  var order = criteria.sortOrder || config.DEFAULT_SORT_ORDER;

  var error = {};
  if (!helper.validatePageSize(pageSize, error) ||
      !helper.validatePageNumber(pageNumber, error) ||
      !helper.validateOrderBy(orderBy, error) ||
      !helper.validateOrder(order, error) ||
      !helper.validateIntRangeNumber(criteria['availableQuantityRange'], error) ||
      !helper.validateGiftCardOfferStatus(criteria['statuses'], error) ||
      !helper.validateFloatRangeNumber(criteria['discountRange'], error) ||
      !helper.validateFloatRangeNumber(criteria['coordinates'], error) ||
      !helper.validateRangeDate(criteria['dateRange'], error)) {
    callback(error.Err);
  } else {
    var filter = {};

    if (criteria['businessName']) {
      filter['businessName'] = {
        '$regex': criteria.businessName,
        '$options': 'i'
      };
    }

    if (criteria['businessType']) {
      filter['businessType'] = {
        '$regex': criteria.businessType
      };
    }

    if (criteria['availableQuantityRange']) {
      var rangeNum = criteria.availableQuantityRange.split(',');
      filter['quantity'] = {};
      filter['quantity']['$gte'] = parseFloat(rangeNum[0]);
      filter['quantity']['$lte'] = parseFloat(rangeNum[1]);
    }

    if (criteria['businessAddress']) {
      filter['businessAddress'] = {
        '$regex': criteria.businessAddress
      };
    }

    if (criteria['statuses']) {
      var statues = criteria.statuses.split(',');
      for (var i = 0; i < statues.length; i++) {
        statues[i] = helper.trim(statues[i]);
      }

      filter['status'] = {};
      filter['status']['$in'] = statues;
    }

    if (criteria['discountRange']) {
      var rangeNum2 = criteria.discountRange.split(',');
      filter['discount'] = {};
      filter['discount']['$gte'] = parseFloat(rangeNum2[0]);
      filter['discount']['$lte'] = parseFloat(rangeNum2[1]);
    }

    if (criteria['dateRange']) {
      var dataRanges = criteria.dateRange.split(',');

      filter['activationDateTime'] = {};
      filter['activationDateTime']['$gte'] = new Date(dataRanges[0]);
      filter['activationDateTime']['$lte'] = new Date(dataRanges[1] + ' 23:59:59.999');
    }

    if (criteria['description']) {
      filter['description'] = {
        '$regex': criteria.description
      };
    }

    if (orderBy === 'id') {
      orderBy = '_id';
    }
    var sortBy = {};
    sortBy[orderBy] = helper.getOrder(order);


    if (criteria['coordinates'] || 0 === parseInt(pageNumber)) {
      GiftCardOffer.find(filter).sort(sortBy).exec(function(err, items) {
        if (err) {
          callback(err);
        } else if (criteria['coordinates']){
          winston.info('Sorting gift card offers by user coordinates');
          helper._sortByCoordinates(false, criteria.coordinates, items, parseInt(pageSize), parseInt(pageNumber), callback);
        }
        else {
          var resultItems = _.map(items, function(item) {
            return item.toJSON();
          });

          var result = {
            totalPages: 1,
            pageNumber: 0,
            totalRecords: resultItems.length,
            items: resultItems
          };

          callback(null, result);
        }
      });
    } else {
      GiftCardOffer.paginate(filter, pageNumber, pageSize, function(err, pageCount, items, itemCount) {
        if (err) {
          callback(err);
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
          callback(null, result);
        }
      }, {
        sortBy: sortBy
      });

    }
  }
};

/**
 * Map the gift card entity from gift card offer entity
 *
 * @param  {Object}     offer     Gift card offer entity
 * @return {Object}               mapped gift card entity from gift card offer entity fields
 */
var mapGiftCard = function(offer) {
  return {
    businessId: offer.businessId,
    businessType: offer.businessType,
    businessAddress: offer.businessAddress,
    businessTelephone: offer.businessTelephone,
    businessPicture: offer.businessPicture,
    discount: offer.discount,
    status: giftCardStatus.ACTIVE,
    giftCardOfferId: offer._id
  };
};

/**
 * Helper method to implement purchase logic
 * @param  {Object}     itme          shopping card item
 * @param  {Function}   callback      callback function
 */
var doPurchase = function(item, callback) {
  var id = item.giftCardOfferId, quantity = item.quantity;
  async.waterfall([
    function(cb) {
      getById(id, cb);
    },
    function(offer, cb) {
      if(offer) {
        // validate the requested quantity
        if(offer.availableQuantity < quantity) {
          cb(new ValidationError('Not enough quantity available for gift card offer ' + id));
        } else {
          // apply discount
          var price = Number(offer.price) - ((Number(offer.price) * Number(offer.discount))/100);
          var reducedQuantity = Number(offer.availableQuantity) - quantity;
          var giftCard = mapGiftCard(offer);
          giftCard.quantity = quantity;
          _.extend(offer, {availableQuantity: reducedQuantity});
          var result = {
            price: price*Number(quantity),
            card: giftCard,
            offer: offer
          };

          callback(null, result);
        }
      } else {
        // if gift card offer not exist return error
        cb(new NotFoundError('Gift card offer not found for offer id ' + id));
      }
    }
  ], callback);
};

/**
 * Helper method to for the payment of sale of gift card offers
 * @param  {Number}     amount        total amount of transaction
 * @param  {Object}     creditCard    credit card to bill
 * @param  {Function}   callback      callback function
 */
var doPayment = function(amount, creditCard, callback) {
  logger.info('Initializing payment for amount ' + amount);
  var gateway = _connectGateway();
  var saleRequest = {
    amount: amount,
    creditCard: {
      number: creditCard.creditCardNumber,
      cvv: creditCard.verificationCode,
      expirationMonth: creditCard.expirationMonth,
      expirationYear: creditCard.expirationYear
    }
  };
  async.waterfall([
    // bill the credit card
    function(cb) {
      logger.info('Sending transaction request');
      gateway.transaction.sale(saleRequest, cb);
    },
    function(result, cb) {
      if(result.success) {
        logger.info('Credit card billed successfully. Credit amount to business account');
        var creditRequest = {
          amount: amount,
          creditCard: {
            number: '4111111111111111',
            expirationMonth: '05',
            expirationYear: '2017'
          }
        };
        gateway.transaction.credit(creditRequest, cb);
      } else {
        logger.log('Credit card billing failed. Response from Braintree ' + JSON.stringify(result));
        cb(new InternalServerError('Failed to bill credit card'));
      }
    }
  ], callback);
};

/**
 * Helper method to udpate the gift card offer after reducing the quantity
 * @param  {Object}   result    result object as returned by doPurchase
 * @param  {Function} cb        callback function
 */
var updateOffer = function(result, cb) {
  var offer = result.offer;
  offer.save(cb);
};

/**
 * Purchase the gift card offers that are in shopping cart
 *
 * @param  {Object}     shoppingCart  shopping cart containing items and credit card information
 * @param  {Function}   callback      callback function<error, result>
 */
exports.purchase = function(shoppingCart, currentUser, callback) {
  // for each shopping cart item get gift card offer and check available quantity and do the purchase
  async.waterfall([
    function(cb) {
      logger.info('Init purchase');
      async.map(shoppingCart.items, doPurchase, cb);
    },
    function(results, cb) {
      // add the total prices
      var totalPrice = 0;
      _.forEach(results, function(result) {
        totalPrice = totalPrice + result.price;
      });
      cb(null, results, totalPrice);
    },
    function(results, totalPrice, cb) {
      // payment
      doPayment(totalPrice, shoppingCart.creditCard, function(err) {
        cb(err, results);
      });
    },
    function(results, cb) {
      // payment is successfull. create gift Card and reduce quantity for offers
      // decreate offer quantity
      async.map(results, updateOffer, function(err) {
        cb(err, results);
      });
    },
    function(results, cb) {
      logger.info('Gift Card offers updated successfully');
      async.map(results, function(result, callable) {
        result.card.createdOn = new Date();
        result.card.modifiedOn = new Date();
        result.card.createdBy = currentUser._id;
        result.card.modifiedBy = currentUser._id;
        GiftCard.create(result.card, callable);
      }, cb);
    }
  ], callback);
};

/**
 * Cancel a gift card offer identified by id
 *
 * @param  {String}     id            UUID of the gift card offer to cancel
 * @param  {Function}   callback      callback function<error, result>
 */
exports.cancel = function(id, callback) {
  async.waterfall([
    function(cb) {
      // find giftcardoffer by id
      getById(id, cb);
    },
    function(giftCardOffer, cb) {
      if(giftCardOffer) {
        _.extend(giftCardOffer,  {'status': giftCardOfferStatus.CANCELLED});
        giftCardOffer.save(cb);
      } else {
        cb(new NotFoundError('Gift card offer not found with id ' + id));
      }
    }
  ], callback);
};

/**
 * get the owners associated with a gift card offer
 *
 * @param  {String}     id            UUID of the gift card offer to cancel
 * @param  {Function}   callback      callback function<error, result>
 */
exports.getOwners = function(id, callback) {
  async.waterfall([
    // find gift card offer
    function(cb) {
      getById(id, cb);
    },
    function(giftCardOffer, cb) {
      // if giftCardOffer exists
      if(giftCardOffer) {
        GiftCard.find({giftCardOfferId: id}, cb);
      } else {
        cb(new NotFoundError('Gift card offer not found with id ' + id));
      }
    },
    function(giftCards, cb) {
      var ownerIds = _.pluck(giftCards, 'ownerId');
      User.find({id: {'$in':ownerIds}}, cb);
    }
  ], callback);
};

/**
 * Add comment to a gift card offer
 *
 * @param  {Object}     entity        gift card offer comment entity
 * @param  {Function}   callback      callback function<error, result>
 */
exports.addComment = function(entity, callback) {
  var offerId = entity.giftCardOfferId;
  async.waterfall([
    function(cb) {
      getById(offerId, function(err, giftCardOffer) {
        if(giftCardOffer) {
          // add comment
          GiftCardOfferComment.create(entity, cb);
        } else {
          cb(new NotFoundError('Gift Card Offer not found for offerId ' + offerId));
        }
      });
    }
  ], callback);
};

/**
 * Remove a comment
 *
 * @param  {String}     offerId       associated gift card offer Id
 * @param  {String}     commentId     UUID of comment to remove
 * @param  {Function}   callback      callback function<error, result>
 */
exports.removeComment = function(offerId, commentId, callback) {
  async.waterfall([
    function(cb) {
      getById(offerId, function(err, giftCardOffer) {
        if(giftCardOffer) {
          // check if gift card offer comment exists
          GiftCardOfferComment.findOne({_id: commentId}, cb);
        } else {
          cb(new NotFoundError('Gift Card Offer not found for offerId ' + offerId));
        }
      });
    },
    function(giftCardOfferComment, cb) {
      if(giftCardOfferComment) {
        giftCardOfferComment.remove(cb);
      } else {
        cb(new NotFoundError('Gift card offer comment not found'));
      }
    }
  ], callback);
};

/**
 * Get all comments associated with a given gift card offer
 *
 * @param  {String}     id            UUID of the gift card offer to cancel
 * @param  {Function}   callback      callback function<error, result>
 */
exports.getComments = function(offerId, callback) {
  async.waterfall([
    function(cb) {
      getById(offerId, cb);
    },
    function(giftCardOffer, cb) {
      if(giftCardOffer) {
        GiftCardOfferComment.find({giftCardOfferId: offerId}, cb);
      } else {
        cb(new NotFoundError('Gift card offer not found'));
      }
    }
  ], callback);
};

/**
 * Get all Gift card offers
 *
 * @param  {Function}   callback      callback function<error, result>
 */
exports.getAll = function(callback) {
  GiftCardOffer.find(callback);
};

/**
 * Get all gift card offers matching id in ids array
 */
exports.getMultiple = function(ids, callback) {
  GiftCardOffer.find({_id: { '$in': ids}}, callback);
};