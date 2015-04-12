/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('GiftCardService', ['config', '$http', '$q', 'storage', function (config, $http, $q, storage) {
        var service = {};
        /**
         * Search gift cards
         */
        service.search = function (criteria) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var url = config.REST_SERVICE_BASE_URL + '/users/me/giftCards?';
            for (var key in criteria) {
                if (criteria.hasOwnProperty(key)) {
                    url = url + key + '=' + criteria[key] + '&';
                }
            }
            // drop the last & sign
            url = url.substring(0, url.lastIndexOf('&') !== -1 ? url.lastIndexOf('&') : url.length);
            // prepare request object
            var req = {
                method: 'GET',
                url: url,
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
         * Get gift card by id
         */
        service.get = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id,
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
         * Resell gift card
         */
        service.resell = function (id, quantityToSell, description) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id + '/resell?quantityToSell=' + quantityToSell,
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
         * Prepare a gift card for redeem
         */
        service.prepareForRedeem = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id + '/prepareForRedeem',
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
         * Redeem a gift card
         */
        service.redeem = function (qrCode, amount) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/giftCards/redeem?qrCode=' + qrCode + '&amount=' + amount,
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
        return service;
    }]);