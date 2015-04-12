/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application utility service
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('util', ['$log', 'SecurityService', 'UserService', 'storage', function ($log, SecurityService, UserService, storage) {
        var service = {};

        /**
         * This function is called in interval to refresh the session token
         */
        service.refreshToken = function () {
            $log.info('Refreshing sessionToken');
            var token = localStorage.getItem('momandpop.auth.token');
            if (token) {
                SecurityService.refreshToken(token).then(function (loginResult) {
                    storage.storeSessionToken(loginResult.sessionToken, true);
                    // get user profile
                    UserService.getMyUserProfile().then(function (user) {
                        storage.storeCurrentUserProfile(user, true);
                        // get allowed actions
                        SecurityService.getAllowedActions().then(function (actions) {
                            storage.storeAllowedActions(actions, true);
                        }, function (actionReason) {
                            $log.error('Error fetching current user actions ' + actionReason);
                        });
                    }, function (userReason) {
                        $log.error('Error fetching current user profile ' + userReason);
                    });
                }, function (reason) {
                    // some error occurred
                    $log.error('Session Token Refresh Error ' + reason);
                });
            }
        };

        /**
         * Function to check if any user is currently logged in
         */
        service.isLoggedIn = function () {
            var profile = storage.getCurrentUserProfile();
            var actions = storage.getAllowedActions();
            var sessionToken = storage.getSessionToken();
            return !!(profile && actions && sessionToken);
            
        };

        return service;
    }]);
