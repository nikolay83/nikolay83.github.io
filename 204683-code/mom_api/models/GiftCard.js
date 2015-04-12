'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

// require gift card reedem schema
var GiftCardRedeemSchema = require('./GiftCardRedeem').GiftCardRedeemSchema;

var GiftCardSchema = new Schema({
  ownerId: { type: String, required: true },
  businessId: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessTelephone: { type: String, required: true },
  businessPicture: { type: String, required: true },
  discount: Number,
  quantity: Number,
  status: { type: String, required: true, enum:['ACTIVE', 'INACTIVE', 'FOR_RESALE'] },
  createdOn : {type: Date, required: false, default: Date.now },
  createdBy: { type: String, required: true },
  modifiedOn: {type: Date, required: false, default: Date.now },
  modifiedBy: { type: String, required: true },
  giftCardOfferId: { type: String, required: true },
  description: { type: String, required: true },
  activationDateTime: Date,
  endDateTime: Date,
  expirationDate: Date,
  giftCardRedeems: [GiftCardRedeemSchema]
});

/**
 * Module exports
 */
module.exports = {
  GiftCardSchema: GiftCardSchema
};