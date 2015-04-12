/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.1
 * @author CaptainChrno, TCSASSEMBLER
 */
'use strict';

/**
 * Lookup Controller
 */
var config, options;
var controllerHelper = require('./controllerHelper');
var lookupService = require('./../services/lookupService');

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Controller init method.
 * This method performs some controller level initialization tasks
 * This method will be called once while app start
 *
 * @param  {Object}     options         Controller options as defined in configuration
 * @param  {Object}     config          Global application configuration object
 */
exports.init = function(controllerOptions, globalConfig) {
  config = globalConfig;
  options = controllerOptions;
};

/**
 * Middleware controller to get all offer categories
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllOfferCategories = function(req, res, next) {
  lookupService.getAllOfferCategories(function(err, offerCategories) {
    if (err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(offerCategories);
    req.data = {
        status: controllerHelper.HTTP_OK,
        content: transformed
    };
    next();
  });
};

/**
 * Middleware controller to get all action types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllActionTypes = function(req, res, next) {
  lookupService.getAllActionTypes(function(err, actionTypes) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(actionTypes);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Middleware controller to get all feedback types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllFeedbackTypes = function(req, res, next) {
  lookupService.getAllFeedbackTypes(function(err, feedbackTypes) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(feedbackTypes);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Middleware controller to get all business types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllBusinessTypes = function(req, res, next) {
  lookupService.getAllBusinessTypes(function(err, businessTypes) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterObject(businessTypes);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};
