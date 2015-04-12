'use strict';

/**
 * UserController
 * This controller exposes REST actions for user
 *
 * Changes in version 1.1:
 *  - Fixed the issues in get profile related methods.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

/* Globals */
var config, options,
  ValidationError = require('../errors/ValidationError'),
  UnauthorizedError = require('../errors/UnauthorizedError'),
  async = require('async'),
  _ = require('lodash'),
  path = require('path'),
  controllerHelper = require('./controllerHelper'),
  fse = require('fs-extra'),
  userService = require('../services/userService'),
  actionRecordService = require('../services/actionRecordService'),
  crypto = require('crypto'),
  notificationService = require('../services/notificationService'),
  NotFoundError = require('../errors/NotFoundError'),
  securityService = require('../services/securityService');

var logger = require('../logger').getLogger();
var businessService = require('../services/businessService');
var lookupService = require('./../services/lookupService');
/**
 * Currently supported authentication types
 * @type {Object}
 */
var authenticationTypes = {
  password: 'password',
  facebook: 'facebook',
  twitter: 'twitter',
  linkedin: 'linkedin'
};

var accountTypes = {
  FOUNDER: 'FOUNDER',
  CHAMPION: 'CHAMPION'
};

var userRoles  = {
  BUSINESS_ADMIN: 'BUSINESS_ADMIN',
  BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE',
  INDIVIDUAL_USER: 'INDIVIDUAL_USER'
};

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
 * Route handler for POST /login
 * Login function.
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.login = function(req, res, next) {
  var type = req.query.type, error,
    auth = req.auth;
  if(type) {
    type = type.toLowerCase();
  }
  if(!authenticationTypes[type]) {
    // authentication type not supported
    error = new ValidationError('Authentication "' + type + '" not supported');
    return next(error);
  }
  if(!auth) {
    // if authorization header not present, respond with HTTP 401 status code
    error = new UnauthorizedError('User is not authorized');
    return next(error);
  }
  if(type === authenticationTypes.password) {
    async.waterfall([
      function(callback) {
        securityService.authenticate(auth.credentials.username, auth.credentials.password, callback);
      },
      function(user, callback) {
        securityService.generateSessionToken(user._id, callback);
      }
    ], function(err, response) {
      if(err) {
        return next(err);
      }
      // wrap the response in req.data
      req.data = {
        status: controllerHelper.HTTP_OK,
        content: {
          sessionToken: response
        }
      };
      next();
    });
  } else if(type === authenticationTypes.facebook || type === authenticationTypes.twitter || type === authenticationTypes.linkedin) {
    // call securityService authenticate with social network
    async.waterfall([
      function(cb) {
        var token = req.auth.token, 
          error = controllerHelper.checkString(token, 'Access Token');
        if(error) {
          return cb(error, null);
        }
        securityService.authenticateWithSocialNetwork(type, token, cb);
      },
      function(result, cb) {
        var upperCased = type.toUpperCase();
        userService.getBySocialNetwork(upperCased, result.id, cb);
      },
      function(user, cb) {
        if(user) {
          securityService.generateSessionToken(user._id, cb);
        } else {
          cb(new NotFoundError('User not found'));
        }
      }
    ], function(err, result) {
      if(err) {
        return next(err);
      }
      // wrap the response in req.data
      req.data = {
        status: controllerHelper.HTTP_OK,
        content: {
          sessionToken: result
        }
      };
      next();
    });
  }
};

/**
 * Parses the profile and business image information from registration resource object and save the images to PROFILE_IMAGE_DIRECTORY
 *
 * @param  {Object}     registration          The object to extract information from
 * @param  {Function}   callback              Callback function
 */
var mapProfileImages = function(req, user, businessEntity, callback) {
  var profileImage = req.files.profileImage;
  var businessImage = req.files.businessImage;
  async.waterfall([
    function(cb) {
      if(user && profileImage) {
        var name = profileImage.name + Date.now();
        var movePath = path.join(config.PROFILE_IMAGE_FOLDER, name);
        user.picture = config.PROFILE_IMAGE_BASE_URL + movePath;
        fse.move(profileImage.path, movePath, cb);
      } else {
        cb();
      }
    },
    function(cb) {
      if(businessImage && businessEntity) {
        var businessImageName = businessImage.name + Date.now();
        var businessMovePath = path.join(config.PROFILE_IMAGE_FOLDER, businessImageName);
        businessEntity.picture = config.PROFILE_IMAGE_BASE_URL + businessMovePath;
        fse.move(businessImage.path, businessMovePath, cb);
      } else {
        cb();
      }
    }
  ], function(err) {
    callback(err);
  });
};

var validateBusinessEntity = function(business) {
  var error = controllerHelper.checkString(business.name, 'Business Name') || controllerHelper.checkString(business.type, 'Business Type');
  return error;
};

/**
 * Parses the business information in registration resource object.
 *
 * @param  {Object}     registration          The object to extract information from
 * @param  {Function}   callback              Callback function
 */
var mapBusinessEntity = function(registration, callback) {
  var error = validateBusinessEntity(registration.business);
  if(error) {
    return callback(error);
  }
  var result = {
    name: registration.business.name,
    type: registration.business.type,
    description: registration.business.description,
    telephoneNumber: registration.business.telephoneNumber,
    address: registration.business.address,
    businessHours: registration.business.businessHours,
    isNamePublic: true,
    isTypePublic: true,
    isAddressPublic: true,
    isPicturePublic: true,
    isDescriptionPublic: true,
    isBusinessHoursPublic: true,
    isWebsitePublic: true,
    isVerified: true,
    isSubscriptionExpired: true,
    isTelephoneNumberPublic: true
  };
  callback(null, result);
};

/**
 * Parses the additional user information in registration resource object and return array of user resource
 *
 * @param  {Object}     user          The object to extract information from
 * @param  {Function}   callback      Callback function
 */
var mapAdditionalUser = function(user, callback) {
  var result = {};
  result = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
  securityService.generateHash(user.password, function(err, hash) {
    if(err) {
      callback(err);
    } else {
      result.passwordHash = hash;
      callback(null, result);
    }
  });
};

/**
 * Helper method to create a user
 *
 * @param  {Object}   user     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var createUser = function(user, callback) {
  userService.create(user, callback);
};

/**
 * Helper method to validate registration resource
 * @return {Error}    If validation failed otherwise undefined
 */
var validateRegistration = function(registration) {
  var error, accountType = registration.accountType;
  if(!accountTypes[accountType]) {
    return new ValidationError('Account type is invalid');
  }
  if(registration.linkedSocialNetwork) {
    error = controllerHelper.checkString(registration.linkedSocialNetworkAccessToken, 'Access Token');
  } else {
    error = controllerHelper.checkString(registration.firstName, 'First Name') || controllerHelper.checkString(registration.lastName, 'Last Name') ||
              controllerHelper.checkEmail(registration.email, 'Email') || controllerHelper.checkString(registration.password, 'Password');
  }
  return error;
};

/**
 * Route handler for POST /register
 * Register function.
 * It creates the user resource
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.registerUser = function(req, res, next) {
  var businessEntity, additionalUsers = [];
  if(req.fields && req.fields.registration) {
    var registration = JSON.parse(req.fields.registration);
    var error = validateRegistration(registration);
    if(error) {
      return next(error);
    }
    if(registration.linkedSocialNetwork) {
      if(!registration.linkedSocialNetworkAccessToken) {
        return next(new ValidationError('Social Network Access Token is mandatory'));
      }
      securityService.getSocialNetworkProfile(registration.linkedSocialNetwork, registration.linkedSocialNetworkAccessToken, function(err, profile) {
        if(err) {
          return next(err);
        } else {
          async.waterfall([
            function(cb) {
              // check if this user is already registered
              userService.getByEmail(profile.email, function(err, registeredUser) {
                if(err) {
                  cb(err);
                } else if(registeredUser) {
                  cb(new ValidationError('This email address is already registered'));
                } else {
                  cb();
                }
              });
            },
            function(cb) {
              if(registration.accountType === accountTypes.CHAMPION) {
                cb(null, null, userRoles.INDIVIDUAL_USER);
              } else if(registration.accountType === accountTypes.FOUNDER) {
                // create empty business
                var emptyBusiness = {
                  isNamePublic: true,
                  isTypePublic: true,
                  isAddressPublic: true,
                  isPicturePublic: true,
                  isDescriptionPublic: true,
                  isBusinessHoursPublic: true,
                  isWebsitePublic: true,
                  isVerified: true,
                  isSubscriptionExpired: true,
                  isTelephoneNumberPublic: true
                };
                businessService.create(emptyBusiness, function(err, createdEmptyBusiness) {
                  if (err) {
                    return cb(err);
                  }
                  cb(null, createdEmptyBusiness._id, userRoles.BUSINESS_ADMIN);
                });
              } else {
                cb(new ValidationError('Account type ' + registration.accountType + ' not supported'));
              }
            },
            function(businessId, role, cb) {
              profile.userRoles = [{
                businessId: businessId,
                role: role
              }];
              profile.isFirstNamePublic = true;
              profile.isLastNamePublic = true;
              profile.isEmailPublic = true;
              profile.isLocationPublic = true;
              profile.isPicturePublic = true;
              profile.interestedOfferCategory = registration.interestedOfferCategory;
              userService.create(profile, cb);
            }
          ], function(err, createdUser) {
            if(err) {
              return next(err);
            }
            var transformed = controllerHelper.filterUsers(createdUser);
            req.data = {
              status: controllerHelper.HTTP_CREATED,
              content: transformed
            };
            return next();
          });
        }
      });
    } else {
      var user = {
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        interestedOfferCategory: registration.interestedOfferCategory,
        password: registration.password,
        isFirstNamePublic: true,
        isLastNamePublic: true,
        isEmailPublic: true,
        isLocationPublic: true,
        isPicturePublic: true
      };
      async.waterfall([
        function(cb) {
          // check if this user is already registered
          userService.getByEmail(user.email, function(err, user) {
            if(err) {
              cb(err);
            } else if(user) {
              cb(new ValidationError('This email address is already registered'));
            } else {
              cb();
            }
          });
        },
        function(cb) {
          if(registration.accountType === accountTypes.CHAMPION) {
            var businessId = null;
            if(registration.business && registration.business.id) {
              businessId = registration.business.id;
            }
            // individual user
            user.userRoles = [{
              businessId: businessId,
              role: userRoles.INDIVIDUAL_USER
            }];
            cb();
          } else if(registration.accountType === accountTypes.FOUNDER) {
            // create business
            mapBusinessEntity(registration, function(err, entity) {
              if(err) {
                return cb(err);
              }
              businessEntity = entity;
              // get business users (additionalUsers)
              async.map(registration.additionalUsers || [], mapAdditionalUser, function(err, users) {
                if(err) {
                  return next(err);
                }
                additionalUsers = _.union([], users);
                cb();
              });
            });
          }
        },
        function(cb) {
          // get user profile image and business image if available
          mapProfileImages(req, user, businessEntity, cb);
        },
        function(cb) {
          // create additional users and business entity if defined
          if(additionalUsers.length > 0) {
            async.map(additionalUsers, createUser, function(err) {
              if(err) {
                return cb(err);
              } else {
                logger.info('Additional Users created successfully');
                cb();
              }
            });
          } else {
            cb();
          }
        },
        function(cb) {
          // create business
          if(businessEntity) {
            businessService.create(businessEntity, cb);
          } else {
            cb(null, null);
          }
        },
        function(business, cb) {
          if(business) {
            user.userRoles = [{
              businessId: business._id,
              role: userRoles.BUSINESS_ADMIN
            }];
            logger.info('Business created successfully');
          }
          // save registered user
          userService.create(user, cb);
        }
      ], function(err, createdUser) {
        if(err) {
          return next(err);
        }
        var transformed = controllerHelper.filterUsers(createdUser);
        req.data = {
          status: controllerHelper.HTTP_CREATED,
          content: transformed
        };
        next();
      });
    }
  } else {
    // BAD REQUEST
    next(new ValidationError('Registration is mandatory field'));
  }
};

/**
 * Route handler for GET /users/me/actions
 * This function returns the allowed actions for the user
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getAllowedActions = function(req, res, next) {
  // process request
  // The auth middleware will do the authentication and set the user
  async.waterfall([
    function(callback) {
      securityService.getAllowedActions(req.user._id, callback);
    }
  ], function(err, response) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: response
    };
    next();
  });
};

/**
 * Route handler for GET /users/me/actionRecords
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getActionRecords = function(req, res, next) {
  // process request
  async.waterfall([
    function(callback) {
      var filter = _.pick(req.query, 'pageSize', 'pageNumber', 'sortBy', 'sortOrder', 'actionType', 'userId');
      actionRecordService.search(filter, callback);
    }, function (response, callback) {
          lookupService.getAllActionTypes(function(err, actionTypes) {
              _.forEach(actionTypes, function(type) {
                  _.forEach(response.items, function(item) {
                      if (item.type === (type._id + '')) {
                          item.typeDesc = type.name;
                      }
                  });
              });
              callback(null, response);
          });
      }
  ], function(err, response) {
    if(err) {
      return next(err);
    }

    req.data = {
      status: controllerHelper.HTTP_OK,
      content: response
    };
    next();
  });
};

/**
 * Route handler for POST /forgotPassword
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.recoverPassword = function(req, res, next) {
  // generate a reset password token
  var email = req.query.email;
  async.waterfall([
    function(cb) {
      crypto.randomBytes(config.DEFAULT_TOKEN_SIZE, cb);
    },
    function(buffer, cb) {
      var token = buffer.toString('hex');
      userService.getByEmail(email, function(err, user) {
        cb(err, token, user);
      });
    },
    function(token, user, cb) {
      if(user) {
        var updatedUser = _.extend(user, {resetPasswordToken: token, resetPasswordExpired: false});
        updatedUser.save(function(err, savedUser) {
          cb(err, token, savedUser);
        });
      } else {
        cb(new NotFoundError('User not found'));
      }
    },
    function(token, user, cb) {
      // form the resetPassword link
      var resetLink = req.get('Origin') + '/#/ResetPassword?token=' + token;
      notificationService.notifyUserOfPassword(email, resetLink, cb);
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK
    };
    next();
  });
};

/**
 * Route handler for POST /resetForgottenPassword
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.resetForgottenPassword = function(req, res, next) {
  var resetPasswordToken = req.query.token,
    newPassword = req.query.newPassword;

  securityService.updateForgottenPassword(resetPasswordToken, newPassword, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK
    };
    next();
  });
};

/**
 * Route handler for POST /resetPassword
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.resetPassword = function(req, res, next) {
  var newPassword = req.body.password;
  var error = controllerHelper.checkString(newPassword, 'Password');
  if(error) {
    return next(error);
  }
  securityService.updatePassword(req.user, newPassword, function(err, user) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterUsers(user);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for GET /users/:id
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
var getUserProfile = function(req, res, next) {
  var id = req.params.id;
  userService.get(id, function(err, user) {
    if(err) {
      return next(err);
    } else if(!user) {
      // user doesn't exist return 404
      req.data = {
        status: controllerHelper.HTTP_NOT_FOUND
      };
      return next();
    }
    // if user exists
    var transformed = controllerHelper.filterUsers(user);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Route handler for GET /users/me
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
var getMyUserProfile = function(req, res, next) {
  var id = req.user._id;
  userService.get(id, function(err, user) {
    if(err) {
      return next(err);
    } else if(!user) {
      // user doesn't exist return 404
      req.data = {
        code: controllerHelper.HTTP_NOT_FOUND
      };
      return next();
    }
    // if user exists
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: user
    };
    next();
  });
};

/**
 * Route handler for POST /revokeToken
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.revokeAccessToken = function(req, res, next) {
  // auth middleware perform the authentication
  securityService.revokeSessionToken(req.user._id, req.auth.token, function(err) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK
    };
    next();
  });
};

/**
 * Route handler for PUT /users/me
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.updateCurrentUserProfile = function(req, res, next) {
  var user = req.body.updatedUser;
  userService.update(req.user._id, user, function(err, user) {
    if(err) {
      return next(err);
    }
    var transformed = controllerHelper.filterUsers(user);
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: transformed
    };
    next();
  });
};

/**
 * Proxies the request to either getMyUserProfile or getUserProfile
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getProfile = function(req, res, next) {
  if(req.params.id === 'me') {
    getMyUserProfile(req, res, next);
  } else {
    getUserProfile(req, res, next);
  }
};

/**
 * Route handler for POST /refreshToken
 * This method invalidates the current sessionToken and generates a new one and return to client
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.refreshAccessToken = function(req, res, next) {
  async.waterfall([
    function(cb) {
      securityService.revokeSessionToken(req.user._id, req.auth.token, function(err) {
        cb(err);
      });
    },
    function(cb) {
      securityService.generateSessionToken(req.user._id, cb);
    }
  ], function(err, sessionToken) {
    if(err) {
      return next(err);
    }
    req.data = {
      status: controllerHelper.HTTP_OK,
      content: {
        sessionToken: sessionToken
      }
    };
    next();
  });
};

/**
 * Route handler for GET /users
 * GET multiple user profiles each identified by the id in ids array
 * 
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getUserProfiles = function(req, res, next) {
  var ids = req.query.id;
    if (ids) {
      async.map(ids, userService.get, function(err, users) {
        if(err) {
          return next(err);
        }
        var transformed = controllerHelper.filterUsers(users);
        req.data = {
          status: controllerHelper.HTTP_OK,
          content: transformed
        };
        next();
      });
    } else {
        userService.getByRole(req.query.role, function(err, users) {
            if(err) {
                return next(err);
            }
            var transformed = controllerHelper.filterUsers(users);
            req.data = {
                status: controllerHelper.HTTP_OK,
                content: transformed
            };
            next();
        });
    }
};