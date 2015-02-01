'use strict';
var app = angular.module('app', ['ngRoute', 'services', 'controllers', 'directives', 'ngCookies', 'ngDropdowns', 'flow', 'filters', 'infinite-scroll']);

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
            when("/Register",{
                templateUrl: path + "Register.html",
                controller: 'registerCtrl'
            }).
            when('/MyProfile', {
                templateUrl: path + 'MyProfile.html',
                controller: 'myCartCtrl'
            }).
            when('/ShoppingCart', {
                templateUrl: path + 'ShoppingCart.html',
                controller: 'shoppingCartCtrl'
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
            when("/ProvideFeedback",{
                templateUrl: path + "ProvideFeedback.html",
                controller: 'provideFeedbackCtrl'
            }).
            when('/HowItWorks', {
                templateUrl: path + 'HowItWorks.html',
                controller: 'myCartCtrl'
            }).
            when('/About', {
                templateUrl: path + 'About.html',
                controller: 'myCartCtrl'
            }).
            when('/Forums', {
                templateUrl: path + 'Forums.html',
                controller: 'myCartCtrl'
            }).
            when('/Blog', {
                templateUrl: path + 'Blog.html',
                controller: 'myCartCtrl'
            }).
            when('/Faq', {
                templateUrl: path + 'Faq.html',
                controller: 'myCartCtrl'
            }).
            when("/Payment",{
                templateUrl: path + "Payment.html",
                controller: 'paymentCtrl'
            }).
            when("/ResetPassword",{
                templateUrl: path + "ResetPassword.html",
                controller: 'resetPasswordCtrl'
            }).
            when("/ForgotPassword",{
                templateUrl: path + "ForgotPassword.html",
                controller: 'forgotPasswordCtrl'
            }).
            when("/ReportAbuse",{
                templateUrl: path + "ReportAbuse.html",
                controller: 'reportAbuseCtrl'
            }).
            when("/VerifyAccount",{
                templateUrl: path + "VerifyAccount.html"
            }).
            otherwise({
                redirectTo: '/Home',
            });
    }
]);
