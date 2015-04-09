'use strict';

/**
 * Schedule job to be run at scheduled intervals
 */

/* Globals */
var config = require('config');
var giftCardOfferService = require('../services/giftCardOfferService');
var businessService = require('../services/businessService');
var GiftCardSchema = require('../models/GiftCard').GiftCardSchema,
  db = require('../datasource').getDb(config.MONGODB_URL),
  GiftCard = db.model('GiftCard', GiftCardSchema);
var _ = require('lodash');
var logger = require('../logger').getLogger();
var millis = 1000 * 60 * 60 * 24 * config.OFFER_EXPIRATION_DAYS;

var giftCardOfferStatus = {
  ENDED: 'ENDED'
};

var giftCardStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.runJob = function() {
  logger.info('SCHEDULE JOB ' + new Date());
  // check  GiftCardOffer, if it is OFFER_EXPIRATION_DAYS after publish, it should become END
  giftCardOfferService.getAll(function(err, giftCardOffers) {
    if(err) {
      logger.error('ERROR WHILE RETRIVEING GIFT CARD OFFERS' + err);
    } else {
      _.forEach(giftCardOffers, function(giftCardOffer) {
        if(giftCardOffer.activationDateTime && (giftCardOffer.activationDateTime.getTime() + millis > new Date().getTime())) {
          // gift card expred
          _.extend(giftCardOffer, {status: giftCardOfferStatus.ENDED});
          giftCardOffer.save(function(err, giftCardOffer) {
            if(err) {
              logger.error('ERROR WHILE UPDATING GIFTCARD ' + err);
            } else {
              logger.info('Gift Card updated Succcessfully ' + giftCardOffer);
            }
          });
        }
      });
    }
  });

  businessService.getAll(function(err, businesses) {
    if(err) {
      logger.error('ERROR WHILE RETRIVEING BUSINESSES' + err);
    } else {
      _.forEach(businesses, function(business) {
        if(business.notificationDate) {
          // get giftcard
          GiftCard.findOne({businessId: business._id}, function(giftCard) {
            // if gift card is inactive
            if(giftCard.status === giftCardStatus.INACTIVE) {
              // expire business
              _.extend(business, {isSubscriptionExpired: true});
              business.save(function(err, updatedBusiness) {
                if(err) {
                  logger.error('ERROR WHILE UPDATING BUSINESSES ' + err);
                } else {
                  logger.info('Business updated Succcessfully ' + updatedBusiness);
                }
              });
            }
          });
        }
      });
    }
  });

};