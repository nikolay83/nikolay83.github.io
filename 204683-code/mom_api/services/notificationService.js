/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Notification Service
 */
var mail = require('./../helpers/mail-helper');
var UserSchema = require('../models/User').UserSchema,
  config = require('config'),
  db = require('../datasource').getDb(config.MONGODB_URL),
  User = db.model('User', UserSchema);

var NotFoundError = require('../errors/NotFoundError');

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Service for users to reset their password.
 * @param {String} email The user's email.
 * @param {String} resetLink The reset link.
 * @param {Function} callback The callback function <error: Error>
 */
exports.notifyUserOfPassword = function(email, resetLink, callback) {
  var sender = config.get('CONFIG_EMAIL');
  var receiver = email;
  var subject = 'Password Change';
  var content = 'Click this link to reset your password: ' + resetLink;
  mail.sendMail(sender, receiver, subject, content, callback);
};

/**
 * Service to notify admin about a new feedback via email.
 * @param {Feedback} feedback The feedback object.
 * @param {Function} callback The callback function <error: Error>. 
 */
exports.notifyAdminOfFeedback = function(feedback, callback) {
  User.findById(feedback.userId, function(err, existing) {
    if (err) {
      callback(err);
    } else if (existing) {
      feedback.email = existing.email;
      mail.renderEmailTemplate('feedback', feedback, function(err, html) {
        if (err) {
          callback(err);
        } else {
          var sender = config.get('CONFIG_EMAIL');
          var receiver = config.get('SITE_ADMIN_EMAIL');
          var subject = feedback.subject;
          var content = html;
          mail.sendMail(sender, receiver, subject, content, function(err) {
            callback(err, feedback);
          });
        }
      });
    } else {
      callback(new NotFoundError('User not found'));
    }
  });
};

/**
 * Service to notify admin about a new reported abuse via admin.
 * @param {ReportedAbuse} reportedAbuse The reported abuse object.
 * @param {Function} callback The callback function <error: Error>. 
 */
exports.notifyAdminOfReportedAbuse = function(reportedAbuse, callback) {
  User.findById(reportedAbuse.userId, function(err, existing) {
    if (err) {
      callback(err);
    } else if (existing) {
      reportedAbuse.email = existing.email;
      mail.renderEmailTemplate('reported-abuse', reportedAbuse, function(err, html) {
        if (err) {
          callback(err);
        } else {
          var sender = config.get('CONFIG_EMAIL');
          var receiver = config.get('SITE_ADMIN_EMAIL');
          var subject = 'Reported Abuse';
          var content = html;
          mail.sendMail(sender, receiver, subject, content, function(err) {
            callback(err, reportedAbuse);
          });
        }
      });
    } else {
      callback(new NotFoundError('User not found'));
    }
  });
};

/**
 * Service to notify admin about a deleted content.
 * I don't use email templates like others because in the tcuml, the content parameter is the email content itself.
 * @param {String} userId The user id.
 * @param {String} content The email content.
 * @param {Function} callback The callback function <error: Error>. 
 */
exports.notifyUserOfDeletedContent = function(userId, content, callback) {
  User.findById(userId, function(err, existing) {
    if (err) {
      callback(err);
    } else if (existing) {
      var sender = config.get('CONFIG_EMAIL');
      var receiver = existing.email;
      var subject = 'Deleted Content';
      var content = content;
      mail.sendMail(sender, receiver, subject, content, callback);
    } else {
      callback(new NotFoundError('User not found'));
    }
  });
};

/**
 * Service for users to invite their friends via email.
 * @param {FriendInvitation} friendInvitation The friend invitation object.
 * @param {Function} callback The callback function <error: Error>. 
 */
exports.notifyUserOfInvitation = function(friendInvitation, callback) {
  mail.renderEmailTemplate('invite-friend', friendInvitation, function(err, html) {
    if (err) {
      callback(err);
    } else {
      var sender = config.get('CONFIG_EMAIL');
      var receiver = friendInvitation.friendEmail;
      var subject = 'Invitation from Your Friend ' + friendInvitation.userEmail;
      mail.sendMail(sender, receiver, subject, html, function(err) {
        callback(err, friendInvitation);
      });
    }
  });
};
