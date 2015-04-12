/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The main application entry
 *
 * Changes in version 1.1:
 *  - Changed the url route.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
'use strict';

var app = angular.module("app", ["ngRoute", "ngDropdowns", "flow", "infinite-scroll", 'LocalStorageModule']);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', '$log', '$interval', 'SecurityService', 'storage', 'config', 'util', function ($rootScope, $location, $window, $log, $interval, SecurityService, storage, config, util) {
    $rootScope.location = $location;
    var publicRoutes = [
        '/Login',
        '/HowItWorks',
        '/Register',
        '/ForgotPassword',
        '/About',
        '/Forums',
        '/Blog',
        '/Faq',
        '/Copyright',
        '/PrivacyPolicy',
        '/ResetPassword',
        '/TermsAndConditions'
    ];
    $rootScope.goto = function (path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        } else { // Go to the specified path
            $location.path(path);
        }
    };
    var getHome = $rootScope.getHome = function () {
        var home;
        if ($rootScope.isActionAllowed('businessAdmin')) {
            // business admin
            home = '/Founder$hares'
        } else if ($rootScope.isActionAllowed('businessEmployee')) {
            // individual user
            home = '/FounderStatus';
        } else if (!$rootScope.isActionAllowed('businessEmployee') && !$rootScope.isActionAllowed('businessAdmin') && $rootScope.isActionAllowed('users')) {
            home = '/ChampionMyFounder$hares';
        } else {
            home = '/';
        }
        return home;
    };

    // if session token refresh period is configured
    if (config.SESSION_TOKEN_REFRESH_PERIOD) {
        $interval(util.refreshToken, config.SESSION_TOKEN_REFRESH_PERIOD * 1000);
    }
    /**
     * Global fucntion to check if the specified action is allowed or not
     */
    var isActionAllowed = $rootScope.isActionAllowed = function (action) {
        var actions = storage.getAllowedActions();
        if (actions && actions.indexOf(action) !== -1) {
            return true;
        }
        return false;
    };

    /**
     * Redirect to sharer page
     * @param destination the target social network e.g. twitter, facebook
     * @param offerId the offer id
     * @param offerTitle the offer title
     */
    $rootScope.shareUrl = function (destination, offerId, offerTitle) {
        var urlhead = 'http://rest.sharethis.com/v1/share/share?destination=';
        var pageUrl = $location.absUrl().split("#")[0] + "#/";
        var urlparm = '&url=' + window.encodeURIComponent(pageUrl) + '?offerId=' + offerId + '&api_key=' + config.SHARE_THIS_PUBLIC_KEY + '&title=' + offerTitle;
        window.open(urlhead + destination + urlparm, 'sharer', "toolbar=0,status=0,height=500,width=600")
    };
    $rootScope.$on('$routeChangeStart', function () {
        var path = $location.path();
        // check if the user is authorized
        if (util.isLoggedIn()) {
            // check the user home page
            if (path === '/Founder$hares') {
                $location.path(getHome());
            } else if (path === '/FounderStatus') {
                $location.path(getHome());
            } else if (path === '/ChampionMyFounder$hares') {
                $location.path(getHome());
            }
        } else if (publicRoutes.indexOf(path) === -1) {
            $location.path('/');
        }
    });
}]);

app.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "partials/Home.html",
                controller: 'homeCtrl'
            })
            .when("/Login", {
                templateUrl: "partials/Login.html",
                controller: 'loginCtrl'
            })
            .when("/ChampionMyInfo", {
                templateUrl: "partials/ChampionMyInfo.html",
                controller: 'championMyInfoCtrl'
            })
            .when("/ChampionMyFounder$hares", {
                templateUrl: "partials/ChampionMyFounder$hares.html",
                controller: 'championMyFounder$haresCtrl'
            })
            .when("/history", {
                templateUrl: "partials/history.html",
                controller: 'historyCtrl'
            })
            .when("/PostCards", {
                templateUrl: "partials/PostCards.html",
                controller: 'postCardsCtrl'
            })
            .when("/myInfo", {
                templateUrl: "partials/FounderMyInfo.html",
                controller: 'profileCtrl'
            })
            .when("/FounderMyEmployees", {
                templateUrl: "partials/FounderMyEmployees.html",
                controller: 'businessEmployeesCtrl'
            })
            .when("/ReportAbuse/:giftCardOfferId", {
                templateUrl: "partials/ReportAbuse.html",
                controller: 'reportAbuseCtrl'
            })
            .when("/ProvideFeedback", {
                templateUrl: "partials/ProvideFeedback.html",
                controller: 'feedbackCtrl'
            })
            .when("/Payment/:purpose", {
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
                templateUrl: "partials/ShoppingCart.html",
                controller: 'shoppingCartCtrl'
            })
            .when("/FounderStatus", {
                templateUrl: "partials/FounderStatus.html",
                controller: 'founderStatusCtrl'
            })
            .when("/Founder$hares", {
                templateUrl: "partials/Founder$hares.html",
                controller: 'giftCardOffersCtrl'
            })
            .when("/FounderF$Posting", {
                templateUrl: "partials/FounderF$Posting.html",
                controller: 'giftCardOfferCtrl'
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

            //==================//
            .when('/HowItWorks', {
                templateUrl: 'partials/HowItWorks.html',
                controller: 'wordpressCtrl'
            })
            .when('/About', {
                templateUrl: 'partials/About.html',
                controller: 'wordpressCtrl'
            })
            .when('/Forums', {
                templateUrl: 'partials/Forums.html',
                controller: 'wordpressCtrl'
            })
            .when('/Blog', {
                templateUrl: 'partials/Blog.html',
                controller: 'wordpressCtrl'
            })
            .when('/Faq', {
                templateUrl: 'partials/Faq.html',
                controller: 'wordpressCtrl'
            })
            .when('/Copyright', {
                templateUrl: 'partials/Copyright.html',
                controller: 'wordpressCtrl'
            })
            .when('/PrivacyPolicy', {
                templateUrl: 'partials/PrivacyPolicy.html',
                controller: 'wordpressCtrl'
            })
            .when('/TermsAndConditions', {
                templateUrl: 'partials/TermsAndConditions.html',
                controller: 'wordpressCtrl'
            })
            //==================//

            .otherwise({
                redirectTo: '/'
            });
    }
]);