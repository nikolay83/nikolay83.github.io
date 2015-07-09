'use strict';


var app = angular
    .module('MomAndPop', [
        'ngRoute',
        'ngTouch',
        'ui.bootstrap',
        'slick',
        'MomAndPop.services',
        'MomAndPop.controllers',
        'MomAndPop.directives'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/giftCardsOffer'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
                
            })
            .when('/login/:callbackUrl', {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
                
            })
            .when('/giftCardsOffer', {
                templateUrl: 'views/giftCardsOffer.html',
                controller: 'giftCardsOfferCtrl'
                
            })
            .when('/giftCardsDetails', {
                templateUrl: 'views/giftCardsDetails.html',
                controller: 'giftCardsDetailsCtrl'
                
            })
            .when('/myCart', {
                templateUrl: 'views/myCart.html',
                controller: 'myCartCtrl'
                
            })
            .when('/payment', {
                templateUrl: 'views/payment.html',
                controller: 'paymentCtrl'
                
            })
            .when('/founderShares', {
                templateUrl: 'views/founderShares.html',
                controller: 'founderSharesCtrl'
                
            })
            .when('/displayQR', {
                templateUrl: 'views/displayQR.html',
                controller: 'displayQRCtrl'
                
            })
            .when('/gifting', {
                templateUrl: 'views/gifting.html',
                controller: 'giftingCtrl'
                
            })
            .when('/myHistory', {
                templateUrl: 'views/myHistory.html',
                controller: 'myHistoryCtrl'
                
            })
            .when('/howItWorks', {
                templateUrl: 'views/howItWorks.html',
                controller: 'howItWorksCtrl'
                
            })
            .when('/faq', {
                templateUrl: 'views/faq.html',
                controller: 'faqCtrl'
                
            })
            .when('/reset-password', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'
                
            })
            .when('/sign-up-choose-account-type', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'                
            })
            .when('/contact_support', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'                
            })
            .when('/privacy', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'                
            })
            .when('/terms', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'                
            })
            .when('/viewDetails', {
                templateUrl: 'views/blankPage.html',
                controller: 'blankCtrl'                
            })

        .otherwise({
            redirectTo: '/'
        });

    }])
    .config(['$compileProvider', function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);

    }]);



// Initialize the main module
app.run(function($rootScope, $location, $window) {


    $rootScope.goto = function(path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        } else { // Go to the specified path
            $location.path(path);
        }
    };

    $rootScope.$on('$routeChangeSuccess', function(ev, data, path) {
        $rootScope.path = $location.path();
    });

});
