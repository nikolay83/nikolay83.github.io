'use strict';

var app = angular.module("projectApp", ["ngRoute", "controllers", "projectServices", "directive", "ngDropdowns", "filters", "flow"]);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
    $rootScope.location = $location;
    $rootScope.goto = function(path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        } else { // Go to the specified path
            $location.path(path);
        }
    };
}]);

app.config(["$routeProvider",
    function($routeProvider) {
        $routeProvider
            .when("/Landing", {
                templateUrl: "partials/Landing.html"
            })
            .when('/Login', {
                templateUrl: "partials/Login.html",
                controller: "homeCtrl"
            })
            .when('/MyProfile', {
                templateUrl: "partials/MyProfile.html",
                controller: "myCartCtrl"
            })
            .when("/Home", {
                templateUrl: "partials/Home.html",
                controller: 'homeCtrl'
            })
            .when("/ChampionMyHistory", {
                templateUrl: "partials/MyHistory.html",
                controller: 'championMyHistoryCtrl'
            })
            .when("/FounderMyHistory", {
                templateUrl: "partials/MyHistory.html",
                controller: 'founderMyHistoryCtrl'
            })
            .when("/FounderMyEmployees", {
                templateUrl: "partials/FounderMyEmployees.html",
                controller: 'MyEmployeesCtrl'
            })
            .when("/ReportAbuse", {
                templateUrl: "partials/ReportAbuse.html",
                controller: 'reportAbuseCtrl'
            })
            .when("/ProvideFeedback", {
                templateUrl: "partials/ProvideFeedback.html",
                controller: 'provideFeedbackCtrl'
            })
            .when("/Payment", {
                templateUrl: "partials/Payment.html",
                controller: 'paymentCtrl'
            })
            .when("/VerifyAccount", {
                templateUrl: "partials/VerifyAccount.html",
                controller: 'verifyAccountCtrl'
            })
            .when("/PlatEmployeeMyInfo", {
                templateUrl: "partials/PlatEmployeeMyInfo.html",
                controller: 'platEmployeeMyInfoCtrl'
            })
            .when("/ShoppingCart", {
                templateUrl: "partials/ShppingCart.html",
                controller: 'shppingCartCtrl'
            })
            .when("/FounderStatus", {
                templateUrl: "partials/FounderStatus.html",
                controller: 'founderStatusCtrl'
            })
            .when("/Founder$hares", {
                templateUrl: "partials/Founder$hares.html",
                controller: 'founder$haresCtrl'
            })
            .when("/FounderF$Posting", {
                templateUrl: "partials/FounderF$Posting.html",
                controller: 'founderF$PostingCtrl'
            })
            .when("/Register", {
                templateUrl: "partials/Register.html",
                controller: 'registerCtrl'
            })
            .when("/ResetPassword", {
                templateUrl: "partials/ResetPassword.html",
                controller: 'resetPasswordCtrl'
            })
            .when("/ForgotPassword", {
                templateUrl: "partials/ForgotPassword.html",
                controller: 'forgotPasswordCtrl'
            })
            .otherwise({
                redirectTo: '/Home'
            });
    }
])