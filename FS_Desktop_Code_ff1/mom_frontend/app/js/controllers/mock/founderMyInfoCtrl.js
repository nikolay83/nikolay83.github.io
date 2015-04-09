/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//founderMyInfoCtrl Controller
angular.module("app")
.controller('founderMyInfoCtrl', ['$scope', '$rootScope', 'DataService',
    function ($scope, $rootScope, DataService) {
        $rootScope.modal = false;
        //$rootScope.role = 'Employee';
        $scope.uploader = {};

        $scope.businessType = [
            {
                name: 'Super Market',
                value: 'supermarket'
            },
            {
                name: 'Commercial',
                value: 'Commercial'
            },
            {
                name: 'Retail',
                value: 'Retail'
            }
        ];
        $scope.feedback_type = {
            name: 'Question',
            value: 'Question'
        };

        //Get Info
        var promise = DataService.query("info");
        promise.then(function(data){
            $scope.Myinfo = data;
            $scope.Editinfo = jQuery.extend(true, {}, data);
        },function(data){});
        $scope.save = function(){
            $scope.Myinfo = jQuery.extend(true, {}, $scope.Editinfo);
            if ($scope.uploader.flow.files[0]) {
                $scope.Editinfo.logo.describe = $scope.Myinfo.logo.describe = $scope.uploader.flow.files[0].name;
            }
            $scope.uploader.flow.files = [];
        };

        $scope.cancel = function() {
            $scope.Editinfo = jQuery.extend(true, {}, $scope.Myinfo);
            $scope.uploader.flow.files = [];
        };

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
    }
]);