'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var GiftCardOfferCommentSchema = new Schema({
  userId: {type: String, required: true }, 
  username: {type: String, required: true },
  comment: String,
  timestamp: {type: Date, default: Date.now },
  giftCardOfferId: String
});

/**
 * Module exports
 */
module.exports = {
  GiftCardOfferCommentSchema: GiftCardOfferCommentSchema
};