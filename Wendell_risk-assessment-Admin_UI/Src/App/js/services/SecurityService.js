/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is security service. This is wrapper for the corresponding back end REST API.
 *
 * @author veshu
 * @version 1.0
 */
(function () {
    'use strict';

    angular
        .module("app")
        .factory('SecurityService', ['common', function (common) {
            var service = {};

            /**
             * Authenticate the user using username and password.
             * @param {String} username the username
             * @param {String} password the password
             * @returns {promise} the promise with result
             */
            service.login = function (username, password) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/login',
                    data: {
                        username: username,
                        password: password
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Revoke the current session token
             * @returns {promise} the promise with result
             */
            service.revokeToken = function () {
                var req = {
                    method: 'POST',
                    url: '/api/v1/revokeToken'
                };
                return common.makeRequest(req);
            };

            return service;
        }]);
})();