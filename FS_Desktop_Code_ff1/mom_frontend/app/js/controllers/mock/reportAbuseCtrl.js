/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Report Abuse Controller
angular.module("app")
.controller("reportAbuseCtrl",function($scope,$rootScope){
    $rootScope.modal = false;
    //$rootScope.role = 'Founder';
    $scope.submitQuery = function(){
        $scope.submitted = true;
        if($scope.abuseForm.$valid){
            $scope.reportModal = $rootScope.modal = true;
        }
    }
    $scope.submit = $scope.submitQuery;
    //Close Modal
    $scope.done = function(){
        $scope.submitted = $scope.reportModal = $rootScope.modal = false;
    }
    $scope.closeModal = function(){
        $scope.submitted = $scope.reportModal = $rootScope.modal = false;
    }
});
