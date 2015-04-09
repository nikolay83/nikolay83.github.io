/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//My Employees Controller
angular.module("app")
.controller("MyEmployeesCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get Employees
    //$rootScope.role = 'Founder';
    var promise = DataService.query("employees");
    promise.then(function(data){
        $scope.employeesList = data.employees;
        angular.forEach($scope.employeesList,function(employees,index){
            angular.extend(employees,{'flag' : false , 'nameEmpty' : false , 'passwordEmpty': false});
        });
        //Add
        $scope.add = function(){
            var item = {
                "name": "",
                "password": "",
                "flag": true,
                "nameEmpty": "",
                "passwordEmpty": ""
            }
            $scope.employeesList.push(item);
        }
        //Modify
        $scope.modify = function(idx){
            $scope.employeesList[idx].flag = true;
        };
        //Save
        $scope.save = function(idx){
            if($scope.employeesList[idx].name && $scope.employeesList[idx].password){
                $scope.employeesList[idx].flag =
                    $scope.employeesList[idx].passwordEmpty =
                        $scope.employeesList[idx].nameEmpty = false;
            }else{
                if(!$scope.employeesList[idx].name){
                    $scope.employeesList[idx].nameEmpty = true;
                }
                if(!$scope.employeesList[idx].password){
                    $scope.employeesList[idx].passwordEmpty = true;
                }
            }
        };
        //Delete
        $scope.remove = function(idx){
            $scope.employeesList.splice(idx, 1);
        };
    },function(data){});
});