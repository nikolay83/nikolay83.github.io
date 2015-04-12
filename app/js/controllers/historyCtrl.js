/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * History controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('historyCtrl', ['$scope', 'storage', 'UserService',
        function ($scope, storage, UserService) {
            $scope.user = storage.getCurrentUserProfile();
            // search action records of the current user
            var criteria = {
                userId : $scope.user._id,
                sortBy : 'timestamp',
                sortOrder : 'Descending'
            };

            for (var i=0; i<$scope.user.userRoles.length; i++) {
                if ($scope.user.userRoles[i].role === 'BUSINESS_ADMIN') {
                    $scope.role = 'Founder';
                } else if ($scope.user.userRoles[i].role === 'BUSINESS_EMPLOYEE') {
                    $scope.role = 'Admin';
                }
            }
            $scope.historyList = [];
            UserService.getActionRecords(criteria).then(function (data) {
                if (data && data.totalRecords > 0) {
                    $scope.historyList = data.items;
                } else {
                    $scope.historyList = [];
                }
            }, function (reason) {
                console.log(reason);
                alert(reason);
            });
        }
    ]);