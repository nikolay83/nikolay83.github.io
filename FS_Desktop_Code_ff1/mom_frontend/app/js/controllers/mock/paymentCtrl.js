/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Payment
angular.module("app")
.controller("paymentCtrl",function($scope,$rootScope, $location, localStorageService){
    $rootScope.modal = false;
    $scope.userRole = localStorageService.get("role");
    var currentYear = new Date().getFullYear();
    $scope.years = new Array();
    for (var i = currentYear; i< currentYear+20; i++) {
        $scope.years.push({
            name: i,
            value: i
        });
    }
    $scope.months = [
        {
            name: 'month',
            value: 'month'
        },
        {
            name: '1',
            value: '1'
        },
        {
            name: '2',
            value: '2'
        },
        {
            name: '3',
            value: '3'
        },
        {
            name: '4',
            value: '4'
        },
        {
            name: '5',
            value: '5'
        },
        {
            name: '6',
            value: '6'
        },
        {
            name: '7',
            value: '7'
        },
        {
            name: '8',
            value: '8'
        },
        {
            name: '9',
            value: '9'
        },
        {
            name: '10',
            value: '10'
        },
        {
            name: '11',
            value: '11'
        },
        {
            name: '12',
            value: '12'
        }
    ];
    $scope.select_year = {
        name: 'year',
        value: 'year'
    }
    $scope.select_month = {
        name: 'month',
        value: 'month'
    }
    $scope.done = function(){
        $scope.modal = false;
    };
    $scope.submit = function(){
        $scope.submitted = true;
        if($scope.form.$valid){
            //Done
            $scope.modal = true;
        }
    };
});