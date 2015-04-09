/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Main Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("mainCtrl", ['$scope', '$rootScope', 'DataService', '$location', 'util', 'storage', function ($scope, $rootScope, DataService, $location, util, storage) {
        $rootScope.modal = false;
        $scope.util = util;
        // store search data
        $rootScope.keyword = '';
        // mock up add to card
        $scope.addToCard = function () {
            if (util.isLoggedIn()) {
                $location.path('/ShoppingCart');
            } else {
                $location.path('/Login');
            }
        };
        $scope.socialNetworks = {
            facebook: 'facebook',
            twitter: 'twitter',
            linkedin: 'linkedin'
        };
        $scope.facebookLoginResponse = {
            connected: 'connected',
            not_authorized: 'not_authorized',
            unknown: 'unknown'
        };
        // store search data
        $scope.search = {};

        //logout
        $scope.logout = function () {
            storage.clear();
            $location.path('/Login');
        };

        //go to my profile
        $scope.goUser = function () {
            $location.path($rootScope.getHome());
        };

        $scope.searchCards = function () {
            // redirect to home page home page will perform search based on the keyword in rootscope
            $location.path('/');
        };

        // disable scroll of body when login box show
        function disableScroll() {
            angular.element('body').addClass('hide-body');
        }

        // ebable scroll of body when login box show
        function enableScroll() {
            angular.element('body').removeClass('hide-body');
        }

        var StaticURLsPromise = DataService.query('StaticPageUrl');
        StaticURLsPromise.then(function (data) {
            $scope.staticUrls = data.urls;
        }, function (data) {
        });

    }]);
