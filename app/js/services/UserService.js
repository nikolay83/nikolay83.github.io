/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * User Service.
 *
 * Changes in version 1.1:
 *  - Added getActionRecords() method and fixed some other issues.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('UserService', ['config', 'storage', '$http', '$q', '$log', function (config, storage, $http, $q, $log) {
        var service = {};

        /**
         * Register the user on mom and pop platform
         * registration is registration entity object which would be converted to json string
         * userProfile and businessProfile are optional
         */
        service.register = function (registration, userImage, businessImage) {
            var deferred = $q.defer();
            var data = new FormData();
            data.append('registration', angular.toJson(registration));
            if (userImage) {
                data.append('profileImage', userImage);
            }
            if (businessImage) {
                data.append('businessImage', businessImage);
            }
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/register',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get user profile uniquely identified by id
         */
        service.getUserProfile = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/' + id,
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
         * Get all user profiles identified by each individual id in ids array
         */
        service.getUserProfiles = function (ids) {
            var deferred = $q.defer();
            var url = config.REST_SERVICE_BASE_URL + '/users/multiple?';
            var accessToken = storage.getSessionToken();
            angular.forEach(ids, function (id) {
                url = url + 'id[]=' + id;
            });
            // prepare request object
            var req = {
                url: url,
                method: 'GET',
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
         * Get my user profile
         */
        service.getMyUserProfile = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me',
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
         * Get action records entity.
         * @param criteria the search condition
         */
        service.getActionRecords = function (criteria) {

            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var tmpUrl = '?pageNumber=0&userId=' + criteria.userId + '&sortBy=' + criteria.sortBy + '&sortOrder=' + criteria.sortOrder;

            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me/actionRecords' + tmpUrl,
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
         * Update current user profile
         */
        service.updateMyUserProfile = function (user, userImage) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var data = {};
            delete user.password;
            delete user.passwordHash;
            data.updatedUser = user;
            if (userImage) {
                data.profileImage = userImage;
            }

            // prepare request object
            var req = {
                method: 'PUT',
                url: config.REST_SERVICE_BASE_URL + '/users/me',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: data
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Search users based on the given userSearchCriteria
         * Each key/value pairs in userSearchCriteria is passed as an query string parameter
         */
        service.search = function (criteria) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var url = config.REST_SERVICE_BASE_URL + '/users?';
            if (criteria.businessId) {
                url = url + 'businessId=' + criteria.businessId + '&pageSize=' + criteria.pageSize + '&pageNumber=' +
                criteria.pageNumber + '&sortBy=' + criteria.sortBy + '&sortOrder=' + criteria.sortOrder;
            }
            // add roles
            url = url + '&role=' + criteria.role;
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
        return service;
    }]);