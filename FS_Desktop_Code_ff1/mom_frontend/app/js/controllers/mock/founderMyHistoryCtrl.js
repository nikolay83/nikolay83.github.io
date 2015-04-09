/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
.controller("founderMyHistoryCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    var promise = DataService.query("founderHistory");
    promise.then(function(data){
        $scope.historyList = data.history;
        //$rootScope.role = 'Founder';
    },function(data){});
});