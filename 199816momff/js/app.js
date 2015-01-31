'use strict';

var app = angular.module("projectMomAndPopApp",["ngRoute","controllers"]);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', function ($rootScope, $location,  $window) {
    $rootScope.location = $location;
    $rootScope.goto = function (path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }else { // Go to the specified path
            $location.path(path);
        }
    };
}]);

app.config(["$routeProvider",
    function($routeProvider){
        $routeProvider
            .when("/",{
                templateUrl: "partials/Login.html",
                controller: 'loginCtrl'
            })
            .when("/individual-home",{
                templateUrl: "partials/Individual-home.html"
            })
            .when("/business-home",{
                templateUrl: "partials/Business-home.html"
            })
            .when("/business-step-1",{
                templateUrl: "partials/Business-step-1.html",
                controller: 'businessHomeStepOneCtrl'
            })
             .when("/business-step-2",{
                templateUrl: "partials/Business-step-2.html"
            })
            .when("/sign-up-choose-account-type",{
                templateUrl: "partials/Sign-up-choose-account-type.html"
            })
             .when("/sign-up-champion",{
                templateUrl: "partials/Sign-up-champion.html",
                controller:'signUpChampionCtrl'
            })
            .when("/sign-up-founder",{
                templateUrl: "partials/Sign-up-founder.html",
                controller:'signUpFounderCtrl'
            })
            .when("/reset-password",{
                templateUrl: "partials/Reset-Password-step-1.html",
                controller:'resetPasswordCtrl'
            })
            .when("/reset-password-step2",{
                templateUrl: "partials/Reset-Password-step-2.html",
                controller:'resetPasswordStepTwoCtrl'
            })
            .when("/terms-and-conditions",{
                templateUrl: "partials/Terms-and-conditions.html"
            })
            .otherwise({
                redirectTo: '/'
            });
    }
])