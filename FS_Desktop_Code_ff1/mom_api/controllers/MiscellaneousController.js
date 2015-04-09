/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Miscellaneous Controller
 */
/* Globals */
var config, options,
  controllerHelper = require('./controllerHelper'),
  notificationService = require('../services/notificationService');

var async = require('async');

var UnauthorizedError = require('../errors/UnauthorizedError');

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
 * Middleware controller to send feedback to an admin using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.sendFeedback = function(req, res, next) {
  async.waterfall([
    function(cb) {
      var entity = req.body;
      var error = controllerHelper.checkString(entity.subject, 'subject') || controllerHelper.checkString(entity.type, 'type') ||
                    controllerHelper.checkString(entity.message, 'message') || controllerHelper.checkString(entity.userId, 'userId');
      if(error) {
        return cb(error);
      }
      cb(null, entity);
    },
    function(entity, cb) {
      notificationService.notifyAdminOfFeedback(entity, cb);
    }
  ], function(err, feedback) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: feedback
    };
    next();
  });
};

/**
 * Middleware controller to send abuse report to an admin using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.reportAbuse = function(req, res, next) {
  async.waterfall([
    function(cb) {
      var entity = req.body;
      var error = controllerHelper.checkString(entity.issue, 'issue') || controllerHelper.checkString(entity.description, 'description') ||
                    controllerHelper.checkString(entity.userId, 'userId');
      if(error) {
        return cb(error);
      }
      cb(null, entity);
    },
    function(entity, cb) {
      notificationService.notifyAdminOfReportedAbuse(entity, cb);
    }
  ], function(err, abuse) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: abuse
    };
    next();
  });
};

/**
 * Middleware controller to send an invite to a friend of a user using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.inviteFriend = function(req, res, next) {
  if(!req.user) {
    return next(new UnauthorizedError('User is not authorized'));
  }
  async.waterfall([
    function(cb) {
      var entity = req.body;
      var error = controllerHelper.checkString(entity.friendEmail, 'friendEmail') || controllerHelper.checkString(entity.message, 'message');
      if(error) {
        return cb(error);
      }
      cb(null, entity);
    },
    function(entity, cb) {
      entity.userEmail = req.user.email;
      notificationService.notifyUserOfInvitation(entity, cb);
    }
  ], function(err, invitation) {
    if(err) {
      return next(err);
    }
    delete invitation.userEmail;
    req.data = {
      status: controllerHelper.HTTP_CREATED,
      content: invitation
    };
    next();
  });
};
