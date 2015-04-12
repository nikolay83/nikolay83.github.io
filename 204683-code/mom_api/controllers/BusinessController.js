/* jshint unused: false */
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents controller for Business.
 *
 * Changes in version 1.1:
 *  - Fixed the issue in updateMyBusinessProfile() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
'use strict';

var config = require('config'), options,
    _ = require('lodash'),
    async = require('async'),
    controllerHelper = require('./controllerHelper');
var logger = require('../logger').getLogger();
var NotFoundError = require('../errors/NotFoundError'),
    ValidationError = require('../errors/ValidationError');

var businessService = require('../services/businessService'),
    userService = require('../services/userService');

var userRoles = {
    BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE',
    BUSINESS_ADMIN: 'BUSINESS_ADMIN'
};

var operationTypes = {
    POST: 'POST',
    PUT: 'PUT'
};

var _validateUser = function(operationType, entity, callback) {
    var error = controllerHelper.checkDefined(entity, 'User Resource');
    if (error) {
        return callback(error);
    }
    if (operationType === operationTypes.POST) {
        // validate every required field
        error = controllerHelper.checkString(entity.firstName, 'First Name') || controllerHelper.checkString(entity.lastName, 'Last Name') ||
            controllerHelper.checkEmail(entity.email, 'User Email') || controllerHelper.checkDefined(entity.userRoles, 'User roles') ||
            controllerHelper.checkDefined(entity.password, 'Password') || controllerHelper.checkArray(entity.userRoles, 'User roles');
    } else if (operationType === operationTypes.PUT) {
        // update operation. Only validate if the given property is defined
        if (entity.firstName) {
            error = controllerHelper.checkString(entity.firstName, 'First Name');
        }
        if (entity.lastName) {
            error = error || controllerHelper.checkString(entity.lastName, 'Last Name');
        }
        if (entity.email) {
            error = error || controllerHelper.checkEmail(entity.email, 'User Email');
        }
        if (entity.password) {
            error = error || controllerHelper.checkDefined(entity.password, 'Password');
        }
    }
    _.extend(entity, {
        isFirstNamePublic : true,
        isLastNamePublic : true,
        isEmailPublic : true,
        isLocationPublic : true,
        isPicturePublic : true
    });
    callback(error, entity);
};

var _validateBusiness = function(operationType, entity, callback) {
    var error;
    if (operationType === operationTypes.PUT) {
        // update operation. Only validate those properties that are defined
        if (entity.name) {
            error = controllerHelper.checkString(entity.name, 'name');
        }
        if (entity.type) {
            error = error || controllerHelper.checkString(entity.type, 'type');
        }
        if (entity.description) {
            error = error || controllerHelper.checkString(entity.description, 'description');
        }
        if (entity.telephoneNumber) {
            error = error || controllerHelper.checkString(entity.telephoneNumber, 'telephoneNumber');
        }
        if (entity.address) {
            error = error || controllerHelper.checkString(entity.address, 'address');
        }
        if (entity.businessHours) {
            error = error || controllerHelper.checkString(entity.businessHours, 'businessHours');
        }
    }
    callback(error, entity);
};

var getMyBusinessProfile = function(req, res, next) {
    var businessIds = _.pluck(req.user.userRoles, 'businessId');
    businessService.getByIds(businessIds, function(err, result) {
        if(err) {
            return next(err);
        }
        var transformed = result.map(function (item) {
            item = item.toObject();
            item.id = item._id;
            return item;
        });
        req.data = {
            status: controllerHelper.HTTP_OK,
            content: transformed
        };
        next();
    });
};

var BusinessController = {
    /**
     * Controller init method.
     * This method performs some controller level initialization tasks
     * This method will be called once while app start
     *
     * @param  {Object}     options         Controller options as defined in configuration
     * @param  {Object}     config          Global application configuration object
     */
    init: function(controllerOptions, globalConfig) {
        config = globalConfig;
        options = controllerOptions;
    },

    getMyBusinessProfile: getMyBusinessProfile,

    getBusinessProfile: function(req, res, next) {
        var id = req.params.id;
        if (req.data) {//handled by my route
            return next();
        }
        businessService.get(id, function(err, business) {
            if (err) {
                next(err);
            } else if (!business) {
                next(new NotFoundError('Business is not found with id: ' + req.params.id));
            } else {
                var transformed = controllerHelper.filterBusinesses(business);
                req.data = {
                    status: controllerHelper.HTTP_OK,
                    content: transformed
                };
                next();
            }
        });
    },
    getBusinessReport: function(req, res, next) {
        next(new ValidationError('Operation not supported'));
    },

    getBusinessEmployees: function(req, res, next) {
        async.waterfall([
            function(cb) {
                var user = req.user;
                var ids = [];
                _.forEach(user.userRoles, function(role) {
                    if(role.role === userRoles.BUSINESS_ADMIN) {
                        ids.push(role.businessId);
                    }
                });
                var criteria = {
                    filter: {
                        'userRoles.businessId': {
                            '$in': ids
                        },
                        'userRoles.role': userRoles.BUSINESS_EMPLOYEE
                    }
                };
                userService.search(criteria, cb);
            }
        ], function(err, result) {
            if (err) {
                return next(err);
            }
            // result is the search result resource object. For this method search is not needed. So only return the records
            var transformed = controllerHelper.filterUsers(result.items);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },


    addBusinessEmployee: function(req, res, next) {
        var entity = req.body;
        async.waterfall([
            function(cb) {
                _validateUser(operationTypes.POST, entity, cb);
            },
            function(validatedEntity, cb) {
                // create user
                userService.create(validatedEntity, cb);
            }
        ], function(err, user) {
            if (err) {
                return next(err);
            }
            var transformed = controllerHelper.filterUsers(user);
            req.data = {
                status: controllerHelper.HTTP_CREATED,
                content: transformed
            };
            // set location header
            res.header('Location', req.protocol + '://' + req.headers.host + '/users/' + transformed.id);
            next();
        });
    },


    deleteBusinessEmployee: function(req, res, next) {
        userService.delete(req.params.id, function(err) {
            if(err) {
                return next(err);
            }
            req.data = {
                status: controllerHelper.HTTP_NO_CONTENT
            };
            next();
        });
    },


    updateBusinessEmployee: function(req, res, next) {
        var entity = req.body,
            id = req.params.id;
        async.waterfall([
            function(cb) {
                _validateUser(operationTypes.PUT, entity, cb);
            },
            function(validatedEntity, cb) {
                // update user
                userService.update(id, validatedEntity, cb);
            }
        ], function(err, user) {
            if (err) {
                return next(err);
            }
            var transformed = controllerHelper.filterUsers(user);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },


    updateMyBuninessProfile: function(req, res, next) {
        var entity = req.body,
            user = req.user;
        async.waterfall([
            function(cb) {
                _validateBusiness(operationTypes.PUT, entity, cb);
            },
            function(validatedEntity, cb) {
                var businessId = entity._id;
                businessService.update(businessId, validatedEntity, cb);
            }
        ], function(err, result) {
            if (err) {
                return next(err);
            }
            var transformed = controllerHelper.filterBusinesses(result);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },


    verifyMyBuninessProfile: function(req, res, next) {
        var user = req.user;
        async.waterfall([
            // validate credit card
            function(cb) {
                var entity = req.body,
                    creditCard = entity.creditCard;
                var error = controllerHelper.checkDefined(creditCard, 'Credit Card') || controllerHelper.checkString(creditCard.creditCardNumber, 'Credit Card Number') || controllerHelper.checkString(creditCard.cardHolderName, 'Card Holder Name') ||
                    controllerHelper.checkString(creditCard.verificationCode, 'CVV') || controllerHelper.checkString(creditCard.expirationYear, 'Expiration Year') ||
                    controllerHelper.checkString(creditCard.expirationMonth, 'Expiration Month') || controllerHelper.checkString(entity.firstName, 'First Name') ||
                    controllerHelper.checkString(entity.lastName, 'Last Name');
                cb(error, entity);
            },
            function(entity, cb) {
                businessService.verify(entity, user, cb);
            }
        ], function(err, result) {
            if (err) {
                return next(err);
            }
            var transformed = controllerHelper.filterBusinesses(result);
            req.data = {
                status: controllerHelper.HTTP_CREATED,
                content: transformed
            };
            next();
        });
    },
    notifyExpiration: function(req, res, next) {
        var payload = req.body;
        logger.info('Webhooks called ' + JSON.stringify(payload));
        businessService.parseWebhookNotification(payload, function(err) {
            if (err) {
                logger.error('Error Parsing webhook notificaiton ' + JSON.stringify(err));
            }
        });
        res.send(controllerHelper.HTTP_OK);
    }
};



module.exports = BusinessController;
