/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business employee controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("businessEmployeesCtrl",['$scope', 'BusinessService', 'storage', function($scope, BusinessService, storage){

        $scope.currentUser = storage.getCurrentUserProfile();

        /**
         * Load entities.
         */
        $scope.loadEntities = function () {
            BusinessService.getBusinessEmployees().then(function (data) {
                for (var i=0; i<data.length; i++) {
                    data[i].flag = false;
                    data[i].passwordEmpty = true;
                }
                $scope.employeesList = data;


            }, function (reason) {
                console.log(reason);
                alert(reason);
            });
        };

        $scope.loadEntities();

        /**
         * Added item.
         */
        $scope.add = function(){
            var item = {
                "firstName": "",
                "lastName": "",
                "email": "",
                "password": "",
                "flag": true,
                passwordEmpty: true,
                nameEmpty: true,
                emailEmpty: true,
                lastNameEmpty: true
            };
            $scope.employeesList.push(item);
        };

        /**
         * Modified item.
         * @param idx the item id
         */
        $scope.modify = function(idx){
            $scope.employeesList[idx].flag = true;
        };
        var tester = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        /**
         * Validated changes.
         * @param idx the item id.
         */
        $scope.validateChange = function(idx){
            if ($scope.employeesList[idx].firstName.trim() === '') {
                $scope.employeesList[idx].nameEmpty = true;
            } else {
                $scope.employeesList[idx].nameEmpty = false;
            }

            if ($scope.employeesList[idx].lastName.trim() === '') {
                $scope.employeesList[idx].lastNameEmpty = true;
            } else {
                $scope.employeesList[idx].lastNameEmpty = false;
            }

            if (($scope.employeesList[idx].email.trim() === '' || !tester.test($scope.employeesList[idx].email))) {
                $scope.employeesList[idx].emailEmpty = true;
            } else {
                $scope.employeesList[idx].emailEmpty = false;
            }

            if ($scope.employeesList[idx].password.trim() === '') {
                $scope.employeesList[idx].passwordEmpty = true;
            } else {
                $scope.employeesList[idx].passwordEmpty = false;
            }

        };
        /**
         * Saved item.
         * @param idx the item id
         */
        $scope.save = function(idx){
            // validation
            if ($scope.employeesList[idx].firstName.trim() === '' || $scope.employeesList[idx].lastName.trim() === ''
                || ($scope.employeesList[idx].email.trim() === '' || !tester.test($scope.employeesList[idx].email))
                || $scope.employeesList[idx].password.trim() === '') {
                return;
            }

            delete $scope.employeesList[idx].flag;

            if ($scope.employeesList[idx].id) {
                // update
                BusinessService.updateBusinessEmployee($scope.employeesList[idx].id, $scope.employeesList[idx]).then(function (data) {
                    //load entity
                    $scope.loadEntities();
                }, function (reason) {
                    console.log(reason);
                    alert(reason);
                });
            }
            else {
                // add
                $scope.employeesList[idx].userRoles = [];

                //The added user role is BUSINESS_EMPLOYEE if current user is founder,
                //the added user role is PLATFORM_EMPLOYEE if current user is admin.
                var userRoles = $scope.currentUser.userRoles;
                var role = {};
                for (var i=0; i<userRoles.length; i++) {
                    if (userRoles[i].role === 'BUSINESS_ADMIN') {
                        role.businessId = userRoles[i].businessId;
                        role.role = 'BUSINESS_EMPLOYEE';
                        break;
                    }else if (userRoles[i].role === 'BUSINESS_EMPLOYEE') {
                        role.businessId = userRoles[i].businessId;
                        role.role = 'PLATFORM_EMPLOYEE';
                        break;
                    }
                }

                $scope.employeesList[idx].userRoles.push(role);
                BusinessService.addBusinessEmployees($scope.employeesList[idx]).then(function (data) {
                    $scope.loadEntities();
                }, function (reason) {
                    console.log(reason);
                    alert(reason);
                });
            }

        };
        /**
         * Delete item.
         * @param idx the item id.
         */
        $scope.remove = function(idx){
            if ($scope.employeesList[idx].id) {
                BusinessService.deleteBusinessEmployee($scope.employeesList[idx].id).then(function (data) {
                    //load entity
                    $scope.loadEntities();
                }, function (reason) {
                    console.log(reason);
                    alert(reason);
                });
            }
        };
    }]);