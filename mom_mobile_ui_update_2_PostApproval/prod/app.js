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

'use strict';

var appControllers = angular.module('MomAndPop.controllers', [
    'ngCookies'
]);

// Global page controller
appControllers.controller('page', ['$rootScope', '$scope', '$http', '$modal', '$location', 'storage', 'common', function($rootScope, $scope, $http, $modal, $location, storage, common) {
    document.body.setAttribute('ontouchstart', '');
    $scope.global = {
        title: 'Mom & Pop Project',
        headless: true
    };
    $scope.resetGlobal = function(options) {
        options = options || {};
        $scope.global.headless = options.headless || false;
        $scope.global.showHeader = !$scope.global.headless;
        $scope.global.back = options.back || '';
        $scope.global.menuOpened = false;
        $scope.global.menuDisabled = options.menuDisabled || false;
        $scope.global.shareEnabled = options.shareEnabled || false;
        $scope.global.sharelink = options.shareLink;
        $scope.global.cancelLink = options.cancelLink || '';
        $scope.global.isShareSuccess = false;
        $scope.global.isShareError = false;
        $scope.global.isSendSuccess = false;
        $scope.global.transactionCompleted = false;

        if (options.title) {
            $scope.global.title = options.title;
        }
    };

    // get messages
    var promise = common.makeRequest({
        method: 'GET',
        url: 'data/messages.json'
    })

    $scope.messages = {};
    promise.then(function(data) {
        $scope.messages = data.messages;
    });


    //shareOn
    $scope.shareOn = function(isError) {
        if (isError) {
            $scope.shareMessage = $scope.messages ? $scope.messages.id004 : null;
            $scope.global.isShareError = true;
        } else {
            $scope.shareMessage = $scope.messages ? $scope.messages.id007 : null;
            $scope.global.isShareSuccess = true;
            $scope.global.shareOpened = false;
        }
    };


    //send to friend
    $scope.sendToFriend = function() {
        $scope.global.transactionCompleted = false;
        $scope.global.isSendError = false;
        if ($scope.global.email) {
            $scope.sendSuccessMessage = $scope.messages ? $scope.messages.id008 : null;
            $scope.global.transactionCompleted = true;
            $scope.global.shareOpened = false;
        } else {
            $scope.sendSuccessMessage = $scope.messages ? $scope.messages.id009 : null;
            $scope.global.isSendError = true;
        }
    };

}]);

// Header controller
appControllers.controller('header', ['$scope', function($scope) {
    $scope.global.menuOpened = false;
}]);


// Main menu controller
appControllers.controller('menu', ['$rootScope', '$scope', '$http', '$log', 'storage', 'util', 'common', function($rootScope, $scope, $http, $log, storage, util, common) {
    $scope.user = {};
    $scope.menuList = {};


    function init() {
        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/menu.json'
        })

        promise.then(function(data) {
            $scope.offers = data;
            $scope.user = data.userDetails;
            $scope.menuList = data.menuList
        });

    };
    init();

    //is current path
    $scope.isCurrentPath = function(el) {
        return $scope.path === el.href;
    }

    $scope.menuClicked = function(title) {
        if (title.toLowerCase() === 'logout') {
            $rootScope.loggedIn = false;
            storage.clear();
        }
        $scope.global.menuOpened = false;
    };

    $scope.$on('authScopeChanged', function(event) {
        if (util.isLoggedIn()) {
            $scope.init();
        }
    });
    if (util.isLoggedIn()) {
        $scope.init();
    }
}]);

// Search controller
appControllers.controller('search', ['$scope', '$location', function($scope, $location) {
    $scope.mode = 'order';
    $scope.orders = [{
        "type": "name-asc",
        "title": "A-Z"
    }, {
        "type": "name-desc",
        "title": "Z-A"
    }, {
        "type": "amount",
        "title": "Amount"
    }];

    $scope.setMode = function(mode) {
        $scope.mode = mode;
        $scope.search.businessName = "";
        if (mode === 'searching') {
            setTimeout(function() {
                $('.search .input').focus();
            }, 0);
        } else if (mode === 'order') {
            $scope.setOrder($scope.order);
        }
    };

    $scope.checkEnter = function($event) {
        if ($event.keyCode === 13) {
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        if ($scope.search) {
            $scope.doGiftCardSearch($scope.search);
        }
    };
}]);


// Privacy page controller
appControllers.controller('privacyPage', ['$scope', function($scope) {
    $scope.resetGlobal();
    $scope.global.title = 'Privacy Policy';
    $scope.source = 'partials/privacy.html';
}]);


// giftCard offer controller
appControllers.controller('giftCardsOfferCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'Gift Card Offers'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/businesses.json'
        })

        promise.then(function(data) {
            $scope.offers = data;
        });

        // gauge
        $scope.getGaugeVal = function(percent) {
            percent = !percent ? 0 : percent;
            return {
                x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
                y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
                largeFlag: percent >= 50 ? 1 : 0
            };
        }

        //business
        $scope.toggleState = function(el) {
            if (el.isOpen) {
                el.isOpen = false;
            } else {
                el.isOpen = true;
            }
        }
    }
);

// giftCard offer controller
appControllers.controller('giftCardsDetailsCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'Details',
            back: "giftCardsOffer",
            menuDisabled: true,
            shareEnabled: true,
            shareOpened: false

        });

        $scope.gaugestyle = {
            bgcolor: "#e0e0e0"
        };

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/businessesOfferDetails.json'
        });

        promise.then(function(data) {
            $scope.offerDetail = data;
        });




        // gauge
        $scope.getGaugeVal = function(percent) {
            percent = !percent ? 0 : percent;
            return {
                x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
                y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
                largeFlag: percent >= 50 ? 1 : 0
            };
        };

        //business
        $scope.toggleState = function(el) {
            if (el.isOpen) {
                el.isOpen = false;
            } else {
                el.isOpen = true;
            }
        };

        //addToCart
        $scope.addToCart = function() {
            $scope.currentMessage = $scope.messages ? $scope.messages.id005 : null;
            $scope.hasCartMsg = true;
        };

    }
);

// myCart controller
appControllers.controller('myCartCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'My Cart',
            back: 'back',
            menuDisabled: true
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/mycart.json'
        })
        $scope.mycart = {};
        promise.then(function(data) {
            $scope.mycart = data.mycart;
        });

        // gauge
        $scope.getGaugeVal = function(percent) {
            percent = !percent ? 0 : percent;
            return {
                x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
                y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
                largeFlag: percent >= 50 ? 1 : 0
            };
        }

        //price
        $scope.$watch('mycart.cart.total', function() {
            if ($scope.mycart.cart) {
                $scope.mycart.cart.price = (parseFloat($scope.mycart.cart.total) * parseFloat($scope.mycart.cart.discount) * 0.01).toFixed(2) || 0.00;
            }
        })

        //pay now
        $scope.validate = function() {
            $scope.isValid = true;
            if (!$scope.mycart.cart.total || $scope.mycart.cart.total > $scope.mycart.cart.available) {
                $scope.isValid = false;
            }
        };
    }
);

// payment controller
appControllers.controller('paymentCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'Payment',
            cancelLink: 'myCart',
            menuDisabled: true
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/payment.json'
        });
        $scope.payment = {};
        promise.then(function(data) {
            $scope.payment = data.payment;
        });
        //processPayment
        $scope.processPayment = function() {
            $scope.isSuccessModal = false;
            $scope.currentMessage = $scope.messages ? $scope.messages.id001 : null;
            $scope.isPaymentError = !$scope.payment.cardNumber;
            if ($scope.payment.cardNumber !== '') {
                $scope.isSuccessModal = true;
                $scope.currentMessage = $scope.messages ? $scope.messages.id006 : null;
            }
        }

    }
);

//Login Controller
appControllers.controller('loginCtrl', ['$scope', '$location', '$rootScope', "$modal", "$routeParams", function($scope, $location, $rootScope, $modal, $routeParams) {
    $scope.resetGlobal({
        headless: true,
        title: 'FounderShare'
    });
    // scope level variables
    $scope.email = '';
    $scope.password = '';
    $scope.rememberMe = false;

    $scope.socialNetworks = {
        facebook: 'FACEBOOK',
        twitter: 'TWITTER',
        linkedin: 'LINKEDIN'
    };




    $scope.login = function() {
        if (!$scope.username || !$scope.password) {
            $scope.showError = true;
        } else if ($routeParams.callbackUrl) {
            //callback url
            $routeParams.callbackUrl = $routeParams.callbackUrl.replace(/:/, '');
            $scope.goto('/' + $routeParams.callbackUrl);
        } else {
            $scope.goto('/giftCardsOffer');
        }
    };

    // clear validation error, while focus  in input boxes;
    $scope.clearValidateError = function() {
        $scope.showError = false;
    };

    $scope.toggleRememberMe = function() {
        $scope.rememberMe = !$scope.rememberMe;
    };
}]);

// founderShares controller
appControllers.controller('founderSharesCtrl',
    function($rootScope, $scope, common) {
        $scope.resetGlobal({
            title: 'My Founder$hares'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/founderShare.json'
        })

        promise.then(function(data) {
            $scope.offers = data;
            $scope.$broadcast('initslider');
        });

        // gauge
        $scope.getGaugeVal = function(percent) {
            percent = !percent ? 0 : percent;
            return {
                x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
                y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
                largeFlag: percent >= 50 ? 1 : 0
            };
        }

        $scope.showOptions = function() {
            $scope.isoptionsModal = true;
        }

        //business
        $scope.toggleState = function(el) {
            if (el.isOpen) {
                el.isOpen = false;
            } else {
                el.isOpen = true;
            }
        }
    }
);

// displayQR controller
appControllers.controller('displayQRCtrl',
    function($rootScope, $scope, common) {
        $scope.resetGlobal({
            title: 'Display QR',
            cancelLink: "founderShares",
            menuDisabled: true
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/qr.json'
        })

        promise.then(function(data) {
            $scope.qr = data.qr;
        });



        //shareOn
        $scope.shareOn = function(isError) {
            $scope.isShareSuccess = false;
            $scope.isShareError = false;
            if (isError) {
                $scope.shareMessage = $scope.messages ? $scope.messages.id004 : null;
                $scope.isShareError = true;
            } else {
                $scope.shareMessage = $scope.messages ? $scope.messages.id007 : null;
                $scope.isShareSuccess = true;
            }
        }
    }
);


// payment controller
appControllers.controller('giftingCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'Gifting',
            cancelLink: 'founderShares'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/gifting.json'
        })
        $scope.gifting = {};
        promise.then(function(data) {
            $scope.gifting = data.gifting;
        });
        //processPayment
        $scope.processPayment = function() {
            $scope.isSuccessModal = false;
            $scope.currentMessage = $scope.messages ? $scope.messages.id001 : null;
            $scope.isPaymentError = !$scope.payment.cardNumber;
            if ($scope.payment.cardNumber !== '') {
                $scope.isSuccessModal = true;
                $scope.currentMessage = $scope.messages ? $scope.messages.id006 : null;
            }
        }

        //shareOn
        $scope.shareOn = function(isError) {
            $scope.isShareSuccess = false;
            $scope.isShareError = false;
            if (isError) {
                $scope.shareMessage = $scope.messages ? $scope.messages.id004 : null;
                $scope.isShareError = true;
            } else {
                $scope.shareMessage = $scope.messages ? $scope.messages.id007 : null;
                $scope.isShareSuccess = true;
            }
        }
    }
);

// history controller
appControllers.controller('myHistoryCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'My History',
            back: 'back'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/history.json'
        })
        $scope.histories = {};
        promise.then(function(data) {
            $scope.histories = data.histories;
        });
    }
);

// how ItWorks controller
appControllers.controller('howItWorksCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'How It Works'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/howItWorks.json'
        })
        $scope.works = {};
        promise.then(function(data) {
            $scope.works = data;
        });
    }
);

// faq controller
appControllers.controller('faqCtrl',
    function($scope, common) {
        $scope.resetGlobal({
            title: 'Frequently Ask Questions'
        });

        // get offers
        var promise = common.makeRequest({
            method: 'GET',
            url: 'data/faq.json'
        })
        $scope.generalQuestions = {};
        promise.then(function(data) {
            $scope.generalQuestions = data.generalQuestions;
        });
    }
);

appControllers.controller('blankCtrl', function($scope) {
    $scope.pageTitle = $scope.path.replace('/', '');
    $scope.resetGlobal({
        title: $scope.pageTitle
    });
})

//gauge Controller
appControllers.controller('gaugeCtrl', function($scope) {
    var percent = parseFloat($scope.options);
    $scope.gauge = {
        x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
        y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
        largeFlag: percent >= 50 ? 1 : 0
    };
});

'use strict';

var appDirectives = angular.module('MomAndPop.directives', []);

// gauge
appDirectives.directive('ngcGauge', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/directive/gauge.svg',
        scope: {
            options: '=options',
            gstyle: '=gstyle'
        },
        controller: 'gaugeCtrl'
    }
})

// tab state
.directive('ngcTapstate', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            var _ = $(el)
                .on('touchstart mousedown', function() {
                    _.addClass('hover');
                })
                .on('touchend  mouseup', function() {
                    _.removeClass('hover');
                })
        }
    }
})

 //Only Number
 .directive('numbersOnly', function() {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function(scope, element, attrs, modelCtrl) {
             modelCtrl.$parsers.push(function(inputValue) {
                 if (inputValue === undefined) return ''
                 var transformedInput = inputValue.replace(/[^0-9.]/g, '');
                 if (transformedInput != inputValue) {
                     modelCtrl.$setViewValue(transformedInput);
                     modelCtrl.$render();
                 }
                 return transformedInput;
             });
         }
     };
 })

;

'use strict';
angular.module('slick', []).directive('slick', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '=',
                currentIndex: '=',
                accessibility: '@',
                adaptiveHeight: '@',
                arrows: '@',
                asNavFor: '@',
                appendArrows: '@',
                appendDots: '@',
                autoplay: '@',
                autoplaySpeed: '@',
                centerMode: '@',
                centerPadding: '@',
                cssEase: '@',
                customPaging: '&',
                dots: '@',
                draggable: '@',
                easing: '@',
                fade: '@',
                focusOnSelect: '@',
                infinite: '@',
                initialSlide: '@',
                lazyLoad: '@',
                onBeforeChange: '&',
                onAfterChange: '&',
                onInit: '&',
                onReInit: '&',
                onSetPosition: '&',
                pauseOnHover: '@',
                pauseOnDotsHover: '@',
                responsive: '=',
                rtl: '@',
                slide: '@',
                slidesToShow: '@',
                slidesToScroll: '@',
                speed: '@',
                swipe: '@',
                swipeToSlide: '@',
                touchMove: '@',
                touchThreshold: '@',
                useCSS: '@',
                variableWidth: '@',
                vertical: '@',
                prevArrow: '@',
                nextArrow: '@'
            },
            link: function(scope, element, attrs) {
                var destroySlick, initializeSlick, isInitialized;
                destroySlick = function() {
                    return $timeout(function() {
                        var slider;
                        slider = $(element);
                        slider.unslick();
                        slider.find('.slick-list').remove();
                        return slider;
                    });
                };
                initializeSlick = function() {
                    return $timeout(function() {
                        var currentIndex, slider;
                        slider = $(element);
                        if (scope.currentIndex != null) {
                            currentIndex = scope.currentIndex;
                        }
                        slider.slick({
                            accessibility: scope.accessibility !== 'false',
                            adaptiveHeight: scope.adaptiveHeight === 'true',
                            arrows: scope.arrows !== 'false',
                            asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
                            appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
                            appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
                            autoplay: scope.autoplay === 'true',
                            autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                            centerMode: scope.centerMode === 'true',
                            centerPadding: scope.centerPadding || '50px',
                            cssEase: scope.cssEase || 'ease',
                            customPaging: attrs.customPaging ? scope.customPaging : void 0,
                            dots: scope.dots === 'true',
                            draggable: scope.draggable !== 'false',
                            easing: scope.easing || 'linear',
                            fade: scope.fade === 'true',
                            focusOnSelect: scope.focusOnSelect === 'true',
                            infinite: scope.infinite !== 'false',
                            initialSlide: scope.initialSlide || 0,
                            lazyLoad: scope.lazyLoad || 'ondemand',
                            onBeforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
                            onAfterChange: function(sl, index) {
                                if (attrs.onAfterChange) {
                                    scope.onAfterChange();
                                }
                                if (currentIndex != null) {
                                    return scope.$apply(function() {
                                        currentIndex = index;
                                        return scope.currentIndex = index;
                                    });
                                }
                            },
                            onInit: function(sl) {
                                if (attrs.onInit) {
                                    scope.onInit();
                                }
                                if (currentIndex != null) {
                                    return sl.slideHandler(currentIndex);
                                }
                            },
                            onReInit: attrs.onReInit ? scope.onReInit : void 0,
                            onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
                            pauseOnHover: scope.pauseOnHover !== 'false',
                            responsive: scope.responsive || void 0,
                            rtl: scope.rtl === 'true',
                            slide: scope.slide || 'div',
                            slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                            slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                            speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                            swipe: scope.swipe !== 'false',
                            swipeToSlide: scope.swipeToSlide === 'true',
                            touchMove: scope.touchMove !== 'false',
                            touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                            useCSS: scope.useCSS !== 'false',
                            variableWidth: scope.variableWidth === 'true',
                            vertical: scope.vertical === 'true',
                            prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
                            nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
                        });
                        return scope.$watch('currentIndex', function(newVal, oldVal) {
                            if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                                return slider.slickGoTo(newVal);
                            }
                        });
                    });
                };
               // scope.$on('initSlider', function() {
                    if (scope.initOnload) {
                        isInitialized = false;
                        return scope.$watch('data', function(newVal, oldVal) {
                            if (newVal != null) {
                                if (isInitialized) {
                                    destroySlick();
                                }
                                initializeSlick();
                                return isInitialized = true;
                            }
                        });
                    } else {
                        return initializeSlick();
                    }
               // })
            }
        };
    }
]);

 'use strict';

 /* Services */

 var appServices = angular.module('MomAndPop.services', []);

 // common services
 appServices
     .factory('common', ['$http', '$q', function($http, $q) {
         return {
             /**
              * Make an http request and add access token
              * @param {Object} options the options for $http call
              * @returns {Promise} promise
              */
             makeRequest: function(options) {
                 var deferred = $q.defer();
                 $http({
                     method: 'GET',
                     url: options.url
                 }).
                 success(function(data, status, headers, config) {
                     deferred.resolve(data);
                 }).
                 error(function(data, status, headers, config) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             }
         }
     }]);

 /**
  * Angular service that abstracts the sessionToken storage and retrieval
  */
 appServices.factory('storage', [function() {
     var service = {};
     /**
      * Returns the stored sessionToken
      * This method first checks in sessionStorage if sessionToken is not found in sessionStorage
      * this method checks in localStorage, if sessionToken still not found in localStorage, then it will return null or undefined
      * The controllers has to implement the logic that if sessionToken is null/undefined then user is not authorized
      */
     service.getSessionToken = function() {
         var token = sessionStorage.getItem('momandpop.auth.token');
         if (!token) {
             token = localStorage.getItem('momandpop.auth.token');
         }
         return token;
     };
     /**
      * Store the session token in sessionStorage
      * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
      */
     service.storeSessionToken = function(sessionToken, flag) {
         sessionStorage.setItem('momandpop.auth.token', sessionToken);
         if (flag) {
             localStorage.setItem('momandpop.auth.token', sessionToken);
         }
     };

     /**
      * Get current user profile stored in sessionStorage or localStorage
      */
     service.getCurrentUserProfile = function() {
         var profile = sessionStorage.getItem('momandpop.auth.profile');
         if (!profile) {
             profile = localStorage.getItem('momandpop.auth.profile');
         }
         return angular.fromJson(profile);
     };

     /**
      * Store the current user profile in sessionStorage
      * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
      */
     service.storeCurrentUserProfile = function(profile, flag) {
         profile = angular.toJson(profile);
         sessionStorage.setItem('momandpop.auth.profile', profile);
         if (flag) {
             localStorage.setItem('momandpop.auth.profile', profile);
         }
     };

     /**
      * Utility method to clear the sessionStorage
      */
     service.clear = function() {
         sessionStorage.removeItem('momandpop.auth.token');
         sessionStorage.removeItem('momandpop.auth.actions');
         sessionStorage.removeItem('momandpop.auth.profile');

         localStorage.removeItem('momandpop.auth.token');
         localStorage.removeItem('momandpop.auth.actions');
         localStorage.removeItem('momandpop.auth.profile');
     };

     return service;
 }]);



 /**
  * Application utility service
  */
 appServices.factory('util', ['$http', '$log', '$q', '$rootScope', '$location', 'SecurityService', 'storage', function($http, $log, $q, $rootScope, $location, SecurityService, storage) {
     var service = {};

     service.getChampionMenu = function() {
         var deferred = $q.defer();
         // prepare http request object
         var req = {
             method: 'GET',
             url: 'data/menuChampion.json'
         };
         $http(req).then(function(payload) {
             deferred.resolve(payload.data);
         }, function(reason) {
             deferred.reject(reason);
         });
         return deferred.promise;
     };

     service.getBusinessMenu = function() {
         var deferred = $q.defer();
         // prepare http request object
         var req = {
             method: 'GET',
             url: 'data/menuEmployee.json'
         };
         $http(req).then(function(payload) {
             deferred.resolve(payload.data);
         }, function(reason) {
             deferred.reject(reason);
         });
         return deferred.promise;
     };


     /**
      * Function to check if any user is currently logged in
      */
     service.isLoggedIn = function() {
         var profile = storage.getCurrentUserProfile();
         var sessionToken = storage.getSessionToken();
         return !!(profile && sessionToken);
     };

     service.BUSINESS_ADMIN = 'BUSINESS_ADMIN';
     service.BUSINESS_EMPLOYEE = 'BUSINESS_EMPLOYEE';
     service.PLATFORM_EMPLOYEE = 'PLATFORM_EMPLOYEE';
     service.INDIVIDUAL_USER = 'INDIVIDUAL_USER';
     /**
      * Get user role by key.
      * @param key the role key
      * @returns {boolean} the check result.
      */
     service.getUserRoles = function(key) {
         var user = storage.getCurrentUserProfile();
         if (!user) {
             return false;
         }
         for (var i = 0; i < user.userRoles.length; i++) {
             if (user.userRoles[i].role === key) {
                 return true;
             }
         }
         return false;
     };

     /**
      * Logout user and clear the data
      */
     service.logout = function() {
         $rootScope.loggedIn = false;
         storage.clear();
         $location.path('/');
     };

     return service;
 }]);



 appServices
     .factory('SecurityService', ['storage', 'common', function(storage, common) {
         var service = {};
         /**
          *
          * Authenticate the user using password type.
          * @param email the user email
          * @param password the user password
          */
         service.authenticate = function(email, password) {
             var req = {
                 method: 'POST',
                 url: '/login?type=PASSWORD',
                 data: {
                     email: email,
                     password: password
                 }
             };
             return common.makeRequest(req);
         };
         /**
          *
          * Authenticate the user based on the given social network and accessToken for that socialNetwork
          * @param socialNetwork the type of social network
          * @param accessToken the access token from that social network
          */
         service.authenticateWithSocialNetwork = function(socialNetwork, accessToken) {
             var req = {
                 method: 'POST',
                 url: '/login?type=' + socialNetwork.toUpperCase(),
                 data: {
                     accessToken: accessToken
                 }
             };
             return common.makeRequest(req);
         };

         /**
          * Refresh the current sessionToken.
          * This service method internally sets the localStorage and session storage to new sessionToken
          * @param sessionToken the session token
          */
         service.refreshToken = function(sessionToken) {
             var req = {
                 method: 'POST',
                 url: '/refreshToken',
                 headers: {
                     'Authorization': 'Bearer ' + sessionToken
                 }
             };
             return common.makeRequest(req);
         };

         /**
          * Recover the forgotten password
          * @param email the user email
          */
         service.recoverPassword = function(email) {
             var req = {
                 method: 'POST',
                 url: '/forgotPassword?version=mobile&email=' + email
             };
             return common.makeRequest(req);
         };

         /**
          * Reset forgotten password. Reset password token is mandatory
          * @param token the forgotten password token
          * @param password the new password to set
          */
         service.resetForgottenPassword = function(token, password) {
             var req = {
                 method: 'POST',
                 url: '/resetForgottenPassword',
                 data: {
                     token: token,
                     newPassword: password
                 }
             };
             return common.makeRequest(req);
         };

         /**
          * Revoke the current session token
          */
         service.revokeSessionToken = function() {
             var req = {
                 method: 'POST',
                 url: '/revokeToken'
             };
             return common.makeRequest(req);
         };

         /**
          * Reset the current user password.
          * It is simply updating the current user password
          *
          * @param password the password text
          */
         service.resetPassword = function(password) {
             var req = {
                 method: 'POST',
                 url: '/resetPassword',
                 data: {
                     newPassword: password
                 }
             };
             return common.makeRequest(req);
         };

         service.checkPasswordLength = function(password) {
             return (password.length <= config.PASSWORD_LENGTH);
         };

         service.checkPasswordContent = function(password) {
             return (/\d/.test(password) && /[A-Za-z]/.test(password));
         };
         return service;
     }]);
