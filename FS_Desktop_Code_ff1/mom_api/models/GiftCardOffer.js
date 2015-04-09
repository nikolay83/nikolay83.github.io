'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var GiftCardOfferSchema = new Schema({
  businessId: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: String,
  businessAddress: { type: String, required: true },
  businessPicture: { type: String, required: true },
  businessTelephone: { type: String, required: true },
  discount: { type: Number, required: true },
  activationDateTime: Date,
  endDateTime: { type: Date, required: false },
  description: { type: String, required: true },
  availableQuantity: { type: Number, required: true },
  status: { type: String, required: true, uppercase: true, enum:['ACTIVE', 'ENDED', 'CANCELLED', 'DRAFT'] },
  totalQuantity: { type: Number, required: false },
  createdOn: Date,
  createdBy: String,
  modifiedOn: Date,
  price: Number,
  modifiedBy: String,
  resaleForGiftCard: String,
  expirationDate: Date,
  condition: String,
  redeemedQuantity: Number,
  goalAmount: Number,
  goalReached: Number,
  numberOfGiftCard: Number
});


GiftCardOfferSchema.plugin(require('mongoose-paginate'));

/**
 * Module exports
 */
module.exports = {
  GiftCardOfferSchema: GiftCardOfferSchema
};