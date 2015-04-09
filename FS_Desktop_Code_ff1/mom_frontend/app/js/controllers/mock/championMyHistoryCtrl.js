/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//My History Controller
angular.module("app")
.controller("championMyHistoryCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    var promise = DataService.query("championHistory");
    promise.then(function(data){
        $scope.historyList = data.history;
        //$rootScope.role = 'Champion';
    },function(data){});
});