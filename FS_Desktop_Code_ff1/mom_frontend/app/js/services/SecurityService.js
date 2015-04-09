/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Security Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('SecurityService', ['config', 'base64', 'storage', '$http', '$q', '$log', function (config, base64, storage, $http, $q, $log) {
        var service = {};
        /**
         * Authenticate the user using password type.
         */
        service.authenticate = function (email, password) {
            var deferred = $q.defer();
            var credentials = base64.encode(email + ':' + password);
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/login?type=password',
                headers: {
                    'Authorization': 'Basic ' + credentials
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Authenticate the user based on the given social network and accessToken for that socialNetwork
         */
        service.authenticateWithSocialNetwork = function (socialNetwork, accessToken) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/login?type=' + socialNetwork,
                headers: {
                    'Authorization': 'Basic ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Refresh the current sessionToken.
         * This service method internally sets the localStorage and session storage to new sessionToken
         */
        service.refreshToken = function (sessionToken) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/refreshToken',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get allowed actions for current user
         */
        service.getAllowedActions = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me/actions',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Recover the forgotten password
         */
        service.recoverPassword = function (email) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/forgotPassword?email=' + email
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Reset forgotten password. Reset password token is mandatory
         */
        service.resetForgottenPassword = function (token, password) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/resetForgottenPassword?token=' + token + '&newPassword=' + password
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Revoke the current session token
         */
        service.revokeSessionToken = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/revokeToken',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Reset the current user password.
         * It is simply updating the current user password
         */
        service.resetPassword = function (oldPassword, newPassword) {
            var deferred = $q.defer();
            return deferred.promise;
        };
        return service;
    }]);