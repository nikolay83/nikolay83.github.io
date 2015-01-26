'use strict';
var app = angular.module('app', ['ngRoute', 'services', 'controllers', 'directives', 'ngCookies', 'infinite-scroll']);

/**
 * app config route
 ***************************/

app.config(['$routeProvider',
    function($routeProvider) {
        var path = 'partials/';
        $routeProvider.
            when('/Home', {
                templateUrl: path + 'HomePage.html',
                controller: 'homeCtrl'
            }).
            when('/Login', {
                templateUrl: path + 'Login.html',
                controller: 'homeCtrl'
            }).
            when('/MyProfile', {
                templateUrl: path + 'MyProfile.html',
                controller: 'myCartCtrl'
            }).
            when('/ShoppingCard', {
                templateUrl: path + 'ShoppingCard.html'
            }).
             when('/MyCart', {
                templateUrl: path + 'MyGiftCards.html',
                controller: 'myCartCtrl'
            }).
            when('/MyInfo', {
                templateUrl: path + 'MyInfo.html',
                controller: 'MyInfoCtrl'
            }).
            when('/PostCards', {
                templateUrl: path + 'PostCards.html',
                controller: 'PostCardsCtrl'
            }).
            when('/Founderposting', {
                templateUrl: path + 'Founderposting.html',
                controller: 'FounderpostingCtrl'
            }).
            when('/PlatformEmployee', {
                templateUrl: path + 'PlatformEmployee.html',
                controller: 'PlatformEmployeeCtrl'
            }).
            when('/PayNow', {
                templateUrl: path + 'PayNow.html',
                controller: 'myCartCtrl'
            }).
            when('/VerifyAccount', {
                templateUrl: path + 'VerifyAccount.html',
                controller: 'VerifyAccountCtrl'
            }).
            when('/VerifyPdfForm', {
                templateUrl: path + 'VerifyPdfForm.html',
                controller: 'VerifyPdfFormCtrl'
            }).
            otherwise({
                redirectTo: '/Home',
            });
    }
]);
