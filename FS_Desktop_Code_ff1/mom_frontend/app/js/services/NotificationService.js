/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification Service.
 *
 * @version 1.0
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
            }
        };
    }]);