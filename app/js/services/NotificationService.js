/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification Service.
 *
 * Changes in version 1.1:
 *  - Added sendFeedback() and reportAbuse() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('NotificationService', ['config', '$rootScope', '$http', '$log', '$q', "storage", function (config, $rootScope, $http, $log, $q, storage) {
        return {
            /**
             * Send an invitation email to a friend
             * @param friendInvitation the friend invitation
             */
            invitations: function (friendInvitation) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/invitations/',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        "friendEmail": friendInvitation.friendEmail,
                        "message": friendInvitation.message
                    }
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            /**
             * Send feed back email.
             * @param feedback the feedback entity
             */
            sendFeedback: function (feedback) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/feedbacks',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: feedback
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            /**
             * Report abused email.
             * @param report the report entity
             */
            reportAbuse: function (report) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/abuses',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: report
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
    }]);