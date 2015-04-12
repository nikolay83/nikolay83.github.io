/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Profile controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("profileCtrl",['$scope', 'SecurityService', 'storage', 'BusinessService', 'LookupService', 'UserService', function($scope, SecurityService, storage, BusinessService, LookupService, UserService){

        $scope.switchPassword = false;
        $scope.password = '';
        $scope.newpassword = $scope.confirmpassword = "";
        $scope.user = storage.getCurrentUserProfile();
        $scope.Edit = false;
        $scope.role = 'Platform';

        /**
         * Cancel password edit.
         */
        $scope.cancelPassword = function(){
            $scope.newpassword = $scope.confirmpassword = "";
            $scope.switchPassword = false;
        };

        /**
         * Save the password.
         */
        $scope.savePassword = function(){
            $scope.submitted = false;

            if ($scope.password==='' || $scope.newpassword === '' || $scope.confirmpassword === '') {
                $scope.submitted = true;
                return;
            }
            if ($scope.newpassword !== $scope.confirmpassword) {
                $scope.submitted = true;
                return;
            }

            SecurityService.resetPassword($scope.user, $scope.newpassword).then(function (data) {
                $scope.switchPassword = false;
                $scope.password = '';
                $scope.newpassword = $scope.confirmpassword = "";
            }, function (reason) {
                alert("Failed to reset password.");
                console.log(reason);
            });
        };

        var flag = -1;
        for (var i=0; i<$scope.user.userRoles.length; i++) {
            if ($scope.user.userRoles[i].role === 'BUSINESS_ADMIN') {
                flag = 1;
                $scope.role = 'Founder';
            } else if ($scope.user.userRoles[i].role === 'BUSINESS_EMPLOYEE') {
                flag = 2;
                $scope.role = 'Admin';
            }
        }

        $scope.allBusinessTypes = [];
        if (flag === 1) {
            LookupService.getAllBusinessTypes().then(function(result) {
                $scope.allBusinessTypes = result;
                BusinessService.getMyBusiness().then(function (data) {
                    if (data.length !== 0) {
                        $scope.editInfo = {};

                        for (var i=0; i<$scope.allBusinessTypes.length; i++) {
                            if (data[0].type === ($scope.allBusinessTypes[i].id + '')) {
                                data[0].type = $scope.allBusinessTypes[i];
                                break;
                            }
                        }
                        $scope.readInfo = data[0];

                        angular.copy($scope.readInfo, $scope.editInfo);
                    }

                }, function (reason) {
                    alert(reason);
                    console.log(reason);
                });
            });
        }
        $scope.submitted = true;
        if (flag === 2) {
            UserService.getMyUserProfile().then(function (data) {
                $scope.profileInfo = data;
                $scope.profileEditInfo = {};
                angular.copy($scope.profileInfo, $scope.profileEditInfo);

            }, function (reason) {
                console.log(reason);
                alert(reason);
            });
        }

        /**
         * Save the info.
         */
        $scope.saveInfo = function () {
            if ($scope.profileEditInfo.firstName.trim() === '' || $scope.profileEditInfo.lastName.trim() === ''
                || $scope.profileEditInfo.email.trim() === '' || $scope.profileEditInfo.location.trim() === '') {
                return;
            }
            angular.copy($scope.profileEditInfo, $scope.profileInfo);
            console.log($scope.profileEditInfo);
            UserService.updateMyUserProfile($scope.profileEditInfo).then(function (data) {
                angular.copy($scope.profileInfo, $scope.profileEditInfo);

            }, function (reason) {
                console.log(reason);
                alert(reason);
            });
        };

        /**
         * Cancel the info edit.
         */
        $scope.cancelInfo = function () {
            angular.copy($scope.profileInfo, $scope.profileEditInfo);
        };

        /**
         * Save business info.
         */
        $scope.saveBusiness = function () {
            if ($scope.editInfo.telephoneNumber.trim() === '' || $scope.editInfo.name.trim() === ''
                || $scope.editInfo.address.trim() === '' || $scope.editInfo.description.trim() === ''
                || $scope.editInfo.businessHours.trim() === '' || $scope.editInfo.website.trim() === '') {
                return;
            }

            angular.copy($scope.editInfo, $scope.readInfo);
            $scope.editInfo.type = $scope.editInfo.type.id + '';
            BusinessService.updateMyBusinessProfile($scope.editInfo).then(function (data) {
                angular.copy($scope.readInfo, $scope.editInfo);

            }, function (reason) {
                alert(reason);
                console.log(reason);
            });
        };

        /**
         * Cancel the business edit.
         */
        $scope.cancelBusiness = function () {
            angular.copy($scope.readInfo, $scope.editInfo);
        };

    }]);