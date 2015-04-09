'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  name: String,
  type: String,
  address: String,
  telephoneNumber: String,
  picture: String,
  businessHours: String,
  description: String,
  website: String,
  isNamePublic: { type: Boolean, required:false, default: true },
  isTypePublic: { type: Boolean, required:false, default: true },
  isAddressPublic: { type: Boolean, required:false, default: true },
  isPicturePublic: { type: Boolean, required:false, default: true },
  isDescriptionPublic: { type: Boolean, required:false, default: true },
  isBusinessHoursPublic: { type: Boolean, required:false, default: true },
  isWebsitePublic: { type: Boolean, required:false, default: true },
  isVerified: { type: Boolean, required:false, default: true },
  isSubscriptionExpired: { type: Boolean, required:false, default: true },
  isTelephoneNumberPublic: { type: Boolean, required:false, default: true },
  braintreeAccountId: String,
  coordinates: [Number],
  notificationDate: Date,
  conditions: [String]
});

/**
 * Module exports
 */
module.exports = {
  BusinessSchema: BusinessSchema
};