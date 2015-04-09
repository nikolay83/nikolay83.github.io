'use strict';

/**
 * Token parser middleware for application
 * This application parses the Authorization: Basic 'TOKEN' header
 * If the token is not in correct format this middleware throws error to next middleware in chain
 */
var ValidationError = require('../errors/ValidationError');
var LOGIN_ROUTE = '/login';
var HTTP_POST = 'POST';
var PASSWORD_TYPE = 'password';
var authorizationTypes = {
  Basic: 'Basic',
  Bearer: 'Bearer'
};

/**
 * Middleware function
 *
 * @param  {Error}      err     error object
 * @param  {Object}     req     express request object
 * @param  {Object}     res     express response object
 * @param  {Function}   next    express next function
 */
var middleware = function(req, res, next) {
  var auth = req.headers.authorization;
  if(auth) {
    // parse the auth header
    var splitted = auth.split(' ');
    if(splitted.length !==2 ) {
      next(new ValidationError('Invalid Authorization Header'));
    }
    if(req.path === LOGIN_ROUTE && req.method === HTTP_POST && req.query.type !== PASSWORD_TYPE) {
      // if the current route is login.
      req.auth = {
        type: authorizationTypes.Basic,
        token: splitted[1]
      };
      return next();
    }
    var buf = new Buffer(splitted[1], 'base64'),
      plainAuth = buf.toString();

    var plainAuthSplitted = plainAuth.split(':');
    if(splitted[0] === authorizationTypes.Basic) {
      // basic authentication, parse username:password
      req.auth = {
        type: authorizationTypes.Basic,
        credentials: {
          username: plainAuthSplitted[0],
          password: plainAuthSplitted[1]
        }
      };
      next();
    } else if(splitted[0] === authorizationTypes.Bearer) {
      req.auth = {
        type: authorizationTypes.Bearer,
        token: splitted[1]
      };
      next();
    } else {
      // invalid authorization header
      next(new ValidationError('Invalid Authorization Header'));
    }
  } else {
    // this may be a public api call next
    next();
  }
};

/**
 * Module exports
 */
module.exports = function() {
  return middleware;
};