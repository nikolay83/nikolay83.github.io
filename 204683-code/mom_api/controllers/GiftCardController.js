/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents controller for Gift Card.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

var GiftCardService = require('../services/giftCardService'),
    logger = require('../logger').getLogger(),
    controllerHelper = require('./controllerHelper'),
    config, options;

var NotFoundError = require('../errors/NotFoundError'),
    ValidationError = require('../errors/ValidationError'),
    async = require('async');

var GiftCardController = {
    init: function(controllerOptions, globalConfig) {
        config = globalConfig;
        options = controllerOptions;
    },

    searchGiftCards: function(req, res, next) {
        var query = req.query;
        logger.info('Query params ' + JSON.stringify(query));
        var error = controllerHelper.checkPositiveNumber(query.pageSize, 'pageSize');
        if (query.pageNumber !== 0) {
            // check page postive number
            error = error || controllerHelper.checkPositiveNumber(query.pageNumber, 'pageNumber');
        }
        if (error) {
            return next(error);
        }
        GiftCardService.search(query, function(err, giftCards) {
            if(err) {
                return next(err);
            }
            // transform result
            var transformed = controllerHelper.filterObject(giftCards, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'expirationDate']);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },


    getGiftCard: function(req, res, next) {
        GiftCardService.get(req.params.id, function(err, giftCard) {
            if(err) {
                return next(err);
            } else if(!giftCard) {
                return next(new NotFoundError('Gift card not found for id ' + req.params.id));
            }
            var transformed = controllerHelper.filterObject(giftCard, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'expirationDate']);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },

    resellGiftCard: function(req, res, next) {
        var id = req.params.id,
            description = req.body.description,
            quantityToSell = req.query.quantityToSell;

        var error = controllerHelper.checkPositiveNumber(quantityToSell, 'quantityToSell') || controllerHelper.checkString(description, 'description');
        if(error) {
            return next(error);
        }
        GiftCardService.resell(id, quantityToSell, description, req.user, function(err, giftCardOffers) {
            if(err) {
                return next(err);
            }
            var transformed = controllerHelper.filterObject(giftCardOffers, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'expirationDate', 'businessTelephone']);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },

    prepareGiftCardForRedeem: function(req, res, next) {
        GiftCardService.prepareForRedeem(req.params.id, function(err, redeem) {
            if(err) {
                return next(err);
            } else if(!redeem) {
                return next(new NotFoundError('GiftCard is not found with id: ' + req.params.id));
            }
            var transformed = controllerHelper.filterObject(redeem, 'redeemedAmount');
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },

    redeemGiftCard: function(req, res, next) {
        var qrCode = req.query.qrCode,
            amount = req.query.amount;
        async.waterfall([
            function(cb) {
                // qrCode would be base64 string for scanned qr code image
                var error = controllerHelper.checkString(qrCode, 'qrCode') || controllerHelper.checkPositiveNumber(amount, 'amount');
                cb(error);
            },
            function(cb) {
                GiftCardService.redeem(qrCode, amount, req.user, cb);
            }
        ], function(err, giftCard) {
            if (err) {
                return next(err);
            }
            var transformed = controllerHelper.filterObject(giftCard, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy', 'expirationDate']);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },
    update: function(req, res, next) {
        GiftCardService.update(req.params.id, req.body, function(err, giftCard) {
            if(err) {
                return next(err);
            } else if(!giftCard) {
                return next(new NotFoundError('GiftCard is not found with id: ' + req.params.id));
            }
            var transformed = controllerHelper.filterObject(giftCard, 'redeemedAmount');
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    },
    getUserTotalRedeemedAmount: function(req, res, next) {
        var user = req.user;
        if(user) {
            GiftCardService.getTotalRedeemedAmount(user._id, function(err, amount) {
                if(err) {
                    return next(err);
                }
                req.data = {
                    status: controllerHelper.HTTP_OK,
                    content: {
                        amount: amount
                    }
                };
                next();
            });
        } else {
            next(new ValidationError('User is not authorized'));
        }
    }
};
module.exports = GiftCardController;