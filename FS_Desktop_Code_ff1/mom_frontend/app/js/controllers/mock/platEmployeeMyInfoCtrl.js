/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//My Info Controller

angular.module("app")
.controller("platEmployeeMyInfoCtrl",function($scope, DataService, $rootScope){
    $rootScope.modal = false;
    $scope.password = "123456";
    $scope.clonepassword = "123456";
    $scope.cancelPassword = function(){
        $scope.password = $scope.clonepassword;
        $scope.newpassword = $scope.confirmpassword = "";
        $scope.switchPassword = false;
    };
    $scope.savePassword = function(){
        $scope.submitted = true;
        if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
            $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
            $scope.switchPassword = false;
        }
    };
});