/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Forgot Password Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("forgotPasswordCtrl", ['$scope', '$rootScope', '$location', 'SecurityService', function ($scope, $rootScope, $location, SecurityService) {
        $rootScope.modal = true;
        $scope.closeModal = function () {
            $rootScope.modal = false;
        };
        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                // send the password reset link to user email address
                SecurityService.recoverPassword($scope.email).then(function (data) {
                    $rootScope.modal = false;
                    $location.path('/');
                }, function (reason) {
                    $log.error('Error sending reset password link HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                });
            }
        }
    }]);