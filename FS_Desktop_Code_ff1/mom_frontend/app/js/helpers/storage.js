/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('storage', [function () {
        var service = {};
        /**
         * Returns the stored sessionToken
         * This method first checks in sessionStorage if sessionToken is not found in sessionStorage
         * this method checks in localStorage, if sessionToken still not found in localStorage, then it will return null or undefined
         * The controllers has to implement the logic that if sessionToken is null/undefined then user is not authorized
         */
        service.getSessionToken = function () {
            var token = sessionStorage.getItem('momandpop.auth.token');
            if (!token) {
                token = localStorage.getItem('momandpop.auth.token');
            }
            return token;
        };
        /**
         * Store the session token in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeSessionToken = function (sessionToken, flag) {
            sessionStorage.setItem('momandpop.auth.token', sessionToken);
            if (flag) {
                localStorage.setItem('momandpop.auth.token', sessionToken);
            }
        };

        /**
         * Get current user profile stored in sessionStorage or localStorage
         */
        service.getCurrentUserProfile = function () {
            var profile = sessionStorage.getItem('momandpop.auth.profile');
            if (!profile) {
                profile = localStorage.getItem('momandpop.auth.profile');
            }
            return angular.fromJson(profile);
        };

        /**
         * Store the current user profile in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeCurrentUserProfile = function (profile, flag) {
            profile = angular.toJson(profile);
            sessionStorage.setItem('momandpop.auth.profile', profile);
            if (flag) {
                localStorage.setItem('momandpop.auth.profile', profile);
            }
        };

        /**
         * Get current user allowed actions stored in sessionStorage or localStorage
         */
        service.getAllowedActions = function () {
            var actions = sessionStorage.getItem('momandpop.auth.actions');
            if (!actions) {
                actions = localStorage.getItem('momandpop.auth.actions');
            }
            return angular.fromJson(actions);
        };

        /**
         * Store the allowed actions in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeAllowedActions = function (actions, flag) {
            actions = angular.toJson(actions);
            sessionStorage.setItem('momandpop.auth.actions', actions);
            if (flag) {
                localStorage.setItem('momandpop.auth.actions', actions);
            }
        };

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');

            localStorage.removeItem('momandpop.auth.token');
            localStorage.removeItem('momandpop.auth.actions');
            localStorage.removeItem('momandpop.auth.profile');
        };
        return service;
    }]);