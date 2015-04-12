/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Report abuse controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("reportAbuseCtrl",['$scope', '$rootScope', '$routeParams', 'NotificationService', 'storage', function($scope, $rootScope, $routeParams,NotificationService, storage){
        $scope.issue = '';
        $scope.describe = '';

        /**
         * Send the abuse email.
         */
        $scope.send = function() {
            $scope.submitted = false;
            if ($scope.issue.trim().length === 0 || $scope.describe.trim().length === 0) {
                $scope.submitted = true;
            } else {
                var reportedAbuse = {};
                reportedAbuse.issue = $scope.issue;
                reportedAbuse.description = $scope.describe;
                reportedAbuse.userId = storage.getCurrentUserProfile()._id;
                if ($routeParams.giftCardOfferId) {
                    reportedAbuse.giftCardOfferId = $routeParams.giftCardOfferId;
                }

                NotificationService.reportAbuse(reportedAbuse).then( function(data){
                    $scope.issue = '';
                    $scope.describe = '';
                    $scope.reportModal = $rootScope.modal = true;
                }, function (reason) {
                    alert("Fail to send abuse report, please refer to log for detail.");
                });
            }
        };

        /**
         * Close modal.
         */
        $scope.done = function(){
            $scope.submitted = $scope.reportModal = $rootScope.modal = false;
        };
        /**
         * Close modal.
         */
        $scope.closeModal = function(){
            $scope.submitted = $scope.reportModal = $rootScope.modal = false;
        };
    }]);