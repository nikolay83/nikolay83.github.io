'use strict';

/**
 * userService
 * This class exports the contract methods between User Model and controllers
 *
 * Changes in version 1.1:
 *  - Fixed the issues in update() method.
 *  - Added getByRole() method.
 * @version 1.1
 * @author TCSASSEMBLER
 */

/* Globals */
var UserSchema = require('../models/User').UserSchema,
  config = require('config'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  User = db.model('User', UserSchema);

var async = require('async');

var securityService = require('./securityService'),
  _ = require('lodash'),
  NotFoundError = require('../errors/NotFoundError');

/**
 * Create a user document in database
 *
 * @param  {Object}     user        user entity to create
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.create = function(user, callback) {
  // use security service generateHash method to generate hash
  securityService.generateHash(user.password, function(err, hash) {
    if(err) {
      callback(err);
    } else {
      // save user
      _.extend(user,{passwordHash: hash});
      // delete password property
      delete user.password;
      User.create(user, callback);
    }
  });
};

/**
 * Fetch a user by given user ID
 *
 * @param  {UUID}       id          id of the user to fetch
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
var _get = exports.get = function(id, callback) {
  User.findOne({_id: id}, callback);
};

/**
 * Fetch a user by given email address
 *
 * @param  {String}     email       email address of user to fetch
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.getByEmail = function(email, callback) {
  User.findOne({email: email}, callback);
};

/**
 * Update a user
 *
 * @param  {UUID}       id          id of the user to update
 * @param  {Object}     entity      user entity to persist
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.update = function(userId, user, callback) {
  async.waterfall([
    function(cb) {
      _get(userId, cb);
    },
    function(existingUser, cb) {
      if(existingUser) {
          securityService.generateHash(user.password, function(err, hash) {
              if(err) {
                  cb(err);
              } else {
                  // save user
                  if (user.password) {
                    _.extend(user,{passwordHash: hash});
                  }
                  // delete password property
                  delete user.password;

                  _.extend(existingUser, user);
                  existingUser.save(cb);
              }
          });

      } else {
        cb(new NotFoundError('User not found'));
      }
    }
  ], callback);
};

/**
 * Delete a user
 *
 * @param  {UUID}       id          id of the giftCardOffer to fetch
 * @param  {Function}   callback    callback function<error, giftCardOffer>
 */
exports.delete = function(id, callback) {
  async.waterfall([
    function(cb) {
      _get(id, cb);
    },
    function(existingUser, cb) {
      if(existingUser) {
        existingUser.remove(cb);
      } else {
        cb(new NotFoundError('User not found'));
      }
    }
  ], callback);
};

/**
 * Search the users based on the given criteria
 *
 * @param  {Object}     criteria      criteria upon which to sort the gift card offers
 * @param  {Function}   callback      callback function<error, result>
 */
exports.search = function(criteria, callback) {
  var query = User.find(criteria.filter);
  if(criteria.pageSize) {
    query = query.limit(criteria.pageSize).skip(criteria.pageSize * criteria.pageNumber);
  }
  if(criteria.sortBy) {
    var sort = {};
    sort[criteria.sortBy] = criteria.sortOrder || 'asc';
    query = query.sort(sort);
  }
  query.exec(function (err, records) {
    User.count({type: criteria.type}).exec(function (err, count) {
        if (err) {
          callback(err);
        } else if (count) {
          callback(null, {totalPages: count/criteria.pageSize + count%criteria.pageSize !== 0 ? 1 : 0, pageNumber:criteria.pageNumber-1, totalRecords: count, items: records});
       }
    });
  });
};

/**
 * Fetch a user by associated social network credentials
 *
 * @param  {String}       socialNetwork                 social network name can be facebook, twitter, linkedin
 * @param  {[type]}       linkedSocialNetworkUserId     user id of the user to fetch in given social network
 * @param  {Function}     callback                      callback function<error, result>
 */
exports.getBySocialNetwork = function(socialNetwork, linkedSocialNetworkUserId, callback) {
  var filter = {
    linkedSocialNetwork: socialNetwork,
    linkedSocialNetworkUserId: linkedSocialNetworkUserId
  };
  User.findOne(filter, callback);
};

/**
 * filter the users based on the given criteria
 * NOTE: This method only returns the first result
 * It is recommended to use this method on the criteria which are guaranteed to be unique
 * This is added to support reset passwod functionality
 *
 * @param  {Object}     filter        filter upon which to sort the gift card offers
 * @param  {Function}   callback      callback function<error, result>
 */
exports.findByFilterCriteria = function(filter, callback) {
  User.findOne(filter, callback);
};

/**
 * For each id in ids array get user profile. The result would be array of profiles
 * @param  {Object/Array}     ids           user id array
 * @param  {Function}         callback      callback function<error, result>
 */
exports.getUserProfiles = function(ids, callback) {
  User.findAll({_id: {
    '$in': ids
  }}, callback);
};

/**
 * Get user by role.
 * @param role the role value
 * @param callback the callback function.
 */
exports.getByRole = function(role, callback) {
    User.find({'userRoles.role': role}, callback);
};