'use strict';

/**
 * UserController
 * This controller exposes REST actions for user
 */

/* Globals */
var config, options,
  ValidationError = require('../errors/ValidationError'),
  NotFoundError = require('../errors/NotFoundError'),
  async = require('async'),
  _ = require('lodash'),
  controllerHelper = require('./controllerHelper'),
  giftCardOfferService = require('../services/giftCardOfferService');

var operationTypes = {
  POST: 'POST',
  PUT: 'PUT'
};
var logger = require('../logger').getLogger();

/**
 * Controller init method.
 * This method performs some controller level initialization tasks
 * This method will be called once while app start
 *
 * @param  {Object}     options         Controller options as defined in configuration
 * @param  {Object}     config          Global application configuration object
 */
exports.init = function(controllerOptions, globalConfig) {
  config = globalConfig;
  options = controllerOptions;
};

/**
 * Validate the given entity.
 * Validation is performed before save or update operation
 *
 * @param  {Entity}     entity      Validate the given entity based on PUT or POST operation
 * @param  {Function}   callback    callback function<error, result>
 */
var validateEntity = function(operationType, entity, callback) {
  var error;
  // if it is a post operation. All fields are mandatory
  if(operationType === operationTypes.POST) {
    error = controllerHelper.checkString(entity.businessId, 'businessId') || controllerHelper.checkString(entity.businessName, 'businessName') ||
              controllerHelper.checkString(entity.businessType, 'businessType') || controllerHelper.checkString(entity.businessAddress, 'businessAddress') ||
              controllerHelper.checkString(entity.businessPicture, 'businessPicture') || controllerHelper.checkPositiveNumber(entity.discount, 'discount') ||
              controllerHelper.checkDate(entity.activationDateTime, 'activationDateTime') || controllerHelper.checkDate(entity.endDateTime, 'endDateTime') ||
              controllerHelper.checkString(entity.description, 'description') || controllerHelper.checkString(entity.status, 'status') ||
              controllerHelper.checkPositiveNumber(entity.totalQuantity, 'totalQuantity') || controllerHelper.checkPositiveNumber(entity.availableQuantity, 'availableQuantity');
  }
  callback(error, entity);
};

var addProperties = function(req, operationType, entity) {
  if(operationType === operationTypes.POST) {
    entity.createdOn = new Date();
    entity.modifiedOn = new Date();
    // req.user is set by the auth middleware
    if(req.user) {
      entity.createdBy = req.user.id;
      entity.modifiedBy = req.user.id;
    }
  } else if(operationType === operationTypes.PUT) {
    entity.modifiedOn = new Date();
    // req.user is set by the auth middleware
    if(req.user) {
      entity.modifiedBy = req.user.id;
    }
  }
};

var validateCommentEntity = function(entity, callback) {
  var error = controllerHelper.checkString(entity.userId, 'userId') || controllerHelper.checkString(entity.comment, 'comment') ||
            controllerHelper.checkString(entity.giftCardOfferId, 'giftCardOfferId');
  callback(error, entity);
};

/**
 * Route handler for POST /giftCardOffers
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.createGiftCardOffer = function(req, res, next) {
  // validate the fields
  var entity = req.body;
  if(!entity) {
    return next(new ValidationError('Request body cannot be empty'));
  }
  async.waterfall([
    // validate entity
    function(cb) {
      validateEntity(operationTypes.POST, entity, cb);
    },
    function(validatedEntity, cb) {
      addProperties(req, operationTypes.POST, entity);
      // create entity
      giftCardOfferService.create(validatedEntity, cb);
    }
  ], function(err, result) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(result, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'resaleForGiftCard', 'expirationDate', 'condition', 'redeemedQuantity']);
    // set location header
    res.header('Location', req.headers.host + '/giftCardOffers/' + transformed.id);
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for GET /giftCardOffers
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.searchGiftCardOffer = function(req, res, next) {
  var query = req.query;
  logger.info('Query params ' + JSON.stringify(query));
  var error = controllerHelper.checkPositiveNumber(query.pageSize, 'pageSize');
  if(query.pageNumber !== 0) {
    // check page postive number
    error = error || controllerHelper.checkPositiveNumber(query.pageNumber, 'pageNumber');
  }
  if(error) {
    return next(error);
  }
  giftCardOfferService.search(query, function(err, result) {
    if(err) {
      return next(err);
    }
    // transform result
    result.items = controllerHelper.filterObject(result.items, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'resaleForGiftCard', 'expirationDate', 'condition', 'redeemedQuantity']);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: result
    };
    next();
  });
};

var _getGiftCardOffer = function(req, res, next) {
  var id = req.params.id;
  giftCardOfferService.get(id, function(err, result) {
    if(err) {
      return next(err);
    } else if(!result) {
      return next(new NotFoundError('Gift card offer not found'));
    }
    var transformed = controllerHelper.filterObject(result, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'resaleForGiftCard', 'expirationDate', 'condition', 'redeemedQuantity']);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

var _getMultiple = function(req, res, next) {
  var ids = req.query.id;
  giftCardOfferService.getMultiple(ids, function(err, result) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(result, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'resaleForGiftCard', 'expirationDate', 'redeemedQuantity']);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for GET /giftCardOffers/:id
 * This method proxies the request to either get gift card offer or get multiple gift card offers based on the id
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getGiftCardOffer = function(req, res, next) {
  var id = req.params.id;
  if(id === 'multiple') {
    _getMultiple(req, res, next);
  } else {
    _getGiftCardOffer(req, res, next);
  }
};

/**
 * Route handler for DELETE /giftCardOffers/:id
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.deleteGiftCardOffer = function(req, res, next) {
  var id = req.params.id;
  giftCardOfferService.delete(id, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_NO_CONTENT
    };
    next();
  });
};

/**
 * Route handler for PUT /giftCardOffers/:id
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.updateGiftCardOffer = function(req, res, next) {
  var id = req.params.id;
  var entity = req.body;
  async.waterfall([
    function(cb) {
      // check if entity exists
      giftCardOfferService.get(id, cb);
    },
    function(giftCardOffer, cb) {
      if(giftCardOffer) {
        // validate the entity
        validateEntity(operationTypes.PUT, entity, cb);
      } else {
        cb(new NotFoundError('Gift card offer not found with id ' + id));
      }
    },
    function(validatedEntity, cb) {
      addProperties(req, operationTypes.POST, entity);
      // there may be a scenario when user intentionally pass id field in request.body
      _.omit(validatedEntity, 'id', '_id');
      // update entity
      giftCardOfferService.update(id, validatedEntity, cb);
    }
  ], function(err, result) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(result, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'resaleForGiftCard', 'expirationDate', 'condition', 'redeemedQuantity']);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for POST /giftCardOffers/{id}/cancel
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.cancelGiftCardOffer = function(req, res, next) {
  var id = req.params.id;
  giftCardOfferService.cancel(id, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK
    };
    next();
  });
};

/**
 * Route handler for GET /giftCardOffers/{id}/owners
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getGiftCardOfferOwner = function(req, res, next) {
  var id = req.params.id;
  giftCardOfferService.getOwners(id, function(err, result) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterUsers(result);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for POST /giftCards
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.purchaseGiftCards = function(req, res, next) {
  var shoppingCart = req.body;
  var error = controllerHelper.checkDefined(shoppingCart.items, 'items') || controllerHelper.checkDefined(shoppingCart.creditCard, 'creditCard');

  if(error) {
    return next(error);
  }
  giftCardOfferService.purchase(shoppingCart, req.user, function(err, result) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(result, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'expirationDate']);
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for POST /giftCardOffers/:id/comments
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.addComment = function(req, res, next) {
  var entity = req.body,
    offerId = req.params.id;
  req.body.userId = req.user.id;
  req.body.username = req.user.firstName;
  // client may intentionally pass request param offer id to be different than entity offerId
  if(entity.giftCardOfferId !== offerId) {  
    return next(new ValidationError('request body offer ID should be same as path param offer ID'));
  }
  async.waterfall([
    function(cb) {
      validateCommentEntity(entity, cb);
    },
    function(validatedEntity, cb) {
      // check if offer exists
      giftCardOfferService.get(offerId, function(err, giftCardOffer) {
        if(giftCardOffer) {
          // add gift card comment
          giftCardOfferService.addComment(validatedEntity, cb);
        } else {
          cb(new NotFoundError('Gift Card Offer not found for offerId' + offerId));
        }
      });
    },
  ], function(err, result) {
    if(err) {
      return next(err);
    }
    // transform result
    var transformed = controllerHelper.filterObject(result);
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for DELETE /giftCardOffers/:id/comments/:commentId
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.deleteComment = function(req, res, next) {
  var offerId = req.params.id,
    commentId = req.params.commentId;

  async.waterfall([
    function(cb) {
      giftCardOfferService.get(offerId, function(err, giftCardOffer) {
        if(giftCardOffer) {
          giftCardOfferService.removeComment(offerId, commentId, cb);
        } else {
          cb(new NotFoundError('Gift Card Offer not found for offerId' + offerId));
        }
      });
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_NO_CONTENT
    };
    next();
  });
};

/**
 * Route handler for GET /giftCardOffers/:id/comments
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getComments = function(req, res, next) {
  var offerId = req.params.id;
  giftCardOfferService.getComments(offerId, function(err, comments) {
    if(err) {
      return next(err);
    }
    // transform result
    var transformed = controllerHelper.filterObject(comments);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};