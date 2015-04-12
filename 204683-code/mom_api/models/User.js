'use strict';

var mongoose = require('../datasource').getMongoose(),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: String,
  location: String,
  picture: String,
  isFirstNamePublic: { type: Boolean, required: false, Default: true },
  isLastNamePublic: { type: Boolean, required: false, Default: true },
  isEmailPublic: { type: Boolean, required: false, Default: true },
  isLocationPublic: { type: Boolean, required: false, Default: true },
  isPicturePublic: { type: Boolean, required: false, Default: true },
  passwordHash: { type: String, required: false },
  userRoles: [{businessId: String, role: {type: String, uppercase: true, enum: ['INDIVIDUAL_USER', 'BUSINESS_EMPLOYEE', 'BUSINESS_ADMIN', 'CLIENT', 'PLATFORM_EMPLOYEE']}}],
  interestedOfferCategory: String,
  linkedSocialNetwork: {type: String, required: false, uppercase: true, enum: ['FACEBOOK', 'TWITTER', 'LINKEDIN']},
  linkedSocialNetworkUserId: String,
  resetPasswordToken: String,
  resetPasswordExpired: Boolean
});

/**
 * Module exports
 */
module.exports = {
  UserSchema: UserSchema
};