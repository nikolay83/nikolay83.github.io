/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */


//championMyFounder$hares Controller
angular.module("app")
.controller('championMyFounder$haresCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {

        $scope.pause = false;

        // open file dialog
        $scope.openFileDialog = function (elementName) {
            angular.element('#' + elementName)[0].click();
        };

        // data content MyCart
        var MyCartPromise = DataService.query('MyCart');
        MyCartPromise.then(function(data) {
            $scope.MyCart = data;
        }, function(data) {});


        $scope.user = {item: 0};
        $scope.activeButton = {item: 1};
        $scope.show = "show";

        // mock up infinite scroll
        $scope.loadMore = function() {
            if($scope.MyCart && $scope.MyCart.listItem.length <= 30 && !$scope.pause) {
                $scope.pause = true;
                $timeout(function () {
                    for(var i = 0; i < 5; i++) {
                        $scope.MyCart.listItem.push(angular.copy($scope.MyCart.more));
                    }
                    $scope.pause = false;
                }, 800);
            }
        };

        $scope.showAddNew = false;

        $scope.startAddNew = function () {
            $scope.showAddNew = true;
        };

        //add item
        $scope.addItem = function (source, object) {
            object.push(angular.copy(source));
            $scope.showAddNew = false;
        };

        //delete Custom Site
        $scope.delete = function (index, object) {
            if (index > -1) {
                object.splice(index, 1);
            }
        };
        // init when page loaded
        function init() {
            $scope.user.item = 1;
        }
        init();

    }
]);