/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Feedback controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("feedbackCtrl",['$scope', 'NotificationService', 'LookupService', 'storage', function($scope, NotificationService, LookupService, storage){

        $scope.feedbackType = {};
        $scope.message = '';
        $scope.subject = '';
        $scope.feedbackTypes = [];

        LookupService.getAllFeedbackTypes().then(function(data){
            $scope.feedbackTypes = data;
            $scope.feedbackType = {'name': $scope.feedbackTypes[0].name, 'id': $scope.feedbackTypes[0].id};
        },function(data){
            alert(data);
        });

        /**
         * Send feedback.
         */
        $scope.send = function() {
            $scope.submitted = false;
            if ($scope.subject.trim().length === 0 || $scope.message.trim().length === 0) {
                $scope.submitted = true;
            } else {
                NotificationService.sendFeedback({
                    "subject": $scope.subject,
                    "message": $scope.message,
                    "type": $scope.feedbackType.name,
                    "userId": storage.getCurrentUserProfile()._id
                }).then( function(data){
                    $scope.subject = '';
                    $scope.message = '';
                    alert("Success to send feedback.");
                }, function (reason) {
                    alert("Fail to send feedback, please refer to log for detail.");
                });
            }
        };
    }]);