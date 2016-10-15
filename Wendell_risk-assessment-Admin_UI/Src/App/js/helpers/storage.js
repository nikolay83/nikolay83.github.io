/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * Changes in 1.1:
 *  - added new methods 'storeLastMenu' and 'getLastMenu'
 *
 * @author veshu
 * @version 1.1
 */
(function () {
    'use strict';

    angular
        .module("app")
        .factory('storage', [function () {
            var service = {};

            /**
             * Returns the stored token
             * This method first checks in sessionStorage if token is not found in sessionStorage
             * this method checks in localStorage, if token still not found in localStorage, then it will return null
             * or undefined
             * The controllers has to implement the logic that if token is null/undefined then user is not authorized
             */
            service.getSessionToken = function () {
                var token = sessionStorage.getItem('johnhancockprojectcoeus.auth.token');
                if (!token) {
                    token = localStorage.getItem('johnhancockprojectcoeus.auth.token');
                }
                return angular.fromJson(token);
            };

            /**
             * Store the session token in sessionStorage
             * A boolean flag is passed which when true indicate that user chose remember me option and data should
             * also be stored in localStorage
             */
            service.storeSessionToken = function (sessionToken, flag) {
                sessionToken = angular.toJson(sessionToken);
                sessionStorage.setItem('johnhancockprojectcoeus.auth.token', sessionToken);
                if (flag) {
                    localStorage.setItem('johnhancockprojectcoeus.auth.token', sessionToken);
                }
            };

            /**
             * Get current user profile stored in sessionStorage or localStorage
             */
            service.getCurrentUserProfile = function () {
                var profile = sessionStorage.getItem('johnhancockprojectcoeus.auth.profile');
                if (!profile) {
                    profile = localStorage.getItem('johnhancockprojectcoeus.auth.profile');
                }
                return angular.fromJson(profile);
            };

            /**
             * Store the current user profile in sessionStorage
             * A boolean flag is passed which when true indicate that user chose remember me option and
             * data should also be stored in localStorage
             */
            service.storeCurrentUserProfile = function (profile, flag) {
                profile = angular.toJson(profile);
                sessionStorage.setItem('johnhancockprojectcoeus.auth.profile', profile);
                if (flag) {
                    localStorage.setItem('johnhancockprojectcoeus.auth.profile', profile);
                }
            };

            /**
             * Stores the last menu sessionStorage.
             */
            service.storeLastMenu = function (menu) {
                sessionStorage.setItem('johnhancockprojectcoeus.lastmenu', menu);
            };

            /**
             * Stores the last menu sessionStorage.
             */
            service.getLastMenu = function () {
                return sessionStorage.getItem('johnhancockprojectcoeus.lastmenu');
            };

            /**
             * Utility method to clear the sessionStorage and localStorage
             */
            service.clear = function () {
                sessionStorage.clear();
                localStorage.clear();
            };
            return service;
        }]);
})();