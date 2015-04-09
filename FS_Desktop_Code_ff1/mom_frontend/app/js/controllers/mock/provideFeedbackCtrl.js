/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Provide Feedback
angular.module("app")
.controller("provideFeedbackCtrl",function($scope,$rootScope){
    $rootScope.modal = false;
    $scope.myOptions = [
        {
            name: 'Question',
            value: 'Question'
        },
        {
            name: 'Problem',
            value: 'Problem'
        },
        {
            name: 'Other',
            value: 'Other'
        }
    ];
    $scope.feedback_type = {
        name: 'Question',
        value: 'Question'
    };
    $scope.submit = function(){
        $scope.submitted = true;
    };
});