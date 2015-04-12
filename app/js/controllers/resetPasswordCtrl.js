/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Reset Password Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("resetPasswordCtrl", ['$scope', '$location', 'SecurityService', function ($scope, $location, SecurityService) {
        // get reset password token from query string
        var params = $location.search();
        var resetPasswordToken = params.token;
        $scope.submit = function () {
            // call backend API to reset the password
            SecurityService.resetForgottenPassword(resetPasswordToken, $scope.confirm_password).then(function (data) {
                $location.url($location.path('/'));
            }, function (reason) {
                $log.error('Error resetting forgotten password HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
            });
        }
    }]);