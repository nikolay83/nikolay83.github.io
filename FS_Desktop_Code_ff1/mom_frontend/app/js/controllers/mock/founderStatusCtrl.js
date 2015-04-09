/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Founder Status Controller
angular.module("app")
.controller("founderStatusCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //$rootScope.role = 'Employee';
    //Get Founder Status
    var promise = DataService.query("founder");
    promise.then(function(data){
        $scope.founderList = data.founder;
        $scope.founderList[0].active = true;
        $scope.active = function(idx){
            for(var i=0;i<$scope.founderList.length;i++){
                $scope.founderList[i].active = false;
            }
            $scope.founderList[idx].active = true;
        }
    },function(data){});
});