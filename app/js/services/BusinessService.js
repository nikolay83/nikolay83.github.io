/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business service.
 *
 * Changes in version 1.1:
 *  - Added updateMyBusinessProfile() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('BusinessService', ['config', '$http', '$q', 'storage', function (config, $http, $q, storage) {
        var service = {};

        service.getBusiness = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/' + id,
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

        service.getMyBusiness = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me',
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

        service.verify = function (firstName, lastName, creditCard) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/verify',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    creditCard: creditCard
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getBusinessEmployees = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees',
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

        service.addBusinessEmployees = function (employee) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: employee
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.deleteBusinessEmployee = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'DELETE',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees/' + id,
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

        service.updateBusinessEmployee = function (id, employee) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'PUT',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: employee
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Update my business profile.
         * @param business the business entity
         */
        service.updateMyBusinessProfile = function (business) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'PUT',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: business
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