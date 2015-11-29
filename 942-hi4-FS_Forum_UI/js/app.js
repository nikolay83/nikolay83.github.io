/* JS for angular app */

var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngTouch', 'LocalStorageModule', 'ngcControllers', 'ngcServices', 'howItWorks', 'loginModule', 'forumModule', 'threadModule','ngDropdowns', 'ngDirective', 'ngCkeditor'])

.config(['$routeProvider', '$compileProvider', 'localStorageServiceProvider', function($routeProvide, $compileProvider, localStorageServiceProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

    localStorageServiceProvider.setPrefix('FS');

    $routeProvide
        .when("/", {
            redirectTo: '/Login'
        })
        .when("/Forum", {
            templateUrl: "partials/forum.html",
            controller: 'forumCtrl'
        })
        .when("/Thread", {
            templateUrl: "partials/thread.html",
            controller: 'threadCtrl'
        })
        .when("/Thread:thread", {
            templateUrl: "partials/thread.html",
            controller: 'threadCtrl'
        })
        .when("/Details", {
            templateUrl: "partials/threadDetails.html",
            controller: 'threadDeatisCtrl'
        })
        .when("/Details:thread", {
            templateUrl: "partials/threadDetails.html",
            controller: 'threadDeatisCtrl'
        }).
    when("/Login", {
        templateUrl: "partials/login.html",
        controller: 'loginCtrl',
        isPublic: true,
        hasAside: true,
        label: 'Login'
    })

    .otherwise({
        redirectTo: '/'
    });
}])


//global event handler  
.run(function($rootScope, $window, $location, $timeout) {

    $rootScope.go = function(path) {
        $rootScope.app;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        } else { // Go to the specified path
            $location.path(path);
        };

    };

    $rootScope.$on('$routeChangeSuccess', function(ev, data, path) {
        var path = $location.path();
        $rootScope.pageClass = data.pageClass;
        if (typeof($rootScope.animPageClass) !== 'undefined') {
            $rootScope.pageClass = $rootScope.pageClass + ' ' + $rootScope.animPageClass;
        }
        $rootScope.isSbMenu = false;
    });
})
