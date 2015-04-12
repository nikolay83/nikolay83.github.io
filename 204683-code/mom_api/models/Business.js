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
  isNamePublic: { type: Boolean, required: false, Default: true },
  isTypePublic: { type: Boolean, required: false, Default: true },
  isAddressPublic: { type: Boolean, required: false, Default: true },
  isPicturePublic: { type: Boolean, required: false, Default: true },
  isDescriptionPublic: { type: Boolean, required: false, Default: true },
  isBusinessHoursPublic: { type: Boolean, required: false, Default: true },
  isWebsitePublic: { type: Boolean, required: false, Default: true },
  isVerified: { type: Boolean, required: false, Default: true },
  isSubscriptionExpired: { type: Boolean, required: false, Default: true },
  isTelephoneNumberPublic: { type: Boolean, required: false, Default: true },
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