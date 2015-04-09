/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Init and export all schemas.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';


var mongoose = require('mongoose'),
    config = require('config');

var db = require('../datasource').getDb(config.MONGODB_URL);


module.exports = {
    ActionType: db.model('ActionType', require('./ActionType').ActionTypeSchema),
    BusinessType: db.model('BusinessType', require('./BusinessType').BusinessTypeSchema),
    FeedbackType: db.model('FeedbackType', require('./FeedbackType').FeedbackTypeSchema),
    OfferCategory: db.model('OfferCategory', require('./OfferCategory').OfferCategorySchema),
    ActionRecord: db.model('ActionRecord', require('./ActionRecord').ActionRecordSchema),
    Business: db.model('Business', require('./Business').BusinessSchema),
    GiftCard: db.model('GiftCard', require('./GiftCard').GiftCardSchema),
    GiftCardOffer: db.model('GiftCardOffer', require('./GiftCardOffer').GiftCardOfferSchema),
    GiftCardOfferComment: db.model('GiftCardOfferComment', require('./GiftCardOfferComment').GiftCardOfferCommentSchema),
    SessionToken: db.model('SessionToken', require('./SessionToken').SessionTokenSchema),
    User: db.model('User', require('./User').UserSchema)
};
