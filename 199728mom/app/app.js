'use strict';

var app = angular
    .module('MomAndPop', [
        'ngRoute',
        'ngTouch',
        'ui.bootstrap',
        'MomAndPop.controllers'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: 'home'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'homePage'
            })
            .when('/search/:query', {
                templateUrl: 'views/search.html',
                controller: 'searchPage'
            })
            .when('/details/:id', {
                templateUrl: 'views/details.html',
                controller: 'detailsPage'
            })
            .when('/redeem/:id', {
                templateUrl: 'views/redeem.html',
                controller: 'redeemPage'
            })
            .when('/privacy', {
                templateUrl: 'views/textinfo.html',
                controller: 'privacyPage'
            })
            .when('/terms', {
                templateUrl: 'views/textinfo.html',
                controller: 'termsPage'
            })
            .when('/abuse', {
                templateUrl: 'views/abuse.html',
                controller: 'abusePage'
            })
            .when('/qr-scan', {
                templateUrl: 'views/qrScan.html',
                controller: 'qrScanPage'
            })
            .when('/qr-confirm', {
                templateUrl: 'views/confirm.html',
                controller: 'confirmPage'
            })
            .when('/blank', {
                templateUrl: 'views/blank.html',
                controller: 'blankPage'
            })
            .otherwise({redirectTo: '/blank'});
    }])
    .config(['$compileProvider', function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
    }]);


// Global page controller
app.controller('page', ['$scope', '$http', function ($scope,  $http) {
    document.body.setAttribute('ontouchstart', '');
    $scope.global = {
        title: 'Mom & Pop Project',
        userProfile: 'user.json'
    };

    $scope.resetGlobal = function () {
        $scope.global.back = '';
        $scope.global.menuOpened = false;
        $scope.global.userProfile = 'user.json';
    };

    $scope.$watch('global.userProfile', function (data) {
        $http.get('data/' + data).success(function (data) {
            $scope.global.user = data;
        });
    }, true);
}]);
