'use strict';

/**
 * Application auth middleware.
 * This middleware authorizes the user of given operation
 * This middleware is added after tokenParser.
 * This middleware is added only for secured routes
 */

/* Globals */
var UnauthorizedError = require('../errors/UnauthorizedError');
var ForbiddenError = require('../errors/ForbiddenError');
var securityService = require('../services/securityService');
var authorizationTypes = {
  Basic: 'Basic',
  Bearer: 'Bearer'
};

module.exports = function(action) {

  return function(req, res, next) {
    if(req.auth && req.auth.token) {
      if(req.auth.type === authorizationTypes.Basic) {
        // login route with social network authentication
        return next();
      }
      // get authorization token and authorize the user
      securityService.authenticateWithSessionToken(req.auth.token, function(err, user, expirationDate) {
        if(err) {
          return next(err);
        }
        securityService.isAuthorized(user, action, function(err, authorized) {
          if(authorized) {
            req.user = user;
            res.header('Session-Expires-In', expirationDate - (new Date()).getTime());
            next();
          } else {
            next(new UnauthorizedError('User is not authorized'));
          }
        });
      });
    } else {
      next(new ForbiddenError('User is not authenticated'));
    }
  };
};