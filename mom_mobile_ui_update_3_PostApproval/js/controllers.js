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
                $scope.mycart.cart.price = (parseFloat($scope.mycart.cart.total) * (1 - (parseFloat($scope.mycart.cart.discount)) * 0.01)).toFixed(2);
                $scope.mycart.cart.price = ($scope.mycart.cart.price!=="NaN")?$scope.mycart.cart.price: 0.00;
            }
        })

        //validate
        $scope.isError = false;
        $scope.validate = function() {
            $scope.isError = false;
            if (!$scope.mycart.cart.total || parseFloat($scope.mycart.cart.total) > parseFloat($scope.mycart.cart.available.replace('$',''))) {
                $scope.isError = true;
            }
        };

        //paynow 
        $scope.paynow = function(){
            if($scope.isValid){
                $scope.goto('/payment');
            }
        }
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
