/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Lookup Service
 */
var config = require('config');
var OfferCategorySchema = require('../models/OfferCategory').OfferCategorySchema,
  db = require('../datasource').getDb(config.MONGODB_URL),
  OfferCategory = db.model('OfferCategory', OfferCategorySchema);

var BusinessTypeSchema = require('../models/BusinessType').BusinessTypeSchema,
  BusinessType = db.model('BusinessType', BusinessTypeSchema);

var FeedbackTypeSchema = require('../models/FeedbackType').FeedbackTypeSchema,
  FeedbackType = db.model('FeedbackType', FeedbackTypeSchema);

var ActionTypeSchema = require('../models/ActionType').ActionTypeSchema,
  ActionType = db.model('ActionType', ActionTypeSchema);


///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Service to get all offer categories from database.
 * @param {Function} callback The callback function <error: Error, result: OfferCategory[]> 
 */
exports.getAllOfferCategories = function(callback) {
  OfferCategory.find(callback);
};

/**
 * Service to get all action types from database.
 * @param {Function} callback The callback function <error: Error, result: ActionType[]>
 */
exports.getAllActionTypes = function(callback) {
  ActionType.find(callback);
};

/**
 * Service to get all feedback types from database.
 * @param {Function} callback The callback function <error: Error, result: FeedbackType[]>
 */
exports.getAllFeedbackTypes = function(callback) {
  FeedbackType.find(callback);
};

/**
 * Service to get all business types from database.
 * @param {Function} callback The callback function <error: Error, result: BusinessType[]>
 */
exports.getAllBusinessTypes = function(callback) {
  BusinessType.find(callback);
};
