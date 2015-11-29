/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The main application entry
 *
 * Changes in version 1.1:
 *  - Changed the url route.
 *
 * Changes in version 1.2:
 *  - Fixed the integration issues.
 *
 * Changes in version 1.3:
 *  - Implement gifting
 *  - Add url redirection from ?go=url to /#url
 *
 * Changes in version 1.4:
 *  - Added openUrl method.
 *  - Handled login page redirect logic.
 *  - Added some routes for MISC updates.
 *
 * Changes in version 1.5:
 *  - Disable caching for GET requests in IE
 *  - Detect old browser and alert message
 *  - Add summary page
 *
 * Changes in version 1.6
 * - Add AddEmployee route
 * - Add VerifyPlatformEmployee route
 * - Add cgNotify dependency
 * - Add BusinessAccountSetup route
 * - Add openGraphTags
 *
 * Changes in version 1.7
 * - Remove openGraphTags scope variable
 *   Since the facebook crawler crawls the webpage, the angular scope variables is not parsed,
 *   because these variables doesn't exist in that context.
 *
 * Changes in version 1.8:
 * - PMP-182 Add static pages routes
 * - Load CKEditor library
 *
 * Changes in version 1.9 (Project Mom and Pop - Gift Card Offers Search and View):
 * - use location.url() instead location.path() when redirecting
 *
 * Changes in version 1.10 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-159] Add Breadcrumbs
 *
 * @version 1.10
 * @author TCSASSEMBLER
 */
'use strict';

var app = angular.module("app", ["ngRoute", "ngDropdowns", "flow", "infinite-scroll", 'LocalStorageModule', 'summernote', 'qtip2', 'ui.bootstrap', 'ngSanitize',
    "ng.deviceDetector", "cgNotify", "crumble", "angulartics", "angulartics.google.analytics", "mockSecurity", 'angularUtils.directives.dirPagination']);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', '$log', '$interval', 'SecurityService', 'UserService', 'storage', 'config', 'util', 'GiftCardOfferService', 'crumble', '$uibModal',
	function ($rootScope, $location, $window, $log, $interval, SecurityService, UserService, storage, config, util, GiftCardOfferService, crumble, $uibModal) {

        $(document).ready(function () {
            OAuth.initialize(config.OAUTH_PUBLIC_KEY);
        });

        //keep temporary data between controllers
        $rootScope.tmp = {};
        $rootScope.location = $location;
        $rootScope.config = config;
        $rootScope.goto = function (path) {
            $rootScope.isExpand = false;
            if (path === 'back') { // Allow a 'back' keyword to go to previous page
                $window.history.back();
            } else { // Go to the specified path
                $location.url(path);
            }
        };

        //Load CKEditor library
        if ($location.path() === '/EditStaticPages' && util.isLoggedIn() && util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
            $rootScope.loadCKEditor = true;
        }

        /**
         * Get homepage url based on role
         * @return {String} the url
         */
        $rootScope.getHome = function () {
            if (!util.isLoggedIn()) {
                return "/";
            }
            if (util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
                $location.url('/FounderStatus');
            } else {
                $location.url('/Founder$hares');
            }
        };
        /**
         * Redirect to sharer page
         * @param destination the target social network e.g. twitter, facebook
         * @param offer the offer
         * @param offerTitle the offer title
         */
        $rootScope.shareUrl = function (destination, offer, offerTitle) {
            //popup must be open immediately otherwise browser will block it
            $rootScope.openShareWindow(destination, offer, offerTitle);
            GiftCardOfferService.increaseSharedCount(offer.id).catch(function () {
                console.log("Cannot increase share count.");
            });

        };

        /**
         * Open the share window.
         * @param destination the target social network e.g. twitter, facebook
         * @param offerId the offer id
         * @param offerTitle the offer title
         */
        $rootScope.openShareWindow = function (destination, offer, offerTitle) {
            var urlhead = 'http://rest.sharethis.com/v1/share/share?destination=';
            var pageUrl = $location.absUrl().split("#")[0];
            if (offer) {
                pageUrl += "#/?offerId=" + offer.id;
            }
            var urlparm = '&url=' + window.encodeURIComponent(pageUrl) + '&api_key=' + config.SHARE_THIS_PUBLISHER_KEY + '&title=' + window.encodeURIComponent(offerTitle);
            window.open(urlhead + destination + urlparm, 'sharer', "toolbar=0,status=0,height=500,width=600")
        };

        /**
         * Open url.
         * @param destination the target url
         */
        $rootScope.openUrl = function (destination) {
            $window.open(destination, '_blank');
        };

        $rootScope.$on('$routeChangeStart', function (e, target) {
            $rootScope.modal = false;
            var route = target.$$route;
            if (!route) {
                return;
            }
            $rootScope.header.page = route.headerPage;
            $rootScope.header.stickExpanded = false;
            $rootScope.header.hasAside = route.hasAside;
            if (!$rootScope.tmp) {
                $rootScope.tmp = {};
            }
            if (route.originalPath !== '/Login') {
                $rootScope.tmp.redirectUrl = route.originalPath;
            } else {
                if ($rootScope.tmp.redirectUrl === '/' && $rootScope.tmp.offerId) {
                    $rootScope.tmp.redirectUrl += '?offerId=' + $rootScope.tmp.offerId;
                }
            }
            if (route.isPublic) {
                return;
            }
            if (!util.isLoggedIn()) {
                $location.url('/Login');
                return;
            }
            if (!route.roles) {
                return;
            }
            var hasAccess = _.any(route.roles, util.getUserRoles);
            if (!hasAccess) {
                $location.url('/');
            }
        });
        
        function checkForumNickname() {
            if($location.path().startsWith('/Forum') && $rootScope.loggedUser 
                && !$rootScope.loggedUser.nickname && !$rootScope.nicknameModal) {
                    
                $rootScope.nicknameModal = $uibModal.open({
                    templateUrl: 'forum-nickname-registration.html',
                    controller: 'nicknamePopupCtrl',
                    controllerAs: 'vm',
                    windowClass: 'nickname-modal'
                });
                
                $rootScope.nicknameModal.result
                    .then(function(nickname) {
                        $rootScope.loggedUser.nickname = nickname;
                    })
                    .finally(function() {
                        $rootScope.nicknameModal = null;
                    });
            }
        }
        
        $rootScope.$on('$routeChangeSuccess', checkForumNickname);
        $rootScope.$watch('loggedUser', checkForumNickname);
        

        if (!util.isLoggedIn()) {
            storage.clear();
        } else {
            $rootScope.loggedUser = storage.getCurrentUserProfile();
            UserService.getMyUserProfile().then(function (profile) {
                $rootScope.loggedUser = profile;
                storage.storeCurrentUserProfile(profile, true);
            });
        }
        $rootScope.shortDateFormat = 'MM/dd/yyyy';
        $rootScope.longDateFormat = 'MM/dd/yyyy hh:mm a';

        $(document).on('scroll', function () {
            var previous = $rootScope.header.stick;
            $rootScope.header.stick = $(document).scrollTop() > 90;
            if ($rootScope.header.stick !== previous) {
                $rootScope.$apply();
            }
        });
													     // Setup Crumble
	var getParent = crumble.getParent;
	crumble.getParent = function (path) {
	    var route = crumble.getRoute(path);
	    return route && angular.isDefined(route.parent) ? route.parent : getParent(path);
	};

    }]);


// Check for mobile device and redirect to mobile version
app.run(['config', 'deviceDetector', '$location', 'notify', function (config, deviceDetector, $location, notify) {
    if (deviceDetector.isMobile() && !deviceDetector.isTablet()) {
        window.location = config.MOBILE_SERVICE_BASE_URL + "#" + $location.url();
        return;
    }
    //IE check is in index.html
    if (deviceDetector.raw.browser.opera || deviceDetector.raw.browser.unknown) {
        notify({message: window.notSupportedBrowserError, templateUrl: 'partials/module/notify-popup.html'});
    }
}]);

app.config(['$httpProvider', "config", function ($httpProvider, config) {
    //disable IE ajax request caching
    $httpProvider.interceptors.push(function () {
        return {
            request: function (reqConfig) {
                if (reqConfig.url.indexOf(config.REST_SERVICE_BASE_URL) === 0) {
                    reqConfig.headers['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
                }
                return reqConfig;
            }
        }
    });
}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.$watch("loggedUser", function (value) {
        if (value) {
            ga("set", "&uid", value.id);
        } else {
            ga("set", "&uid", null);
        }
    });
}]);

app.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "partials/Home.html",
                controller: 'homeCtrl',
                isPublic: true,
                hasAside: true,
                headerPage: 'home',
                label: ''
            })
            .when("/Login", {
                templateUrl: "partials/Login.html",
                controller: 'loginCtrl',
                isPublic: true,
                hasAside: true,
                label: 'Login'
            })
            .when("/history", {
                templateUrl: "partials/history.html",
                controller: 'historyCtrl',
                label: 'My History',
                parent: '/myInfo'
            })

            .when("/myInfo", {
                templateUrl: "partials/MyInfo.html",
                controller: 'profileCtrl',
                label: 'My Profile'
            })
            .when("/FounderMyEmployees", {
                templateUrl: "partials/MyEmployees.html",
                controller: 'businessEmployeesCtrl',
                label: 'My Employees',
                parent: '/myInfo'
            })
            .when("/Payment/:purpose", {
                templateUrl: "partials/Payment.html",
                controller: 'paymentCtrl',
                label: 'Payment',
                parent: '/'
            })
            .when("/PaymentVerification/:purpose", {
                templateUrl: "partials/PaymentVerification.html",
                controller: 'paymentVerificationCtrl',
                label: 'Payment Verification',
                parent: '/'
            })
            .when("/VerifyAccount", {
                templateUrl: "partials/VerifyAccount.html",
                controller: 'verifyAccountCtrl',
                label: 'Verify Account'
            })
            .when("/ShoppingCart", {
                templateUrl: "partials/ShoppingCart.html",
                controller: 'shoppingCartCtrl',
                label: 'Payment'
            })
            .when("/FounderStatus", {
                templateUrl: "partials/FounderStatus.html",
                controller: 'founderStatusCtrl',
                label: 'Founder Status',
                parent: '/myInfo'
            })
            .when("/Founder$hares", {
                templateUrl: "partials/Founder$hares.html",
                controller: 'giftCardOffersCtrl',
                label: 'My Founder$hares',
                parent: '/myInfo'
            })
            .when("/GiftCardSummary", {
                templateUrl: "partials/GiftCardSummary.html",
                controller: 'giftCardSummaryCtrl',
                label: 'Gift Card Summary',
                parent: '/myInfo'
            })
            .when("/FounderF$Posting", {
                templateUrl: "partials/FounderF$Posting.html",
                controller: 'giftCardOfferCtrl',
                label: 'Post F$',
                parent: '/myInfo'
            })
            .when("/AllPostings", {
                templateUrl: "partials/AllPostings.html",
                controller: 'allPostingsCtrl',
                label: 'All Postings',
                parent: '/myInfo'
            })
            .when('/AddPlatformAdmin', {
                templateUrl: 'partials/addPlatformAdmin.html',
                controller: 'addPlatformAdminCtrl',
                resolve: {
                    adminList: function (UserService) {
                        return UserService.getAllPlatformAdmins();
                    }
                },
                label: 'Add Platform Admin',
                parent: '/myInfo'
            })
            .when('/EditStaticPages', {
                templateUrl: 'partials/EditStaticPages.html',
                controller: 'editStaticPagesCtrl',
                label: 'Edit Static Pages',
                parent: '/myInfo'
            })
            .when('/BusinessAccountSetup', {
                templateUrl: 'partials/businessAccountSetup.html',
                controller: 'businessAccountSetupCtrl',
                label: 'Business Account Setup',
                parent: '/myInfo'
            })
            .when('/VerifyPlatformEmployee', {
                controller: 'VerifyPlatformEmployeeCtrl',
                templateUrl: 'partials/VerifyPlatformEmployee.html',
                isPublic: true,
                label: 'Verify Platform Employee'
            })
            .when("/FounderF$Gifting/:id", {
                templateUrl: "partials/Gifting.html",
                controller: 'giftingCtrl',
                label: 'Founder$hare Gifting',
                parent: '/Founder$hares'
            })
            .when("/Gift/:code", {
                templateUrl: "partials/OpenGift.html",
                controller: 'openGiftCtrl',
                isPublic: true,
                label: 'Open Gift',
                parent: '/'
            })
            .when("/ReportAbuse/:giftCardOfferId", {
                templateUrl: "partials/ReportAbuse.html",
                controller: 'reportAbuseCtrl',
                isPublic: true,
                label: 'Report Abuse',
                parent: '/'
            })
            .when("/ProvideFeedback", {
                templateUrl: "partials/ProvideFeedback.html",
                controller: 'feedbackCtrl',
                isPublic: true,
                label: 'Provide Feedback'
            })
            .when("/Register", {
                templateUrl: "partials/Register.html",
                controller: 'registerCtrl',
                isPublic: true,
                label: 'Register'
            })
            .when("/VerifyEmail/:userId/:token", {
                templateUrl: "partials/VerifyEmail.html",
                controller: 'verifyEmailCtrl',
                isPublic: true,
                label: 'Verify Email',
                parent: '/'
            })
            .when("/ResetPassword", {
                templateUrl: "partials/ResetPassword.html",
                controller: 'resetPasswordCtrl',
                isPublic: true,
                label: 'Reset Password'
            })
            .when("/ForgotPassword", {
                templateUrl: "partials/ForgotPassword.html",
                controller: 'forgotPasswordCtrl',
                isPublic: true,
                label: 'Forgot Password'
            })

            //==================//
            .when('/HowItWorks', {
                templateUrl: 'partials/HowItWorks.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'How It Works'
            })
            .when('/HowItWorks/business', {
                templateUrl: 'partials/HowItWorksBusiness.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'Business',
                parent: '/HowItWorks'
            })
            .when('/HowItWorks/customer', {
                templateUrl: 'partials/HowItWorksCustomer.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'howItWorks',
                label: 'Customer',
                parent: '/HowItWorks'
            })
            .when('/About', {
                templateUrl: 'partials/About.html',
                isPublic: true,
                headerPage: 'about',
                label: 'About'
            })
            .when('/Blog', {
                templateUrl: 'partials/Blog.html',
                isPublic: true,
                headerPage: 'blog',
                label: 'Blog'
            })
            .when('/Forum', {
                templateUrl: 'forum/partials/Forum.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                label: 'Forums',
                controller: 'forumCtrl',
                parent: '/'
            })
            .when('/Forum/:sectionId', {
                templateUrl: 'forum/partials/Forum.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                controller: 'forumCtrl',
                label: 'Threads',
                parent: '/Forum'
            })
            .when('/Forum/:sectionId/new-thread', {
                templateUrl: 'forum/partials/PostEditor.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                controller: 'postEditorCtrl',
                label: 'New Thread',
                parent: '/Forum'
            })
            .when('/Forum/:sectionId/:threadId', {
                templateUrl: 'forum/partials/Posts.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                controller: 'forumCtrl',
                label: 'Thread',
                parent: '/Forum'
            })
            .when('/Forum/:sectionId/:threadId/quote/:quotePostId', {
                templateUrl: 'forum/partials/PostEditor.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                controller: 'postEditorCtrl',
                label: 'Quote',
                parent: '/Forum'
            })
            .when('/Forum/:sectionId/:threadId/reply/:replyPostId', {
                templateUrl: 'forum/partials/PostEditor.html',
                isPublic: true,
                hasAside: true,
                headerPage: 'forum',
                controller: 'postEditorCtrl',
                label: 'Quote',
                parent: '/Forum'
            })
            .when('/Faq', {
                templateUrl: 'partials/Faq.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                headerPage: 'faq',
                label: 'FAQ'
            })
            .when('/Copyright', {
                templateUrl: 'partials/Copyright.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Copyright'
            })
            .when('/PrivacyPolicy', {
                templateUrl: 'partials/PrivacyPolicy.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Privacy Policy'
            })
            .when('/TermsAndConditions', {
                templateUrl: 'partials/TermsAndConditions.html',
                controller: 'staticPagesCtrl',
                isPublic: true,
                label: 'Terms And Conditions'
            })

            //==================//

            .otherwise({
                redirectTo: '/'
            });
    }
]);


(function () {
    var query = window.location.search;
    //twitter urls must be without # hash
    //redirect url like /?go=page/123 to /#/page/123
    if (query && query.indexOf("go=") !== -1) {
        var split = query.split("go=");
        var url = window.location.pathname + "#" + decodeURIComponent(split.pop());
        window.location = url;
    }
})();

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * Changes in version 1.1:
 *  - Added wordpress related configuration items.
 *
 * Changes in version 1.2:
 *  - Added LOAD_MORE_ITEM_COUNT configuration item.
 * 
 * Changes in version 1.3:
 * - Remove SESSION_TOKEN_REFRESH_PERIOD
 * - Fix WP pages (use production links)
 *
 * Changes in version 1.4 (Project Mom and Pop - MiscUpdate5):
 * - Add OFFER_CONDITIONS_MAX_CHARS
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015):
 * - Add MAX_IMAGE_SIZE
 * - Add MIN_BUY_NOW_VALUE
 *
 * @version 1.5
 * @author TCSASSEMBLER
 */

var GOOGLE_ANALYTICS = "UA-57785814-1";  // Prod env Id
// var GOOGLE_ANALYTICS = "UA-57785814-2";  // QA env Id

angular.module("app")
    .constant('config', _.extend({
        REST_SERVICE_BASE_URL: 'http://localhost:3000',
        MOBILE_SERVICE_BASE_URL: 'http://localhost:3501',
        SHARE_THIS_PUBLISHER_KEY: 'b1693be36ac5f67cf7d4eedb77174710',
        OAUTH_PUBLIC_KEY: 'kmmZyTgBxJ8gMc8d13E_w1vcnT8',

        FRIEND_INVITATION_MESSAGE_TEMPLATE: '',
        FORUM_QUOTE_HTML_TEMPLATE: '<blockquote>{{post.body}} <span class="msg-posted-by">(Posted by <span class="msg-username">{{post.author.name}}</span>)</span></blockquote>' + 
                                   '<div class="msg-response"><br/><br/></div>',

        FAKE_NONCE: false,
        PASSWORD_LENGTH: 7,
        BLOG_URL: 'http://foundershare.com/wp/?p=626',
        ABOUT_URL: 'http://foundershare.com/wp/?p=765',

        LOAD_MORE_ITEM_COUNT: 4,

	/* TEMPORARY: [PMP-178] Used to set default value for buy now
	 * function */
	DEFAULT_BUY_NOW_VALUE: 100,
	MIN_BUY_NOW_VALUE: 10, // Minimal gift card amount (in $)
	OFFER_CONDITIONS_MAX_CHARS: 110,
	MAX_IMAGE_SIZE: 819200 // 800Kb
    }, window.config_local || {}))
    .constant('roles', {
        BUSINESS_ADMIN: "BUSINESS_ADMIN"
    });

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Verify platform employee controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('VerifyPlatformEmployeeCtrl', ['$scope', '$rootScope', 'UserService', '$location', 'util', 'notify',
        function ($scope, $rootScope, UserService, $location, util, notify) {
            var params = $location.search();
            if(params && params.token) {
                UserService.verifyPlatformAdmin(params.token).then(function(data) {
                    if($rootScope.tmp) {
                        delete $rootScope.tmp.redirectUrl;
                    }
                    util.loginHandler(data.sessionToken);
                }, function() {
                    notify({message: 'Error verifying account. Try again later', templateUrl: 'partials/module/notify-popup.html'});
                    $location.path('#/');
                });
            }
        }
    ]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Add employee controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('addPlatformAdminCtrl', ['$scope', 'UserService', '$route', 'adminList', 'notify',
        function ($scope, UserService, $route, adminList, notify) {
            $scope.adminList = adminList;
            $scope.showPasswordModal = false;

            var doProcess = function() {
                if($scope.operation === 'add') {
                    UserService.addPlatformAdmin($scope.user, $scope.password).then(function() {
                        notify({message: 'Platform employee added successfully', templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    }, function(reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    });
                } else if($scope.operation === 'delete') {
                    UserService.deletePlatformAdmin($scope.employee.id, {password: $scope.password}).then(function() {
                        notify({message: 'Platform employee deleted successfully', templateUrl: 'partials/module/notify-popup.html'});
                        $route.reload();
                    }, function(reason) {
                       notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                       $route.reload();
                    });
                }
                delete $scope.password;
            }

            /**
             * Controller function to delete platform admin
             * This is click listener for delete link
             */
            $scope.deleteAdmin = function(employee) {
                $scope.showPasswordModal = true;
                $scope.operation = 'delete';
                $scope.employee = employee;
            };

            /**
             * Controller function to add a platform admin
             * This is button click listener for add button
             */
            $scope.addAdmin = function(user) {
                if(!user || !user.firstName || !user.email) {
                    notify({message: 'Enter a valid email address and first name', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                $scope.showPasswordModal = true;
                $scope.operation = 'add';
                $scope.user = user;
            };

            /**
             * Close the modal popup
             */
            $scope.closeModal = function() {
                $scope.showPasswordModal = false;
            };
            /**
             * Process the operation
             */
            $scope.submit = function() {
                $scope.showPasswordModal = false;
                if($scope.password) {
                    doProcess();
                } else {
                    notify({message: 'Enter a valid password', templateUrl: 'partials/module/notify-popup.html'});
                }
            };
        }
    ]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * All postings controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('allPostingsCtrl', ['$scope', '$rootScope', 'GiftCardOfferService',
        function ($scope, $rootScope, GiftCardOfferService) {

            /**
             * Load all postings.
             */
            $scope.loadAllPostings = function () {
                var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
                GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 99999,
                    sortBy: "modifiedOn",
                    sortOrder: "Descending"
                }).then(function (data) {
                        $scope.giftCardOffers = data.items;
                    }, function (data) {
                    });
            };

            /**
             * Popup the dialog.
             * @param id the offer id.
             */
            $scope.popup = function (id) {
                $rootScope.$broadcast("showOfferPopup", id);
            };

            $scope.$on("reloadAllPostings", function (e, offerId) {
                $scope.loadAllPostings();
            });

            $scope.loadAllPostings();
        }
    ]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business Account setup controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('businessAccountSetupCtrl', ['$scope', 'BusinessService',
        function ($scope, BusinessService) {
          $scope.showPayment = false;
          BusinessService.getMyBusiness().then(function (business) {
            $scope.business = business;
          }, function () {
            notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
          });
          $scope.subscribe = function() {
            $scope.showPayment = true;
          };
        }
    ]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business employee controller.
 *
 * Changes in version 1.1:
 *  - Fixed the integrated issues.
 *
 * Changes in version 1.2:
 *  - Updated the add employee logic.
 *
 * Changes in version 1.3:
 * - Switch to read mode only if updated employee was successfully created/updated
 *
 * Changes in version 1.4
 * - Replace native javascript alerts with notify
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - Make the password field optional when updating an employee
 *
 * @version 1.5
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("businessEmployeesCtrl", ['$scope', 'BusinessService', 'notify',
	function ($scope, BusinessService, notify) {
	    $scope.businessName = "";
	    $scope.currentIndexFlag = 0;
	    $scope.password = {
		placeholder: "*******"
	    };
            /**
             * Load entities.
             */
            $scope.loadEntities = function () {
                BusinessService.getBusinessEmployees().then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].flag = false;
                        data[i].username = data[i].email;
                        data[i].passwordEmpty = true;
                    }
                    $scope.employeesList = data;


                }, function (reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            $scope.loadEntities();
            BusinessService.getMyBusiness().then(function (business) {
                $scope.businessName = business.name.replace(/ /g,'');
            }, function () {
                notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
            });
            /**
             * Added item.
             */
            $scope.add = function () {
                var item = {
                    "firstName": "",
                    "lastName": "",
                    "username": $scope.businessName,
                    "password": "",
                    "flag": true,
		    isNew: true,
                    passwordEmpty: true,
                    nameEmpty: true,
                    usernameEmpty: true,
                    lastNameEmpty: true
                };
                $scope.employeesList.push(item);
		$scope.password.placeholder = "";
            };

            /**
             * Modified item.
             * @param idx the item id
             */
            $scope.update = function (idx) {
                $scope.employeesList[idx].flag = true;
		$scope.password.placeholder = "*******";
            };

            /**
             * Validated changes.
             * @param idx the item id.
             */
            $scope.validateChange = function (idx) {
                if ($scope.employeesList[idx].firstName.trim() === '') {
                    $scope.employeesList[idx].nameEmpty = true;
                } else {
                    $scope.employeesList[idx].nameEmpty = false;
                }

                if ($scope.employeesList[idx].lastName.trim() === '') {
                    $scope.employeesList[idx].lastNameEmpty = true;
                } else {
                    $scope.employeesList[idx].lastNameEmpty = false;
                }

                if (($scope.employeesList[idx].username.trim() === '')) {
                    $scope.employeesList[idx].usernameEmpty = true;
                } else {
                    $scope.employeesList[idx].usernameEmpty = false;
                }
		
		if (($scope.employeesList[idx].isNew &&
		     $scope.employeesList[idx].password.trim() === '')) {
		    $scope.employeesList[idx].passwordEmpty = true;
                } else {
                    $scope.employeesList[idx].passwordEmpty = false;
                }
            };
            /**
             * Saved item.
             * @param idx the item id
             */
            $scope.save = function (idx) {
                // validation
                if ($scope.employeesList[idx].firstName.trim() === ''
		    || $scope.employeesList[idx].lastName.trim() === ''
                    || $scope.employeesList[idx].username.trim() === ''
		    || ($scope.employeesList[idx].isNew &&
			$scope.employeesList[idx].password.trim() === '')) {
                    return;
                }

                $scope.currentIndexFlag = idx;

                if ($scope.employeesList[idx].id) {
                    // update
                    BusinessService.updateBusinessEmployee($scope.employeesList[idx].id, $scope.employeesList[idx]).then(function () {
                        delete $scope.employeesList[idx].flag;
			if ($scope.employeesList[idx].isNew) {
			    delete $scope.employeesList[idx].isNew;
			}
                        //load entity
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $scope.employeesList[idx].flag = true;
                    });
                }
                else {
                    var entity = _.pick($scope.employeesList[idx], 'firstName', 'lastName', 'username', 'password');
                    BusinessService.addBusinessEmployees(entity).then(function () {
                        delete $scope.employeesList[idx].flag;
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        $scope.employeesList[idx].flag = true;
                    });
                }

            };
            /**
             * Delete item.
             * @param idx the item id.
             */
            $scope.delete = function (idx) {
                if ($scope.employeesList[idx].id) {
                    BusinessService.deleteBusinessEmployee($scope.employeesList[idx].id).then(function (data) {
                        //load entity
                        $scope.loadEntities();
                    }, function (reason) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    });
                } else {
                    $scope.employeesList.splice(idx, 1);
                }
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Edit static pages controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .directive('ckEditor', ['config', 'storage', function (config, storage) {
	return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {
		var ck = CKEDITOR.replace(elm[0], {
		    extraPlugins: 'uploadimage',
		    uploadUrl: config.REST_SERVICE_BASE_URL + '/fileUpload?'
		});

		ck.on('fileUploadRequest', function( evt ) {
		    var xhr = evt.data.fileLoader.xhr;
		    var accessToken = storage.getSessionToken();

		    xhr.setRequestHeader('Cache-Control', 'no-cache');
		    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		    var form = new FormData();
		    form.append("upload", evt.data.fileLoader.file, evt.data.fileLoader.fileName);
		    xhr.send(form);

		    // Prevented default behavior.
		    evt.stop();
		} );

		ck.on('pasteState', function () {
                    $scope.$apply(function () {
			ngModel.$setViewValue(ck.getData());
                    });
		});

		ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
		};
            }
	};
    }])
    .controller('editStaticPagesCtrl', ['$scope', '$location', 'StaticPageService', 'notify', 'util', function ($scope, $location, StaticPageService, notify, util) {
	if (!util.getUserRoles(util.PLATFORM_EMPLOYEE)) {
	    $location.path('/Home');
	    return;
	}

	$scope.pages = {
	    availablePages: [],
	    activePage: null
	};

	$scope.password = '';
	$scope.modal = false;

	$scope.reset = loadPages;
	$scope.save = save;
	$scope.confirmPassword = confirmPassword;
	$scope.closeModal = closeModal;

	loadPages();

	/**
	 * Set available pages and make the first one active.
	 * @param {[Page]} pages the pages
	 */
	function setPages(pages) {
	    $scope.pages.availablePages = pages;
	    $scope.pages.activePage = $scope.pages.availablePages[0];
	}

	/**
	 * Load pages.
	 */
	function loadPages() {
	    StaticPageService.getAllPages().then(function(pages) {
		setPages(pages);
	    }, function(reason) {
		notify({message: "The pages could not be loaded: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	}

	/**
	 * Begin save process for active page. This opens the save
	 * modal to ask for password confirmation.
	 */
	function save() {
	    $scope.modal = true;
	}

	/**
	 * Close the modal.
	 */
	function closeModal() {
	    $scope.password = '';
	    $scope.modal = false;
	}

	/**
	 * Save the active page and close the modal.
	 */
	function confirmPassword() {
	    StaticPageService.savePage($scope.pages.activePage, $scope.password).then(function(result) {
		notify({message: "Your modifications have been saved successfully.", templateUrl: 'partials/module/notify-popup.html'});
	    }, function(reason) {
		notify({message: "Your modifications could not be saved: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	    closeModal();
	}
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Feedback controller.
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1
 * - Change feedback popup text
 *
 * Changes in 1.2
 * - Only logged in users can give feedback.
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - Feedback message is optional
 * - Disable send button while sending feedback
 * - Fix validation error when subject is only white spaces
 */

angular.module("app")
    .controller("feedbackCtrl", ['$scope', '$rootScope', '$location', 'NotificationService', 'LookupService', 'storage', '$log', 'notify', 'util', '$analytics',
        function ($scope, $rootScope, $location, NotificationService, LookupService, storage, $log, notify, util, $analytics) {
            /**
             * If not logged in, go to login page and
             * redirect to provide feedback page after
             * successful login.
             */
            if (!util.isLoggedIn()) {
                $rootScope.tmp = {};
                $rootScope.tmp.redirectUrl = '/ProvideFeedback';
                $location.path('/Login');
            }

            $scope.feedbackType = {};
            $scope.message = '';
            $scope.subject = '';
            $scope.feedbackTypes = [];
            $scope.feedbackSending = false;


            LookupService.getAllFeedbackTypes().then(function (data) {
                $scope.feedbackTypes = data;
                $scope.feedbackType = {'name': $scope.feedbackTypes[0].name, 'id': $scope.feedbackTypes[0].id};
            }, function (data) {
                notify({message: data, templateUrl: 'partials/module/notify-popup.html'});
                $log.log(data);
            });

            /**
             * Send feedback.
             */
            $scope.send = function () {
                if ($scope.feedbackSending) {
                    return;
                }
                $scope.submitted = false;
                if (!$scope.subject || $scope.subject.trim().length === 0) {
                    $scope.feedbackSending = false;
                    $scope.submitted = true;
                } else {
                    $scope.feedbackSending = true;
                    NotificationService.sendFeedback({
                        "subject": $scope.subject,
                        "message": $scope.message,
                        "type": Number($scope.feedbackType.id)
                    }).then(function (data) {
                        $scope.feedbackSending = false;
                        $scope.subject = '';
                        $scope.message = '';
                        notify({
                            message: "Your feedback was successfully sent. We appreciate it!",
                            templateUrl: 'partials/module/notify-popup.html'
                        });
                        $analytics.eventTrack($scope.feedbackType.name, {  category: 'Feedback' });
                    }, function (reason) {
                        notify({message: "Fail to send feedback.", templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Forgot Password Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("forgotPasswordCtrl", ['$scope', '$rootScope', '$location', 'SecurityService', 'notify', function ($scope, $rootScope, $location, SecurityService, notify) {
        // set redirect url to null
        if($rootScope.tmp) {
            delete $rootScope.tmp.redirectUrl;
        }
        $rootScope.modal = true;
        $scope.closeModal = function () {
            $rootScope.modal = false;
        };
        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                // send the password reset link to user email address
                SecurityService.recoverPassword($scope.email).then(function () {
                    $rootScope.modal = false;
                    notify({message: 'Please check your email and open reset link.', templateUrl: 'partials/module/notify-popup.html' });
                    $location.path('/');
                }, function (reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html' });
                });
            }
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Founder status controller.
 *
 * Changes in version 1.1:
 *  - Refractor the founder status page.
 *
 * Changes in version 1.2:
 *  - Added showHistory() method.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("founderStatusCtrl", ['$scope', 'UserService', 'BusinessService', '$rootScope', 'notify',
        function ($scope, UserService, BusinessService, $rootScope, notify) {

            function loadItems() {
                BusinessService.search({pageNumber: 0}).then(function (result) {
                    $scope.items = result.items;
                    _.each($scope.items, function (item) {
                        item.step1st = !!(item.name && item.streetAddress);
                        if (item.isVerificationFeePaid) {
                            item.step2nd = true;
                            item.step3rd = item.isVerified;
                        } else {
                            item.step2nd = false;
                            item.step3rd = false;
                        }
                    })
                }, function (reason) {
                    notify({ message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            }

            loadItems();
            /**
             * Verify business.
             */
            $scope.verifyBusiness = function () {
                $scope.modal = true;
                BusinessService.verifyByPlatformAdmin($scope.founder.id).then(function () {
                        loadItems();
                        $scope.modal = false;
                    }, function (reason) {
                        notify({ message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    }
                );
            };

            /**
             * Show modal.
             * @param founder the founder entity.
             */
            $scope.showModal = function (founder) {
                $scope.modal = true;
                $scope.founder = founder;
            };
            /**
             * Hide modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };

            /**
             * Show history popup.
             * @param id the business id.
             */
            $scope.showHistory = function (id) {
                $rootScope.$broadcast("showBusinessHistoryPopup", id);
            };

        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offers Controller
 *
 * Changes in version 1.1:
 *  - Fixed the integration issues.
 *
 * Changes in version 1.2:
 *  - Updated the date time input fields.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * Changes in verison 1.4 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-206] Display platform and offer specific conditions
 * - [PMP-158] Fix activation date and post end date display
 *
 * @version 1.4
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOfferCtrl', ['$scope', '$location', 'GiftCardOfferService', 'BusinessService', "LookupService", "storage", "$routeParams", "notify", 'config',
	function ($scope, $location, GiftCardOfferService, BusinessService, LookupService, storage, $routeParams, notify, config) {
            $scope.user = storage.getCurrentUserProfile();
            $scope.modal = false;
            $scope.notVerifiedModal = false;
            $scope.isVerificationFeePaidModal = false;

            LookupService.getAllBusinessTypes().then(function (types) {
                $scope.businessTypeIndex = _.indexBy(types, "id");
            }, function () {
                notify({message: "Cannot get business types", templateUrl: 'partials/module/notify-popup.html'});
            });

	    /* Get platform conditions */
	    $scope.conditions = {
		platform: '',
		custom: '',
		maxChars: config.OFFER_CONDITIONS_MAX_CHARS
	    };
	    LookupService.getPlatformGiftCardOfferConditions().then(function(result) {
		$scope.conditions.platform = result.conditions;
	    }, function() {
		notify({message: "Cannot get platform conditions", templateUrl: 'partials/module/notify-popup.html'});
	    });

            if ($scope.isFounder) {
                BusinessService.getMyBusiness().then(function (business) {
                    $scope.business = business;
                    $scope.businessAddress = business.streetAddress + ' ' + business.city + ', ' + business.state + ' ' + business.country + ' ' + business.zip;
                }, function () {
                    notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
                });
            }

            if ($routeParams.id) {
                // get existing gift card offer
                GiftCardOfferService.getGiftCardOffer($routeParams.id).then(function (result) {
                    $scope.cardOffer = result;
                    $scope.progress = result.availableQuantity + "," + result.totalQuantity;
                    $scope.spentQuantity = result.totalQuantity - result.availableQuantity;
                    var endDateTime = moment(result.endDateTime);
                    var activationDateTime = moment(result.activationDateTime);
                    $scope.postingEnd = {
                        date: endDateTime.toDate(),
                        hours: endDateTime.format("hh"),
                        minutes: endDateTime.format("mm"),
                        am: endDateTime.format("A")
                    };
                    $scope.activation = {
                        date: activationDateTime.toDate(),
                        hours: activationDateTime.format("hh"),
                        minutes: activationDateTime.format("mm"),
                        am: activationDateTime.format("A")
                    };
		    $scope.conditions.custom = result.conditions;
                }, function () {
                    notify({message: "Cannot get gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            } else {
                //for new item, show always 100% progress
                $scope.progress = "1,1";
                $scope.spentQuantity = 0;
                $scope.cardOffer = {
                    status: "DRAFT"
                };
                //will keep date and time for posting end date and activation date time
                $scope.postingEnd = {
                    date: new Date(),
                    hours: '12',
                    minutes: '00',
                    am: 'AM'
                };
                $scope.activation = {
                    date: new Date(),
                    hours: '12',
                    minutes: '00',
                    am: 'AM'
                };
            }


            //close all modals
            $scope.closeModal = function () {
                $scope.isVerificationFeePaidModal = $scope.notDraftModal = $scope.postModal = $scope.saveModal = $scope.modal = $scope.notVerifiedModal = false;
            };

            /**
             * Get the share url title.
             * @returns {string} the populated title
             */
            $scope.shareUrlTitle = function () {
                return 'This is really cool. Check out ' + $scope.business.name + ' on FounderShare ';
            };

            //save offer or create new item
            //this method is called when save button is clicked and after post now is clicked
            $scope.save = function (setActive) {
                if (setActive) {
                    if (!$scope.business.isVerified) {
                        $scope.notVerifiedModal = $scope.modal = true;
                        return;
                    }
                    if (!$scope.business.isVerificationFeePaid) {
                        $scope.isVerificationFeePaidModal = $scope.modal = true;
                        return;
                    }
                }
                if ($scope.cardOffer.status !== "DRAFT") {
                    $scope.notDraftModal = $scope.modal = true;
                    return;
                }
		if ($scope.cardOffer.conditions && $scope.cardOffer.conditions.length > $scope.conditions.maxChars) {
		    return;
		}

                if ($scope.form.$invalid) {
                    return;
                }

                if (setActive) {
                    $scope.cardOffer.status = "ACTIVE";
                }
                $scope.cardOffer.discount = Number($scope.cardOffer.discount);
                $scope.cardOffer.totalQuantity = Number($scope.cardOffer.totalQuantity);
                var promise;
                if ($scope.cardOffer.id) {
                    promise = GiftCardOfferService.updateGiftCard($scope.cardOffer);
                } else {
                    promise = GiftCardOfferService.createGiftCard($scope.cardOffer);
                }
                promise.then(function (result) {
                    $scope.cardOffer.id = result.id;
                    if (setActive) {
                        $scope.postModal = $scope.modal = true;
                    } else {
                        $scope.saveModal = $scope.modal = true;
                    }
                }, function (reason) {
                    $scope.cardOffer.status = "DRAFT";//revert status
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            //activate offer
            $scope.postNow = function () {
                $scope.save(true)
            };

            //parse date object (date, time fields) and return ISO String
            function parseDate(obj) {
                var date = moment((obj.date.getMonth() + 1) + '/' + obj.date.getDate() + '/' +  obj.date.getFullYear() + " "
                    + obj.hours + ":" + obj.minutes + " " + obj.am, "M/D/YYYY h:mm");
                return date.toISOString();
            }

            //convert user input to card offer field
            function updateEndDate() {
                if ($scope.postingEnd && $scope.postingEnd.date && $scope.postingEnd.hours && $scope.postingEnd.minutes && $scope.postingEnd.am) {
                    $scope.cardOffer.endDateTime = parseDate($scope.postingEnd);
                }
            }

            function updateActivationDate() {
                if ($scope.activation && $scope.activation.date && $scope.activation.hours && $scope.activation.minutes && $scope.activation.am) {
                    $scope.cardOffer.activationDateTime = parseDate($scope.activation);
                }
            }

            $scope.$watch("postingEnd.date", updateEndDate);
            $scope.$watch("postingEnd.hours", updateEndDate);
            $scope.$watch("postingEnd.minutes", updateEndDate);
            $scope.$watch("postingEnd.am", updateEndDate);
            $scope.$watch("activation.date", updateActivationDate);
            $scope.$watch("activation.hours", updateActivationDate);
            $scope.$watch("activation.minutes", updateActivationDate);
            $scope.$watch("activation.am", updateActivationDate);
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for gift card offer details
 *
 * Changes in version 1.1:
 *  - Added removePosting() and removeComment() method.
 *
 * Changes in version 1.2:
 *  - Remember created comment if user is not logged in (create comment after logging in)
 *  - Same feature for invite friend
 *
 * Changes in version 1.3
 * - Change "No expiration date" to "Offer expires in [x] days"
 *
 * Changes in version 1.4:
 * - [PMP-178] Temporarily disable Shopping Cart and replace with Buy Now
 *
 * Changes in version 1.5 (Project Mom and Pop - Gift Card Offers Search and View):
 * - Don't load google maps script
 *
 * Changes in version 1.6 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-198] Update wording of emailToFriend success message
 * - [PMP-214] Fix email friend function
 * - [PMP-215] Fix days remaining
 * - [PMP-214] Email friend button deactivated while sending email
 *
 * Changes in version 1.7 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-223] Add slider
 * - Change map zoom factor to 16
 *
 * @version 1.7
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("giftCardOfferPopupCtrl", ['$scope', '$rootScope', '$location', 'BusinessService', "NotificationService", "GiftCardOfferService", 'storage', '$log', 'util', 'config', "$timeout", "notify",
        function ($scope, $rootScope, $location, BusinessService, NotificationService, GiftCardOfferService, storage, $log, util, config, $timeout, notify) {
            $scope.comment = {text: ""};
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            $scope.showPopup = function () {
                $scope.comment.text = "";
                $scope.display = true;
                $rootScope.details = true;
            };

            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };


            function loadMap() {
                var lat = 0,
                    lng = 0;
                if ($scope.detailGiftCardOffer && $scope.detailGiftCardOffer.coordinates) {
                    lat = $scope.detailGiftCardOffer.coordinates[1];
                    lng = $scope.detailGiftCardOffer.coordinates[0];
                }

                var mapPosition = new google.maps.LatLng(lat, lng);
                var mapCanvas = $('#map-canvas').get(0);
                var mapOptions = {
                    center: mapPosition,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(mapCanvas, mapOptions);
                var marker = new google.maps.Marker({
                    position: mapPosition,
                    map: map
                });
            }

	    /* BEGIN TEMPORARY: PMP-178 */

            /**
             * Add the item to cart.
             * @param detailGiftCardOffer the given item to add
             */
	    /*
            $scope.addToCard = function (detailGiftCardOffer) {
                if (!config.FAKE_NONCE) {
                    storage.clearCart();
                }
                storage.addItemToCart(detailGiftCardOffer.id);
                if (util.isLoggedIn()) {
                    $scope.hidePopup();
                    $location.path('/ShoppingCart');
                } else {
                    $scope.hidePopup();
                    $location.path('/Login');
                }
            };
	    */


	    /**
	     * TEMPORARY: [PMP-178]
	     * Buy the item now and skip the shopping cart.
	     * @param detailGiftCardOffer the given item to buy
	     * @param value the value to put on the card
	     */
	    $scope.doBuyNow = function (detailGiftCardOffer, value) {
		if (Math.floor(value) != value) {
		    // Only full dollar amounts (no cents) are allowed
		    $scope.buyNow.value = Math.floor($scope.buyNow.value);
		    notify({message: "For now, gift card purchases have to be in whole dollar amounts (no cents).", templateUrl: 'partials/module/notify-popup.html'});
		    return;
		}
		if (!value || value > $scope.detailGiftCardOffer.availableQuantity) {
		    $scope.buyNow.invalid = true;
		    $scope.buyNow.value = $scope.detailGiftCardOffer.availableQuantity;
		    notify({message: "Whoops! Looks like you're trying to buy more than what's available.", templateUrl: 'partials/module/notify-popup.html'});
		    return;
		}
		var cartUrl = '/ShoppingCart?id='+detailGiftCardOffer.id+'&value='+value+'#pay';
		if (util.getUserRoles(util.INDIVIDUAL_USER)) {
                    $scope.hidePopup();
		    $location.url(cartUrl);
                } else if (!util.isLoggedIn()) {
                    $scope.hidePopup();
		    /* Redirect to payment page after login */
		    $rootScope.tmp = {
			redirectUrl: cartUrl
		    };
                    $location.path('/Login');
                } else {
		    /* This case should never be reached. But just in
		     * case, redirect to home. */
		    $location.path('/Home');
		}
	    };

	    //Update the range slider step size
	    $scope.sliderChanged = function() {
		$scope.buyNow.value = parseFloat($scope.buyNow.value);
		if ($scope.detailGiftCardOffer.availableQuantity - $scope.buyNow.value < 10) {
		    $scope.buyNow.step = 1;
		} else if ($scope.buyNow.value < 100) {
		    $scope.buyNow.step = 1;
		} else if ($scope.buyNow.value < 500) {
		    $scope.buyNow.step = 5;
		} else {
		    $scope.buyNow.step = 10;
		}
	    };

            /**
             * Show popup with details
             * @param offerId the offer id
             */
            $scope.showInfo = function (offerId) {
                GiftCardOfferService.getGiftCardOffer(offerId).then(function (item) {
                    $scope.detailGiftCardOffer = item;

		    // put conditions into an array
		    $scope.conditions = [];
		    _.each(item.platformConditions.split('\n'), function(c) {
			$scope.conditions.push(c);
		    });
		    if (item.conditions && item.conditions.trim().length) {
			$scope.conditions.push(item.conditions);
		    }

		    /* BEGIN TEMPORARY: [PMP-178] */
		    /* Buy now fields. We save the value and an
		     * invalid flag. Initialize value to a default
		     * (configuable) value or to available
		     * quantity. */
		    var initialValue = config.DEFAULT_BUY_NOW_VALUE;
		    if (initialValue > $scope.detailGiftCardOffer.availableQuantity) {
			initialValue = $scope.detailGiftCardOffer.availableQuantity;
		    }
		    $scope.buyNow = {
			value: initialValue,
			min: config.MIN_BUY_NOW_VALUE,
			step: 1,
			invalid: false
		    };

		    /* END TEMPORARY: [PMP-178] */

                    $scope.showPopup();

                    $scope.daysRemaining = Math.floor((new Date($scope.detailGiftCardOffer.expirationDate).getTime() - new Date().getTime()) / (24 * 3600 * 1000));
		    if ($scope.daysRemaining < 0) {
			$scope.daysRemaining = 'expired';
		    }
                    BusinessService.getBusiness(item.businessId).then(function (data) {
                        delete data.id;
                        angular.extend($scope.detailGiftCardOffer, _.omit(data, 'description'));
                        $scope.detailGiftCardOffer.address =
                            data.streetAddress + ' ' + data.city + ', ' + data.state + ' ' + data.country + ' ' + data.zip;
                        loadMap();

                        GiftCardOfferService.getGiftCardOfferComments(item.id).then(function (comments) {
                            $scope.detailGiftCardOffer.comments = comments;
                        }, function () {
                            notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                        });

                        if ($rootScope.tmp.pendingInvite) {
                            var invite = $rootScope.tmp.pendingInvite;
                            $rootScope.tmp.pendingInvite = null;
                            $scope.friendEmail = invite.friendEmail;
                            NotificationService.invitations(invite).then(function () {
                                notify({message: "Email has sent to " + invite.friendEmail + " successfully!", templateUrl: 'partials/module/notify-popup.html'});
                            }, function (data) {
                                notify({message: data.error, templateUrl: 'partials/module/notify-popup.html'});
                            });
                        }

                    }, function () {
                        notify({message: "Cannot get business details", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot get gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            };


            $scope.checkEnter = function ($event) {
                if ($event.keyCode == 13) {
                    var comment = $scope.comment.text.trim();
                    if (!comment) {
                        $event.preventDefault();
                        return;
                    }
                    $scope.submitComment();
                }
            };

            $scope.submitComment = function () {
                var giftCardOfferId = $scope.detailGiftCardOffer.id;
                var comment = $scope.comment.text.trim();
                if (!comment) {
                    return;
                }
                if (util.isLoggedIn()) {
                    $timeout(function () {
                        $scope.comment.text = "";
                    });
                    GiftCardOfferService.createGiftCardOfferComment(giftCardOfferId, comment).then(function () {
                        GiftCardOfferService.getGiftCardOfferComments(giftCardOfferId).then(function (comments) {
                            $scope.detailGiftCardOffer.comments = comments;
                        }, function () {
                            notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    }, function () {
                        notify({message: "Cannot create comment", templateUrl: 'partials/module/notify-popup.html'});
                    });
                } else {
                    $rootScope.tmp.pendingComment = {
                        comment: comment,
                        giftCardOfferId: giftCardOfferId
                    };
                    $scope.hidePopup();
                    $location.path('/Login');
                }
            };

            $scope.share = {
		emailError: false,
		emailSending: false,
		friendEmail: ''
	    };

            $scope.emailToFriend = function (offerId, offerTitle) {
		if ($scope.share.emailSending) {
		    return;
		}
		var friendEmail = $scope.share.friendEmail;
                if (friendEmail && friendEmail.indexOf('@') > 1) {
                    if (util.isLoggedIn()) {
                        $scope.share.emailError = false;
			$scope.share.emailSending = true;
			var friendInvitation = {
                            "friendEmail": friendEmail,
                            "offerId": offerId,
                            "offerTitle": offerTitle
                        };
			NotificationService.invitations(friendInvitation).then(function (data) {
			    $scope.share.emailSending = false;
			    notify({message: "You are so thoughtful! Your buddy just got an email with a link to this page.", templateUrl: 'partials/module/notify-popup.html'});
			    /* Reset friendEmail */
			    $scope.share.friendEmail = '';
			}, function (data) {
                            notify({message: data.error, templateUrl: 'partials/module/notify-popup.html'});
                        });
                    } else {
                        $scope.hidePopup();
			$scope.share.friendEmail = '';
                        $rootScope.tmp.redirectUrl = "/?offerId=" + offerId;
                        $rootScope.tmp.pendingInvite = {
                            "friendEmail": friendEmail,
                            "offerId": offerId,
                            "offerTitle": offerTitle
                        };
                        $location.path('/Login');
                    }
                } else {
                    $scope.share.emailError = true;
                }
            };

            $scope.$on("showOfferPopup", function (e, offerId) {
                GiftCardOfferService.increaseViewCount(offerId).then(function () {
                    $scope.showInfo(offerId);
                }, function () {
                    notify({message: "Cannot increase view count.", templateUrl: 'partials/module/notify-popup.html'});
                });

            });


            /**
             * Remove posting.
             * @param id the posting id.
             */
            $scope.removePosting = function(id) {
                GiftCardOfferService.removeGiftCardOffer(id).then(function () {
                    $scope.hidePopup();
                    $rootScope.$broadcast("reloadAllPostings", id);
                }, function () {
                    notify({message: "Cannot remove gift card offer", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Remove comment.
             * @param commentId - the comment id.
             * @param businessId - the business id.
             */
            $scope.removeComment = function(commentId, businessId) {
                GiftCardOfferService.removeGiftCardOfferComment(commentId, businessId).then(function () {
                    GiftCardOfferService.getGiftCardOfferComments($scope.detailGiftCardOffer.id).then(function (comments) {
                        $scope.detailGiftCardOffer.comments = comments;
                    }, function () {
                        notify({message: "Cannot get comments", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot remove comment", templateUrl: 'partials/module/notify-popup.html'});
                });
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offers Controller
 *
 * Changes in version 1.1:
 *  - Fixed the integration issues.
 *
 * Changes in version 1.2:
 *  - Add gift opening dialog
 *
 * Changes in version 1.3:
 *  - Added renew logic.
 *  - Added champions list logic.
 *
 * Changes in version 1.4:
 *  - Add total gifted to header in champion view
 *
 * Changes in version 1.5
 * - update native alert to notify alerts
 * - Update popup after user accepts gift card as gift
 *
 * Changes in version 1.6: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement suggested offers (PMP-185)
 *
 * Changes in version 1.7
 * - Fix redirect issue in modal gift accepted modal popup
 *
 * Changes in version 1.8 (Project Mom and Pop - MiscUpdate5):
 * - Add missing function documentation
 *
 * Changes in version 1.9:
 * - [PMP-251] Fix gift open process
 *
 * @version 1.9
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOffersCtrl', ['$scope', '$rootScope', '$location', 'GiftCardOfferService', 'BusinessService', "storage", "roles", "util", "GiftCardService", "notify",
        function ($scope, $rootScope, $location, GiftCardOfferService, BusinessService, storage, roles, util, GiftCardService, notify) {
            $scope.nextSteps = false;
	    /**
	     * Show the next steps.
	     */
            $scope.showNextSteps = function() {
                $scope.nextSteps = true;
            }
	    /**
	     * Close the modal and go to a specific path.
	     * @param {String} [path] the path
	     */
            $scope.goto = function(path) {
                $scope.modal = false;
                $scope.modalOpened = false;
                $location.path(path);
            };
            $scope.isFounder = util.getUserRoles(util.BUSINESS_ADMIN);
            $scope.isUser = util.getUserRoles(util.INDIVIDUAL_USER);
            $scope.isPlatformAdmin = util.getUserRoles(util.PLATFORM_EMPLOYEE);
            $scope.totalAmountPurchased = 0;

            var user = storage.getCurrentUserProfile();
            $scope.shareCategory = "purchased card";

            if ($scope.isUser) {

                if ($rootScope.tmp.giftOpened) {
                    $scope.shareText =  "Just got a Founder$hare for " + $rootScope.tmp.giftOpened.businessName +
                    ". That's pretty cool. Check out www.foundershare.com!";
                    $scope.shareCategory = "accepted gift";
                    $rootScope.tmp.giftOpened = null;
                    $scope.modalOpened = $scope.modal = true;
                }
		/**
		 * Close the modal
		 */
                $scope.closeModal = function () {
                    $scope.modalOpened = $scope.modal = false;
                };
		/**
		 * Show offer details.
		 * @param {String} [offerId] The offer id
		 */
                $scope.showInfo = function (offerId) {
                    $rootScope.$broadcast("showOfferPopup", offerId);
                };
                GiftCardService.search({pageNumber: 0}).then(function (result) {
                    var giftCards = [];
                    var allGiftCards = result.items;

                    for (var i=0; i<allGiftCards.length; i++) {
                        if (allGiftCards[i].quantity > 0) {
                            giftCards.push(allGiftCards[i]);
                        }
                    }

                    var indexed = _.groupBy(giftCards, 'businessId');
                    $scope.totalAmountPurchased = 0;
                    $scope.totalAmountRedeemed = 0;
                    $scope.totalAmountGifted = 0;
                    _.each(allGiftCards, function (card) {
                        if (card) {
                            var redeemed = _.reduce(card.giftCardRedeems, function (memo, redeem) {
                                return memo + redeem.amount;
                            }, 0);
                            $scope.totalAmountRedeemed += redeemed;
                            $scope.totalAmountPurchased += card.originalQuantity;
                            $scope.totalAmountGifted += card.originalQuantity - card.quantity - redeemed;
                        }
                    });
                    $scope.items = _.map(indexed, function (items) {
                        var item = _.pick(items[0], 'businessId', 'businessPicture');
                        item.offerId = items[0].giftCardOfferId;
                        item.sharesCount = items.length;
                        item.giftCards = items;
                        return item;
                    });
                    if (!allGiftCards.length) {
                        GiftCardOfferService.getAllGiftCardOffers({
                            pageNumber: 1,
                            pageSize: 4,
                            lat: window.USER_LOCATION.latitude,
                            long: window.USER_LOCATION.longitude,
                            sortByDiscount: 1,
                            status: "ACTIVE"
                        }).then(function (result) {
                            $scope.suggestedOffers = result.items;
                        }, function () {
                            notify({message: "Cannot suggest offers", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    }
                }, function () {
                    notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                });
                return;
            }



            if ($scope.isFounder) {

                BusinessService.getMyBusiness().then(function (business) {
                    $scope.business = business;
                }, function () {
                    notify({message: "Cannot get business", templateUrl: 'partials/module/notify-popup.html'});
                });

                var businessId = user.userRoles[0].businessId;
                $scope.emptyOffers = false;
                GiftCardOfferService.getAllGiftCardOffers({pageNumber: 0, businessId: businessId, sortOrder: "Descending"}).then(function (result) {
                    var offers = result.items;
                    $scope.offers = offers;
                    $scope.emptyOffers = !offers.length;

                    // calculate total values
                    var totalSold = 0, totalRedeemed = 0;
                    angular.forEach(offers, function (offer) {
                        totalSold += offer.totalQuantity - offer.availableQuantity;
                        totalRedeemed += offer.redeemedQuantity;
                        offer.purchased = 0;
                        offer.redeems = 0;
                    });
                    $scope.totalAmountSold = totalSold;
                    $scope.totalAmountRedeemed = totalRedeemed;
                    $scope.totalCount = offers.length;


                    GiftCardService.searchAll({pageNumber: 0}).then(function (result) {
                        angular.forEach(result.items, function (card) {
                            angular.forEach($scope.offers, function (offer) {
                                if (card.giftCardOfferId == offer.id) {
                                    offer.purchased += 1;
                                    if (card.giftCardRedeems) {
                                        offer.redeems += card.giftCardRedeems.length;
                                    }
                                }
                            });
                        });
                    }, function () {
                        notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                    });
                }, function () {
                    notify({message: "Cannot get gift cards", templateUrl: 'partials/module/notify-popup.html'});
                });
            }


            //cancel the offer
            $scope.cancel = function (offer) {
                GiftCardOfferService.cancelGiftCard(offer.id).then(function () {
                    offer.status = "CANCELLED";
                }, function () {
                    notify({message: "Cannot cancel posting", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Renew the offer.
             * @param offer the offer instance
             */
            $scope.renew = function (offer) {
                GiftCardOfferService.renewGiftCard(offer.id).then(function () {
                    offer.status = "ACTIVE";
                }, function () {
                    notify({message: "Cannot cancel posting", templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Popup champions list.
             * @param id the offer id.
             */
            $scope.seeChampions = function(id) {
                $rootScope.$broadcast("showViewChampionsPopup", id);
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Summary Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2
 * - record.metadata.giftCardId is now record.giftCardId
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardSummaryCtrl', ['$scope', "GiftCardService", "BusinessService", "$q", "notify",
        function ($scope, GiftCardService, BusinessService, $q, notify) {
            $q.all([
                GiftCardService.searchAll({pageNumber: 0}),
                BusinessService.getMyBusinessActions({pageNumber: 0})
            ]).then(function (result) {
                var giftCards = result[0].items;
                var records = result[1].items;
                $scope.giftCards = giftCards;
                _.each($scope.giftCards, function (card) {
                    card.totalRedeemed = _.reduce(card.giftCardRedeems, function (total, redeem) {
                        return total + redeem.amount;
                    }, 0);
                });
                var index = _.indexBy(giftCards, "id");
                _.each(records, function (record) {
                    var gift = index[record.giftCardId];
                    if (gift) {
                        if (!gift.history) {
                            gift.history = [];
                        }
                        gift.history.push(record);
                    }
                });
            }, function () {
                notify({message: "Cannot get data", templateUrl: 'partials/module/notify-popup.html'});
            });
            //show gift card history
            $scope.showHistory = function (giftCard) {
                $scope.isHistory = true;
                $scope.giftCard = giftCard;
            };
            //hide gift card history
            $scope.hideHistory = function () {
                $scope.isHistory = false;
                $scope.giftCard = null;
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gifting Controller
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 * - update native alert to notify alert
 *
 * Changes in version 1.2
 * - Fix [PMP-179] Check if user is logged in
 *
 * Changes in version 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-223] Add slider
 */

angular.module("app")
    .controller('giftingCtrl', ['$scope', '$rootScope', 'GiftCardService', "GiftCardOfferService", "$routeParams", "$location", "$log", "notify", 'util',
	function ($scope, $rootScope, GiftCardService, GiftCardOfferService, $routeParams, $location, $log, notify, util) {
	    /* Fix [PMP-179] Check if user is logged in. If not,
	     * redirect to login page and then back here */
	    if (!util.isLoggedIn()) {
		$rootScope.tmp = {
		    redirectUrl: '/FounderF$Gifting/'+$routeParams.id
		}
		$location.path('/Login');
		return;
	    }
	    $scope.shareText = "I just gifted a Founder$hare. What a great idea for a birthday gift! (hint hint ☺) www.foundershare.com";
            $scope.gift = {
		amount: null
	    };
            GiftCardService.get($routeParams.id).then(function (giftCard) {
                GiftCardOfferService.getGiftCardOffer(giftCard.giftCardOfferId).then(function (offer) {
                    $scope.giftCard = giftCard;
		    $scope.gift.amount = Math.ceil(giftCard.quantity / 2);
                    $scope.offer = offer;
                    if (giftCard.quantity < 1) {
                        $location.path("/Founder$hares");
                    }
                });
            }, function (reason) {
                notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                $location.path("/Founder$hares");
            });
            var twitterApi, twitterToken, twitterTokenSecret;

            //handle rate limit error
            //we can do only 15 calls per 15 minute
            function handleTwitterError(err) {
                if (err && err.status === 429) {
                    notify({message: "You made too many requests to Twitter. Please wait 15 min.", templateUrl: 'partials/module/notify-popup.html'});
                }
            }

	    //show modal with twitter friends
            $scope.showTwitterFriends = function () {
                OAuth.popup('twitter').done(function (result) {
                    twitterToken = result.oauth_token;
                    twitterTokenSecret = result.oauth_token_secret;
                    twitterApi = result;
                    result.get('/1.1/friends/list.json?count=200').done(function(data) {
                        if (data.users.length === 0) {
                            notify({message: "You have no friends on Twitter", templateUrl: 'partials/module/notify-popup.html'});
                            return;
                        }
                        $scope.twitterResponse = data;
                        $scope.twitterModal = true;
                        $scope.$apply();
                    }).fail(handleTwitterError);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            };
            //go to prev/next page in twitter modal
            $scope.showFriendPage = function (cursor) {
                twitterApi.get('/1.1/friends/list.json?cursor=' + cursor).done(function(data) {
                    $scope.twitterResponse = data;
                    $scope.$apply();
                }).fail(handleTwitterError);
            };
            //hide popup
            $scope.closeTwitterModal = function () {
                $scope.twitterModal = false;
            };
            //revert twitter selection
            $scope.deselectTwitterUser = function () {
                $scope.selectedTwitterFriend = null;
            };
            //set twitter selection
            $scope.selectTwitterFriend = function (user) {
                $scope.selectedTwitterFriend = user;
                $scope.twitterModal = false;
            };
            var submitting = false;
            $scope.target = {};
            $scope.extraMessage = {};
            //send a gift
            $scope.giftNow = function () {
                if (submitting || $scope.gifterForm.$invalid) {
                    return;
                }
		if ($scope.giftCard.quantity < Number($scope.gift.amount)) {
		    notify({message: "It looks like you're trying to gift more than you have. Your gift needs to be less than or equal to the total.", templateUrl: 'partials/module/notify-popup.html'});
		    return;
		}
		if (Math.floor($scope.gift.amount) != $scope.gift.amount) {
		    // Only full dollar amounts (no cents) are allowed
		    $scope.gift.amount = Math.floor($scope.gift.amount);
		    notify({message: "For now, gifts have to be in whole dollar amounts (no cents).", templateUrl: 'partials/module/notify-popup.html'});
		    return;
		}
                submitting = true;
                var promise;
                if ($scope.selectedTwitterFriend) {
                    promise = GiftCardService.sendGiftToTwitter($routeParams.id, {
                        "accessToken": twitterToken,
                        "accessTokenSecret": twitterTokenSecret,
                        friendId: $scope.selectedTwitterFriend.id_str,
                        quantity: Number($scope.gift.amount)
                    });
                } else {
                    var target = $scope.target.value;
                    var type = target.indexOf("@") === -1 ? "PHONE_NUMBER" : "EMAIL";
                    promise = GiftCardService.sendGift($routeParams.id, {
                        target: target,
                        quantity: Number($scope.gift.amount),
                        type: type,
                        extraMessage: $scope.extraMessage.value || undefined
                    });
                }
                promise.then(function () {
                    $scope.modalDone = true;
                }, function (res) {
                    notify({message: res.error, templateUrl: 'partials/module/notify-popup.html'});
                    submitting = false;
                });
            }
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * History controller.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2
 * - Add checkFounder()
 * - Add sorting while fetching history
 *
 * Changes in version 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-225] Update History design
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('historyCtrl', ['$scope', 'storage', 'UserService', '$log', 'util', 'BusinessService', 'notify',
        function ($scope, storage, UserService, $log, util, BusinessService, notify) {

            if ($scope.isUser) {
                UserService.getMyActions({pageNumber: 0, sortOrder: 'Descending', sortBy: 'timestamp'}).then(function (result) {
                    $scope.historyList = result.items;
                }, function () {
                    notify({message: "Cannot get history", templateUrl: 'partials/module/notify-popup.html'});
                });
            } else if ($scope.isFounder) {
                BusinessService.getMyBusinessActions({pageNumber: 0, sortOrder: 'Descending', sortBy: 'timestamp'}).then(function (result) {
                    $scope.historyList = result.items;
                }, function () {
                    notify({message: "Cannot get history", templateUrl: 'partials/module/notify-popup.html'});
                });
            }

	    // Check if logged in user is a founder
            $scope.checkFounder = function() {
                return $scope.isFounder && !$scope.isPlatformAdmin;
            }

	    // Get the icon url for a history type
	    $scope.getHistoryTypeIcon = function(type) {
		var basePath = "i/"
		switch (type) {
		case "GIFT_ACCEPTED":
		    return basePath + "gift_received.png";
		case "GIFTED":
		    return basePath + "gift_sent.png";
		case "PURCHASE":
		    return basePath + "purchase.png";
		case "REDEMPTION":
		    return basePath + "redemption.png";
		}
	    }

	    // Create a url for the target link
	    $scope.targetLink = function (target) {
	    if (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(target)) {
		return 'mailto:' + target;
	    } else if (/^@.*/.test(target)) {
		return 'https://twitter.com/' + target;
	    } else {
		return 'tel:' + target;
	    }
	}
        }
    ]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Home Controller
 * Changes in version 1.1:
 *  - Added the addToCard() method.
 *
 * Changes in version 1.2:
 *  - Added the load more item count configuration item.
 *
 * Changes in version 1.3:
 * - Move deviceDetector check to app.js
 *
 * Changes in version 1.4:
 * - Cached url for login redirect.
 *
 * Changes in version 1.5:
 * - Add new title
 *
 * Changes in version 1.6: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement location search box and business type dropdown
 *
 * Changes in version 1.7 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-229] Show alternative results if there are no search results
 * 
 * @version 1.7
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('homeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'GiftCardOfferService', '$timeout', "storage", "config",
	function ($scope, $rootScope, $routeParams, $location, GiftCardOfferService, $timeout, storage, config) {
            $scope.loadMoreItemCount = config.LOAD_MORE_ITEM_COUNT;
            $scope.extraSearchTextBoxes = true;
	    $scope.showAlternativeOffers = false;
            var search = $scope.search;
            $scope.pause = false;
            $scope.check = false;
            $scope.Home = {};
            var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
            var currentPageNum;

	    // Clear search results
	    $scope.clearSearch = function() {
		$location.hash('');
		$location.path('/');
	    };

	    //load alternative results
	    function loadAlternative() {
		GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 3,
                    businessName: undefined,
                    businessType: undefined,
                    lat: search.lat,
                    long: search.long,
		    sortByDiscount:true,
                    status: "ACTIVE"
                }).then(function (data) {
                    $scope.showAlternativeOffers = true;
		    //prevent loading more results
		    $scope.totalRecords = data.items.length;
                    $scope.giftCardOffers = data.items;
                    $scope.Home.title = "Nothing came up for that search, but here are a few local businesses that might interest you.";
                });
	    }
	    
            //load initial offers
            function init() {
		$scope.showAlternativeOffers = false;
		currentPageNum = 4;
                GiftCardOfferPromise({
                    pageNumber: 1,
                    pageSize: 12,
                    businessName: search.name || undefined,
                    businessType: search.type.id || undefined,
                    lat: search.lat,
                    long: search.long,
                    status: "ACTIVE"
                }).then(function (data) {
                    $scope.totalRecords = data.totalRecords;
		    //if we get no results, load alternative offers
		    if ($scope.totalRecords === 0) {
			return loadAlternative();
		    }
                    $scope.giftCardOffers = data.items;
                    if (window.location.hash.indexOf('search') !== -1) {
                        $scope.Home.title = 'Search Results';
                        $scope.Home.subtitle = '';
                    } else {
                        $scope.Home.title = 'Rediscover Local Business';
                        $scope.Home.subtitle = 'Join the movement. Click a tile, buy a Founder$hare gift card for yourself or a friend and help revitalize Main Street!';
                    }
                });
            }
            init();

            $scope.$on("reload-offers", function () {
                init();
            });

            // infinite scroll
            $scope.loadMore = function () {

                if ($scope.giftCardOffers && $scope.giftCardOffers.length < $scope.totalRecords && !$scope.pause) {
                    $scope.pause = true;
                    $timeout(function () {
                        GiftCardOfferPromise({
                            pageNumber: currentPageNum,
                            pageSize: $scope.loadMoreItemCount,
                            businessName: search.name || undefined,
                            businessType: search.type.id || undefined,
                            lat: search.lat,
                            long: search.long,
                            status: "ACTIVE"
                        }).then(function (data) {
                            for (var i = 0; i < data.items.length; i++) {
                                $scope.giftCardOffers.push(data.items[i]);
                            }
                        }, function (data) {
                        });

                        currentPageNum += 1;
                        $scope.pause = false;
                    }, 800);
                }
            };

            $scope.showInfo = function (offer) {
                if (!$rootScope.tmp) {
                    $rootScope.tmp = {};
                }
                $rootScope.tmp.offerId = offer.id;
                $rootScope.$broadcast("showOfferPopup", offer.id);
            };
            // Show giftCardOffer Detail if router params contains offerId
            if ($routeParams.offerId && $routeParams.offerId.length > 0) {
                $rootScope.$broadcast("showOfferPopup", $routeParams.offerId);
            }
        }
    ]);

angular.module("app")
    .controller('howItWorksCtrl', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.currentSlide = 0;

            $scope.slides = [
                {
                    slide: 'assets/i/works-slide-1.png',
                    text: 'A Business wants to grow; \nThe Business offers F$'
                },
                {
                    slide: 'assets/i/works-slide-2.png',
                    text: 'Champions, the Business\'s Loyal Customers, buy the F$ Online & the Business get money right away!'
                },
                {
                    slide: 'assets/i/works-slide-3.png',
                    text: 'Champions post an invite to their friends on social networks bringing more champions'
                },
                {
                    slide: 'assets/i/works-slide-4.png',
                    text: 'Champions can redeem their F$\'s with their smartphones at the Business'
                }
            ];

            var slidesLength = $scope.slides.length;
            $scope.prev = function () {
                $scope.currentSlide = ($scope.currentSlide + slidesLength - 1) % slidesLength;
            };
            $scope.next = function () {
                $scope.currentSlide = ($scope.currentSlide + 1) % slidesLength;
            };
            $scope.setCurrent = function (index) {
                $scope.currentSlide = index;
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Login Controller
 *
 * Changes in version 1.1
 * - Clear the gift token after login, it is handled during registration
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Prepopulate email field with saved value
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('loginCtrl', ['$scope', '$location', '$rootScope', '$log', 'SecurityService', 'UserService', 'storage', 'base64', 'util', 'notify',
        function ($scope, $location, $rootScope, $log, SecurityService, UserService, storage, base64, util, notify) {
            $scope.rememberMe = false;
            $scope.username = storage.getUserEmail() || '';
            $scope.password = '';
            $scope.loginError = false;
            $scope.closeAccountModal = function () {
                $scope.accountTypeModal = false;
            };
            $scope.closeRegistrationModal = function () {
                $scope.completeRegistrationModal = false;
            };
            $scope.chooseAccountType = function (accountType) {
                $scope.socialData.accountType = accountType;
                if ($scope.socialData.linkedSocialNetwork === "TWITTER") {
                    $scope.completeRegistrationModal = true;
                    $scope.closeAccountModal();
                } else {
                    $scope.completeRegistration();
                }
            };
            $scope.completeRegistration = function (form, email) {
                if (form && form.$invalid) {
                    return;
                }
                if (email) {
                    $scope.socialData.email = email;
                }
                UserService.register($scope.socialData).then(function (result) {
                    util.loginHandler(result.sessionToken, true);
                    $scope.closeRegistrationModal();
                }, function (reason) {
                    if (form) {
                        notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        return;
                    }
                    $scope.accountTypeModal = false;
                    $scope.loginError = true;
                    $scope.errorMsg = reason.error;
                });
            };
            var loginHandler = function (token) {
                // don't call the pending accept gift card action twice
                storage.clearGiftToken();
                util.loginHandler(token, $scope.rememberMe);
            };

            $scope.login = function () {
                if (!$scope.username || !$scope.password) {
                    $scope.loginError = true;
                } else {
                    // login via password type
                    SecurityService.authenticate($scope.username, $scope.password).then(function (data) {
                        loginHandler(data.sessionToken);
                    }, function (data) {
                        $scope.loginError = true;
                        if (data && data.error) {
                            $scope.errorMsg = data.error;
                        } else {
                            $scope.errorMsg = "Internet connection error.";
                        }
                    });
                }
            };

            var socialNetworkLoginHandler = function (socialNetwork, token) {
                SecurityService.authenticateWithSocialNetwork(socialNetwork, token).then(function (data) {
                    loginHandler(data.sessionToken);
                }, function (reason) {
                    if (reason.error === "User is not registered") {
                        $scope.accountTypeModal = true;
                        $scope.socialData = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: token
                        }
                    } else {
                        $scope.loginError = true;
                        $scope.errorMsg = reason.error;
                    }
                });
            };

            $scope.loginWithSocialNetwork = function (socialNetwork) {
                if (socialNetwork === $scope.socialNetworks.facebook) {

                    OAuth.popup('facebook').done(function (result) {
                        socialNetworkLoginHandler(socialNetwork, result.access_token);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                } else if (socialNetwork === $scope.socialNetworks.linkedin) {
                    OAuth.popup('linkedin2').done(function (result) {
                        socialNetworkLoginHandler(socialNetwork, result.access_token);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                } else if (socialNetwork === $scope.socialNetworks.twitter) {
                    OAuth.popup('twitter').done(function (result) {
                        var token = base64.encode(result.oauth_token + ':' + result.oauth_token_secret);
                        socialNetworkLoginHandler(socialNetwork, token);
                    }).fail(function (err) {
                        $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                    });
                }
            };
        }
    ]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Main Controller
 *
 * Changes in version 1.1:
 *  - Removed the addToCard() method.
 *
 * Changes in version 1.2:
 *  - Added login() method.
 *
 * Changes in version 1.3: (Project Mom and Pop - Gift Card Offers Search and View)
 * - Implement location search box and business type dropdown
 *
 * Changes in version 1.4 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-159] Add Breadcrumbs
 * - [PMP-252] Check if business payment method is verified
 *
 * @version 1.4
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("mainCtrl", ['$scope', '$rootScope', 'DataService', 'LookupService', 'BusinessService', '$location', 'util', '$log', 'crumble',
	function ($scope, $rootScope, DataService, LookupService, BusinessService, $location, util, $log, crumble) {
            $rootScope.modal = false;
            $scope.util = util;
	    $scope.crumble = crumble;
	    $scope.showBreadcrumbs = true;
            // store search data
            $rootScope.keyword = '';
            // mock up add to card
            var defaultAddress;

            $scope.socialNetworks = {
                facebook: 'FACEBOOK',
                twitter: 'TWITTER',
                linkedin: 'LINKEDIN'
            };
            $scope.facebookLoginResponse = {
                connected: 'connected',
                not_authorized: 'not_authorized',
                unknown: 'unknown'
            };
            /**
             * Check if given path is current location
             * @param path the url path
             * @returns {boolean} true if given path is active
             */
            $scope.isActivePage = function (path) {
                return $location.path() === path;
            };
            // store search data
            $scope.search = {
                lat: window.USER_LOCATION.latitude,
                long: window.USER_LOCATION.longitude,
                type: {
                    name: "Any Type"
                },
                allTypes: [{
                    name: "Any Type"
                }]
            };

            //get and add other business types in background
            LookupService.getAllBusinessTypes().then(function (types) {
                $scope.search.allTypes.push.apply($scope.search.allTypes, types);
            });

            //get address based on location
            function getLocationAddress() {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'location': {
                        lat: window.USER_LOCATION.latitude,
                        lng: window.USER_LOCATION.longitude
                    }
                }, function (results, status) {
                    if (status !== "OK") {
                        $log.error("Cannot get location");
                        $log.error(arguments);
                    } else {
                        var result = results[0];
                        if (result) {
                            var city = "";
                            var state = "";
                            _.each(result.address_components, function (item) {
                                if (item.types[0] === "locality") {
                                    city = item.long_name;
                                }
                                if (item.types[0] === "administrative_area_level_1") {
                                    state = item.short_name;
                                }
                            });
                            defaultAddress = $scope.search.address = city + ", " + state;
                            $scope.$apply();
                        }
                    }
                });
            }
            getLocationAddress();

            //if we allow location after page load, reload current results
            if (navigator.geolocation && !window.USER_LOCATION.isReal) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    window.USER_LOCATION = pos.coords;
                    window.USER_LOCATION.isReal = true;
                    getLocationAddress();
                    $scope.search.lat = window.USER_LOCATION.latitude;
                    $scope.search.long = window.USER_LOCATION.longitude;
                    $rootScope.$broadcast("reload-offers");
                    $rootScope.$apply();
                });
            }

            //initialize google location autocomplete
            var locationInterval = setInterval(function () {
                var textbox = document.getElementById("searchLocation");
                if (!textbox) {
                    return;
                }
                clearInterval(locationInterval);
                var searchBox = new google.maps.places.SearchBox(textbox);

                searchBox.addListener('places_changed', function() {
                    var place = searchBox.getPlaces()[0];
                    $scope.search.name = undefined;
                    if (place) {
                        $scope.search.lat = place.geometry.location.G;
                        $scope.search.long = place.geometry.location.K;
                        $scope.doSearch();
                        $scope.$apply();
                    } else {
                        $scope.search.lat = null;
                        $scope.search.long = null;
                    }
                });
            }, 100);

            // Business type has changed
            $scope.typeChanged = function () {
                $scope.search.name = undefined;
                $scope.doSearch();
            };

            // Redirect to search page
            $scope.doSearch = function () {
                if (!$scope.search.lat || !$scope.search.long) {
                    return;
                }
                $location.path('/Home');
                $location.hash('search');
            };
            // Reset search field when user leaves search page
            $rootScope.$on('$locationChangeStart', function (ev, newUrl, oldUrl) {
                if (oldUrl && oldUrl.match(/#search/) && !newUrl.match(/#search/)) {
                    $scope.search.type = {name: "Any Type"};
                    $scope.search.name = undefined;
                    $scope.search.lat = window.USER_LOCATION.latitude;
                    $scope.search.long = window.USER_LOCATION.longitude;
                    $scope.search.address = defaultAddress;
                }
            });
	    // Update crumble breadcrumbs
	    $rootScope.$on('$locationChangeSuccess', function(ev, newUrl) {
		crumble.update();
		// Don't show breadcrumbs on home page
		$scope.showBreadcrumbs = (newUrl !== '#/' && newUrl !== '#/Home');
	    });

            //logout
            $scope.logout = util.logout;

            //go to my profile
            $scope.goUser = function () {
                $location.url($rootScope.getHome());
            };

            /**
             * Login.
             */
            $scope.login = function () {
                if ($rootScope.tmp) {
                    delete $rootScope.tmp;
                }
                $location.url('/Login');
            };

            $scope.searchCards = function () {
                // redirect to home page home page will perform search based on the keyword in rootscope
                $location.path('/');
            };

            $scope.getGauge = function (item, color, radius) {
                var percent = item ? (item.availableQuantity / item.totalQuantity) : 1;

                if (percent >= 1) {
                    percent = 0.99;
                }
                radius = radius || 32;

                return {
                    r: radius,
                    r2: radius * 2,
                    ri: radius - 3,
                    x: radius + (radius - 3) * Math.sin(2 * Math.PI * percent),
                    y: radius - (radius - 3) * Math.cos(2 * Math.PI * percent),
                    largeFlag: percent >= 0.5 ? 1 : 0,
                    nonce: Math.random().toString(),
                    color: color || '#257149'
                };
            };

            // disable scroll of body when login box show
            function disableScroll() {
                angular.element('body').addClass('hide-body');
            }

            // ebable scroll of body when login box show
            function enableScroll() {
                angular.element('body').removeClass('hide-body');
            }

            var StaticURLsPromise = DataService.query('StaticPageUrl');
            StaticURLsPromise.then(function (data) {
                $scope.staticUrls = data.urls;
            }, function (data) {
            });

            $rootScope.isFounder = util.getUserRoles(util.BUSINESS_ADMIN);
            $rootScope.isUser = util.getUserRoles(util.INDIVIDUAL_USER);
            $rootScope.isPlatformAdmin = util.getUserRoles(util.PLATFORM_EMPLOYEE);

	    //if user is a founder, check if the business is setup
	    if ($rootScope.isFounder) {
		BusinessService.getMyBusiness().then(function (business) {
		    $rootScope.isVerificationFeePaid = business.isVerificationFeePaid;
		});
	    }

            $rootScope.header = {};
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//FounderF$Posting Controller
angular.module("app")
    .controller("founderF$PostingCtrl", function ($scope, DataService, $rootScope) {
        $rootScope.modal = false;
        //Get History
        //$rootScope.role = 'Founder';
        var promise = DataService.query("post");
        promise.then(function (data) {
            $scope.post = data.post;
            //Set Dropdown
            $scope.myOptions = [
                {
                    name: 'Adventure',
                    value: 'Adventure'
                },
                {
                    name: 'Food & Drink',
                    value: 'Food & Drink'
                },
                {
                    name: 'Flying',
                    value: 'Flying'
                }
            ];
            $scope.business_type = {
                name: $scope.post[0].businessType,
                value: $scope.post[0].businessType
            }
            //Save
            $scope.save = function () {
                if ($scope.form.$valid) {
                    $scope.saveModal = $scope.modal = true;
                }
            }
            //Done
            $scope.done = function () {
                $scope.saveModal = $scope.modal = false;
            }
            //Post
            $scope.postNow = function () {
                if ($scope.form.$valid) {
                    $scope.postModal = $scope.modal = true;
                }
            }
            //Close Modal
            $scope.closeModal = function () {
                $scope.postModal = $scope.saveModal = $scope.modal = false;
            }
        }, function (data) {
        });
    });
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//postCards Controller
angular.module("app")
    .controller("postCardsCtrl", function ($scope, DataService, $rootScope) {
        $rootScope.modal = false;
        //Get History
        //$rootScope.role = 'Founder';
        var promise = DataService.query("postCard");
        promise.then(function (data) {
            $scope.post = data.post;
            //Set Dropdown
            $scope.myOptions = [
                {
                    name: 'Adventure',
                    value: 'Adventure'
                },
                {
                    name: 'Food & Drink',
                    value: 'Food & Drink'
                },
                {
                    name: 'Flying',
                    value: 'Flying'
                }
            ];
            $scope.business_type = {
                name: $scope.post[0].businessType,
                value: $scope.post[0].businessType
            }
            //Save
            $scope.save = function () {
                if ($scope.form.$valid) {
                    $scope.saveModal = $scope.modal = true;
                }
            }
            //Done
            $scope.done = function () {
                $scope.saveModal = $scope.modal = false;
            }
            //Post
            $scope.postNow = function () {
                if ($scope.form.$valid) {
                    $scope.postModal = $scope.modal = true;
                }
            }
            //Close Modal
            $scope.closeModal = function () {
                $scope.postModal = $scope.saveModal = $scope.modal = false;
            }
        }, function (data) {
        });
    });
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Verify Account Controller
angular.module("app")
    .controller("verifyAccountCtrl", function ($scope, $rootScope) {
        $rootScope.modal = false;
    });
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Open gift Controller
 *
 * Changes in version 1.1
 * - Add local caching of gift card accept token
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2:
 * - [PMP-251] Fix gift open process
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('openGiftCtrl', ['$scope', '$rootScope', 'GiftCardService', "$routeParams", "$location", "util", "$log", "storage", "notify",
	function ($scope, $rootScope, GiftCardService, $routeParams, $location, util, $log, storage, notify) {
            if (!util.isLoggedIn()) {
                $scope.modalLoginRequired = true;
                $scope.modal = true;
                $scope.tmp.redirectUrl = $location.url();
                storage.storeGiftToken($routeParams.code);
                return;
            }
            if (!$scope.isUser) {
                $scope.modalError = true;
                $scope.modal = true;
                $scope.errorText = "Only champions are allowed to accept the gifts";
            } else {

                var handleResult = function (promise) {
                    promise.then(function (gift) {
                        $rootScope.tmp.giftOpened = gift;
                        $location.path('/Founder$hares');
                    }, function (res) {
                        $scope.loginTwitter = false;
                        $scope.modalError = true;
                        $scope.modal = true;
                        $scope.errorText = res.error;
                    });
                }

                if ($routeParams.type === "twitter") {
                    $scope.loginTwitter = true;
                    $scope.modal = true;
                    $scope.loginWithTwitter = function () {
                        OAuth.popup('twitter').done(function (result) {
                            handleResult(GiftCardService.acceptGiftFromTwitter($routeParams.code, {
                                accessToken: result.oauth_token,
                                accessTokenSecret: result.oauth_token_secret
                            }))
                        }).fail(function (err) {
                            $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                            notify({message: "Cannot authenticate you", templateUrl: 'partials/module/notify-popup.html'});
                        });
                    };
                } else {
                    handleResult(GiftCardService.acceptGift($routeParams.code))
                }
            }
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Payment controller.
 *
 * Changes in version 1.1:
 *  - Refractor the payment logic.
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("paymentCtrl", ['$scope', '$timeout', '$routeParams', 'GiftCardOfferService', 'storage', '$rootScope', 'BusinessService', '$log', '$location', 'notify',
        function ($scope, $timeout, $routeParams, GiftCardOfferService, storage, $rootScope, BusinessService, $log, $location, notify) {

            var purpose = $routeParams.purpose;
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };
            GiftCardOfferService.getBraintreeToken().then(function (data) {
                braintree.setup(data.token, 'dropin', {
                    container: 'dropin-container',
                    paymentMethodNonceReceived: function (event, nonce) {
                        var profile = storage.getCurrentUserProfile();
                        profile.nonce = nonce;
                        storage.storeCurrentUserProfile(profile, false);

                        if (purpose == 'business') {
                            //some bug here, won't redirect without timeout
                            $timeout(function () {
                                $location.path('/PaymentVerification/business');
                            }, 10);
                        }
                    }
                });
            }, function (reason) {
                notify({message: 'Failed to get braintree token: ' + reason.error, templateUrl: 'partials/module/notify-popup.html'});
            });
        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Payment verification controller.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("paymentVerificationCtrl", ['$scope', '$location', '$routeParams', 'GiftCardOfferService', 'storage', '$rootScope', 'BusinessService', 'notify',
        function ($scope, $location, $routeParams, GiftCardOfferService, storage, $rootScope, BusinessService, notify) {
            var purpose = $routeParams.purpose;
            $scope.modal = false;
            $scope.submitted = false;
            $scope.submitFlag = false;

            var profile = storage.getCurrentUserProfile();
            $scope.individualEmail = profile.email;
            if (!profile.nonce) {
                $location.path('/Payment/business');
                return;
            }
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.modal = false;
            };

            /**
             * Submit the payment verification form.
             */
            $scope.submit = function () {
                $scope.submitted = false;
                if ($scope.submitFlag) {
                    return;
                }

                if ($scope.form.$invalid) {
                    $scope.submitted = true;
                    return;
                }

                var merchantAccountParams = {};
                merchantAccountParams.individual = {};
                merchantAccountParams.individual.address = {};
                merchantAccountParams.business = {};
                merchantAccountParams.funding = {};

                merchantAccountParams.individual.firstName = $scope.firstName;
                merchantAccountParams.individual.lastName = $scope.lastName;
                merchantAccountParams.individual.email = $scope.individualEmail;
                merchantAccountParams.individual.ssn = $scope.ssn;
                merchantAccountParams.individual.dateOfBirth = $scope.dateOfBirth;
                merchantAccountParams.individual.address.streetAddress = $scope.streetAddress;
                merchantAccountParams.individual.address.locality = $scope.locality;
                merchantAccountParams.individual.address.region = $scope.region;
                merchantAccountParams.individual.address.postalCode = $scope.postalCode;

                merchantAccountParams.business.legalName = $scope.legalName;
                merchantAccountParams.business.taxId = $scope.taxId;

                merchantAccountParams.funding.destination = 'bank';
                merchantAccountParams.funding.email = $scope.email;
                merchantAccountParams.funding.mobilePhone = $scope.mobilePhone;
                merchantAccountParams.funding.accountNumber = $scope.accountNumber;
                merchantAccountParams.funding.routingNumber = $scope.routingNumber;

                $scope.submitFlag = true;
                if (purpose == 'business') {
                    var businessId = 0;
                    for (var i = 0; i < profile.userRoles.length; i++) {
                        if (profile.userRoles[i].role === 'BUSINESS_ADMIN') {
                            businessId = profile.userRoles[i].businessId;
                        }
                    }

                    BusinessService.payForVerification(merchantAccountParams, {
                            paymentMethodNonce: profile.nonce,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName
                        }
                    ).then(function () {
                            $scope.modal = true;
                        }, function (reason) {
                            $scope.submitFlag = false;
                            notify({message: 'Failed to verify: ' + reason.error, templateUrl: 'partials/module/notify-popup.html'});
                        });
                }
            };


            if (purpose === 'business') {
                $scope.verificationName = storage.getCurrentUserProfile().firstName + ' '
                + storage.getCurrentUserProfile().lastName + ' just joined FounderShare! Have you heard of it? ';
            }


        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Profile controller.
 *
 * Changes in version 1.1:
 *  - Refractor the user role related code.
 *
 * Changes in version 1.2:
 *  - Updated the password validation logic.
 *
 * Changes in version 1.3
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.4
 * - Provision to edit last name, password for newly added platform admin
 *
 * Changes in version 1.5 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-210] Fix change password
 *
 * Changes in version 1.6 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 * - [PMP-217] Disable save button while submitting
 * - Check for image file size
 *
 * @version 1.6
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("profileCtrl", ['$scope', "$rootScope", 'SecurityService', '$location', 'storage', 'BusinessService', 'LookupService', 'UserService', '$log', 'config', 'util', 'notify',
        function ($scope, $rootScope, SecurityService, $location, storage, BusinessService, LookupService, UserService, $log, config, util, notify) {

	    $scope.password = {
		switchPassword: false,
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	    };
            $scope.user = storage.getCurrentUserProfile();
            $scope.Edit = false;
            $scope.submitted = false;
	    $scope.submitting = false;


            /**
             * Cancel password edit.
             */
            $scope.cancelPassword = function () {
		$scope.password.newPassword = '';
                $scope.password.confirmPassword = '';
                $scope.password.switchPassword = false;
                $scope.submitted = false;
		$scope.submitting = false;
            };

            /**
             * Save the password.
             */
            $scope.savePassword = function () {
                $scope.submitted = false;
                if ($scope.password.currentPassword === '' ||
		    $scope.password.newPassword === '' ||
		    $scope.password.confirmPassword === '') {
                    $scope.submitted = true;
                    return;
                }
                if ($scope.password.newPassword !== $scope.password.confirmPassword) {
                    $scope.submitted = true;
                    return;
                }

                if (SecurityService.checkPasswordLength($scope.password.newPassword)) {
                    notify({message: 'The password must have 8 chars at least.', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                if (!(SecurityService.checkPasswordContent($scope.password.newPassword))) {
                    notify({message: 'The password must contain both numbers and chars.', templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                SecurityService.authenticate($scope.user.email, $scope.password.currentPassword).then(function (data) {

                    storage.storeSessionToken(data.sessionToken, false);

                    SecurityService.resetPassword($scope.password.newPassword).then(function (data) {
                        $scope.password.switchPassword = false;
                        $scope.password.currentPassword = '';
                        $scope.password.newPassword = $scope.password.confirmPassword = "";
                    }, function (reason) {
                        notify({message: "Failed to reset password.", templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }, function (reason) {
                    notify({message: "The password is incorrect.", templateUrl: 'partials/module/notify-popup.html'});
                    $log.log(reason);
                });

            };

            $scope.$parent.isFounder = util.getUserRoles(util.BUSINESS_ADMIN);

            if ($scope.isFounder) {

                LookupService.getAllBusinessTypes().then(function (result) {
                    $scope.allBusinessTypes = result;
                    $scope.allBusinessTypesIndex = _.indexBy(result, 'id');

                    BusinessService.getMyBusiness().then(function (result) {
                        result.type = $scope.allBusinessTypesIndex[result.type];
                        $scope.readInfo = result;
                        if (!$scope.readInfo.type) {
                            $scope.readInfo.type = {};
                        }
                        $scope.editInfo = angular.copy(result);
                    })
                });
            }


            UserService.getMyUserProfile().then(function (data) {
                $scope.profileInfo = data;
                $scope.profileEditInfo = {};
                if (!$scope.profileInfo.location) {
                    $scope.profileInfo.location = '';
                }
                angular.copy($scope.profileInfo, $scope.profileEditInfo);

            }, function (reason) {
                $log.log(reason);
                notify({message: reason, templateUrl: 'partials/module/notify-popup.html'});
            });

            $scope.isInValidString = function (value) {
                if (!value || value.trim() === '') {
                    return true;
                }
                return false;
            };

            $scope.infoEdit = false;
            /**
             * Show the update user info fields.
             */
            $scope.showEditInfo = function () {
                $scope.infoEdit = !$scope.infoEdit;
            };
            /**
             * Save the info.
             * @param flows the upload file
             * @param form the html form
             */
            $scope.saveInfo = function (flows, form) {
		if ($scope.submitting) {
		    return;
		}
                $scope.submitted = false;
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
		$scope.submitting = true;
                if (flows && flows.length > 0) {
                    var image = flows[0].file;
		    if (image.size > config.MAX_IMAGE_SIZE) {
			// Check if the image size is greater than max size
			notify({message: 'The image must be less than 800Kb', templateUrl: 'partials/module/notify-popup.html'});
			$scope.submitting = false;
			return;
		    }
                }
                UserService.updateMyUserProfile($scope.profileEditInfo, image).then(function (data) {
		    $scope.submitting = false;
                    angular.copy(data, $scope.profileInfo);
                    angular.copy(data, $rootScope.loggedUser);
                    $scope.infoEdit = false;
                    storage.storeCurrentUserProfile(data, true);
                }, function (reason) {
		    $scope.submitting = false;
                    $log.log(reason);
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };

            /**
             * Cancel the info edit.
             */
            $scope.cancelInfo = function () {
                $scope.submitted = false;
                $scope.infoEdit = false;
                angular.copy($scope.profileInfo, $scope.profileEditInfo);
            };

            $scope.edit = false;
            /**
             * Save business info.
             * @param flows the upload file
             * @param form the html form
             */
            $scope.saveBusiness = function (flows, form) {
		if ($scope.submitting) {
		    return;
		}
                $scope.submitted = false;
                if (form.$invalid || !$scope.editInfo.type.id) {
                    $scope.submitted = true;
                    return;
                }
		var image;
                if (flows && flows.length > 0) {
                    image = flows[0].file;
                } else if (!$scope.readInfo.picture) {
                    $scope.submitted = true;
                    return;
                }
		$scope.submitBusiness(image);
            };


            /**
             * Save business profile
             * @param image the business logo
             */
            $scope.submitBusiness = function (image) {
                var tmp = {};
                angular.copy($scope.editInfo, tmp);
                tmp.type = $scope.editInfo.type.id + '';
		$scope.submitting = true;
		UserService.updateMyUserProfile({
		    subscribedToNews: $scope.profileEditInfo.subscribedToNews
		}).then(function (data) {
		    BusinessService.updateMyBusinessProfile(tmp, image).then(function (data) {
			$scope.submitting = false;
			angular.copy($scope.editInfo, $scope.readInfo);
			$scope.edit = false;
			$rootScope.loggedUser.business = data;
			storage.storeCurrentUserProfile($rootScope.loggedUser, true);
                    }, function (reason) {
			$scope.submitting = false;
			notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
			$log.log(reason);
                    });
		});
            };

            /**
             * Edit business fields.
             */
            $scope.editBusiness = function () {
                $scope.edit = !$scope.edit;
            };

            /**
             * Cancel the business edit.
             */
            $scope.cancelBusiness = function () {
                angular.copy($scope.readInfo, $scope.editInfo);
                $scope.edit = false;
            };

            $scope.showContactInformation = function() {
                return $scope.isPlatformAdmin && !$scope.user.lastName;
            };

            $scope.savePlatformAdminInfo = function(platformAdminInfo) {
                UserService.updatePlatformAdmin(platformAdminInfo).then(function() {
                    notify({message: 'Updated successfully! Kindly login again.', templateUrl: 'partials/module/notify-popup.html'});
                    storage.clear();
                    $location.path('/Login');
                }, function(reason) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                });
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Register Controller
 *
 * Changes in version 1.1:
 *  - Updated the password validation logic.
 *
 * Changes in version 1.2:
 * - Open terms and conditions in popup window
 *
 * Changes in version 1.3
 * - Remove confirm password
 * - Accept any pending gift cards
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.4
 * - Redirect user to /Home after successful signup
 *
 * Changes in version 1.5 (Project Mom and Pop - MiscUpdate5):
 * - Show error message when registration fails
 *
 * Changes in version 1.6 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 *
 * Changes in version 1.7:
 * - [PMP-251] Fix gift open process
 * - Check image file size
 *
 * @version 1.7
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("registerCtrl", ['$scope', '$rootScope', '$log', '$location', 'LookupService', 'UserService', 'base64', 'util', '$window', 'SecurityService', 'config', '$http', 'GiftCardService', 'storage', 'notify',
    function ($scope, $rootScope, $log, $location, LookupService, UserService, base64, util, $window, SecurityService, config, $http, GiftCardService, storage, notify) {
        var acceptPendingGift = function(sessionToken) {
            var code = storage.getGiftToken();
            if(code) {
                $log.info('Accepting pending gift cards for newly registered user');
                GiftCardService.acceptGift(code, sessionToken).then(function() {
                    $log.info("pending gift card auto accepted successfully");
                    storage.clearGiftToken();
                })
            }
        };

        if($rootScope.tmp) {
            delete $rootScope.tmp.redirectUrl;
        }
        $rootScope.modal = true;
	$scope.subscribedToNews = true;
        $scope.accept = false;
        $scope.userImage = undefined;
        $scope.businessImage = undefined;
        $scope.showError = false;
        $scope.errorMessage = '';
        //Set Dropdown
        $scope.accountTypes = [
            {
                name: 'CHAMPION',
                value: 'Champion (Consumer)'
            },
            {
                name: 'FOUNDER',
                value: 'Business Owner'
            }
        ];
        $scope.accountType = {
            name: $scope.accountTypes[0].name,
            value: $scope.accountTypes[0].value
        };
        $scope.businessTypes = [];
        LookupService.getAllBusinessTypes().then(function (data) {
            $scope.businessTypes = data;
            $scope.businessType = {
                name: $scope.businessTypes.length > 0 ? $scope.businessTypes[0].name : '',
                id: $scope.businessTypes.length > 0 ? $scope.businessTypes[0].id : ''
            };
        }, function (reason) {
            $log.error('Error fetching business types. HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
        });

        $scope.setFile = function (flowFile) {
            if ($scope.accountType.name === 'FOUNDER') {
                $scope.businessImage = flowFile.file;
            } else {
                $scope.userImage = flowFile.file;
            }
        };

        $scope.closeRegistrationModal = function () {
            $scope.completeRegistrationModal = false;
        };
        $scope.completeRegistration = function (form, email) {
            if (form && form.$invalid) {
                return;
            }
            if (email) {
                $scope.registration.email = email;
            }

	    if ($scope.userImage && $scope.userImage.size > config.MAX_IMAGE_SIZE) {
		notify({message: 'The image must be less than 800Kb', templateUrl: 'partials/module/notify-popup.html'});
		return;
	    }

	    if ($scope.businessImage && $scope.businessImage.size > config.MAX_IMAGE_SIZE) {
		notify({message: 'The image must be less than 800Kb', templateUrl: 'partials/module/notify-popup.html'});
		return;
	    }
	    
            UserService.register($scope.registration, $scope.userImage, $scope.businessImage).then(function (result) {
		$scope.modal = true;
                $scope.closeRegistrationModal();
                $scope.sessionToken = result.sessionToken;
            }, function (reason) {
                if (form) {
                    notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
                    return;
                }
                $scope.accountTypeModal = false;
                $scope.loginError = true;
                $scope.errorMsg = reason.error;
                $window.scrollTo(0, 200);
            });
        };

        var registerHelper = function (registration) {
            $scope.registration = registration;
            if (registration.linkedSocialNetwork === "TWITTER") {
                $scope.completeRegistrationModal = true;
                $scope.$apply();
            } else {
                $scope.completeRegistration($scope.form);
            }
        };

        $scope.register = function (user) {
            $scope.showError = false;
            if ($scope.accept) {
                $scope.submitted = true;
            }
            if (SecurityService.checkPasswordLength(user.password)) {
                $scope.showError = true;
                $scope.errorMessage = 'The password must have more than ' + config.PASSWORD_LENGTH + ' chars.';
                $window.scrollTo(0, 200);
                return;
            }
            if (!(SecurityService.checkPasswordContent(user.password))) {
                $scope.showError = true;
                $scope.errorMessage = 'The password must contain both numbers and chars.';
                $window.scrollTo(0, 200);
                return;
            }
            if ($scope.form.$valid && $scope.accept) {
                var registration;
                if ($scope.accountType.name === 'CHAMPION') {
                    registration = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.password,
                        accountType: $scope.accountType.name,
                        email: user.email,
			subscribedToNews: $scope.subscribedToNews
                    };
                } else if ($scope.accountType.name === 'FOUNDER') {
                    registration = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.password,
                        accountType: $scope.accountType.name,
                        email: user.email,
			subscribedToNews: $scope.subscribedToNews,
                        business: {
                            name: user.businessName,
                            type: Number($scope.businessType.id)
                        }
                    };
                }
                registerHelper(registration);
            }
        };
        $scope.registerWithSocialNetwork = function (socialNetwork) {
            if (socialNetwork === $scope.socialNetworks.facebook) {
                $scope.socialNetworkRegistration = true;
                OAuth.popup('facebook').done(function (result) {
                    var registration = {
                        linkedSocialNetwork: socialNetwork,
                        linkedSocialNetworkAccessToken: result.access_token,
                        accountType: $scope.accountType.name
                    };
                    registerHelper(registration);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            } else if (socialNetwork === $scope.socialNetworks.linkedin) {
                $scope.socialNetworkRegistration = true;
                OAuth.popup('linkedin2').done(function (result) {
                    var registration = {
                        linkedSocialNetwork: socialNetwork,
                        linkedSocialNetworkAccessToken: result.access_token,
                        accountType: $scope.accountType.name
                    };
                    registerHelper(registration);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            } else if (socialNetwork === $scope.socialNetworks.twitter) {
                OAuth.popup('twitter').done(function (result) {
                    var token = base64.encode(result.oauth_token + ':' + result.oauth_token_secret);
                    var registration = {
                        linkedSocialNetwork: socialNetwork,
                        linkedSocialNetworkAccessToken: token,
                        accountType: $scope.accountType.name
                    };
                    registerHelper(registration);
                }).fail(function (err) {
                    $log.error('Error opening oauth.io popup ' + angular.toJson(err));
                });
            }
        };
        $scope.closeModal = function () {
            $scope.modal = false;
            if($scope.sessionToken && $scope.socialNetworkRegistration) {
                util.loginHandler($scope.sessionToken);
            } else {
                $location.path('#/');
            }
        };

        $scope.modal = false;
        //serialize current input and open terms and conditions page
        $scope.openTerms = function (user) {
            var wnd = window.open("", "Terms & Conditions", "width=960, height=500");
            $http.get(config.TERMS_AND_CONDITIONS_URL).then(function (response) {
                wnd.document.write(response.data);
                $(wnd.document).find('head').prepend($('<link href="'+ window.location.origin +'/css/screen.css" rel="stylesheet" type="text/css">'));
            });
        }
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Report abuse controller.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("reportAbuseCtrl",
		['$scope', '$rootScope', '$routeParams', '$location', 'NotificationService', 'storage', '$log', 'notify', 'util',
		 function ($scope, $rootScope, $routeParams, $location, NotificationService, storage, $log, notify, util) {
	    /**
	     * If not logged in, go to login page and
	     * redirect to report abuse page after
	     * successful login.
	     */
	    if(!util.isLoggedIn()) {
		$rootScope.tmp = {};
		$rootScope.tmp.redirectUrl = $location.url();
		$location.path('/Login');
	    }

	    $scope.issue = '';
            $scope.describe = '';

            /**
             * Send the abuse email.
             */
            $scope.send = function () {
                $scope.submitted = false;
                if ($scope.issue.trim().length === 0 || $scope.describe.trim().length === 0) {
                    $scope.submitted = true;
                } else {
                    var reportedAbuse = {};
                    reportedAbuse.issue = $scope.issue;
                    reportedAbuse.description = $scope.describe;
                    if ($routeParams.giftCardOfferId) {
                        reportedAbuse.giftCardOfferId = $routeParams.giftCardOfferId;
                    }

                    NotificationService.reportAbuse(reportedAbuse).then(function (data) {
                        $scope.issue = '';
                        $scope.describe = '';
                        $scope.reportModal = $rootScope.modal = true;
                    }, function (reason) {
                        notify({message: 'Fail to send abuse report, please refer to log for detail.', templateUrl: 'partials/module/notify-popup.html'});
                        $log.log(reason);
                    });
                }
            };

            /**
             * Close modal.
             */
            $scope.done = function () {
                $scope.submitted = $scope.reportModal = $rootScope.modal = false;
		$location.path('/Home');
            };
            /**
             * Close modal.
             */
            $scope.closeModal = function () {
                $scope.submitted = $scope.reportModal = $rootScope.modal = false;
            };
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Reset Password Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("resetPasswordCtrl", ['$scope', '$location', 'SecurityService', 'util', 'config', '$rootScope', 'notify', function ($scope, $location, SecurityService, util, config, $rootScope, notify) {
        // get reset password token from query string
        var params = $location.search();
        var resetPasswordToken = params.token;
        $scope.submit = function () {
            if ($scope.form.$valid) {
                $scope.submitted = false;
            } else {
                $scope.submitted = true;
                return;
            }
            if (SecurityService.checkPasswordLength($scope.confirm_password)) {
                notify({message: 'The password must have more than ' + config.PASSWORD_LENGTH + ' chars.', templateUrl: 'partials/module/notify-popup.html'});
                return;
            }
            if (!(SecurityService.checkPasswordContent($scope.confirm_password))) {
                notify({message: 'The password must contain both numbers and chars.', templateUrl: 'partials/module/notify-popup.html'});
                return;
            }

            // call backend API to reset the password
            SecurityService.resetForgottenPassword(resetPasswordToken, $scope.confirm_password).then(function (ret) {
                $rootScope.tmp = undefined;
                util.loginHandler(ret.sessionToken);
            }, function (reason) {
                notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
            });
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Shopping cart controller.
 *
 * Changes in version 1.1:
 *  - Allow only 2000 maximum quantity
 *
 * Changes in version 1.2
 * - Update popup after purchase of gift card offer
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.3:
 * - [PMP-178] Temporarily disable Shopping Cart and replace with Buy Now
 *
 * Changes in version 1.4
 * - Fix redirect issue in after purchase popup
 *
 * Changes in version 1.5 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-198] Update payment error message
 * - Add missing function documentation
 *
 * Changes in version 1.6 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - unLoginModal should not show on success
 *
 * @version 1.6
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("shoppingCartCtrl", ['$scope', '$q', 'storage', '$rootScope', '$location', 'GiftCardOfferService', 'config', 'notify', 'util',
	function ($scope, $q, storage, $rootScope, $location, GiftCardOfferService, config, notify, util) {

	    /* BEGIN TEMPORARY: [PMP-178]
	     * Check for a hash value #pay in the url to bypass the cart
	     * Expect a search of ?id=cardId&value=value
	     */
	    if ($location.hash() == 'pay') {
		if (!util.getUserRoles(util.INDIVIDUAL_USER)) {
		    /* Only logged in users can buy a gift card */
		    $location.hash('');
		    $location.path('/Home');
		    return;
		}
		/**
		 * Close the modal and go to a specific path.
		 * @param {String} [path] The path
		 */
		$scope.goto = function(path) {
		    $scope.modal = false;
		    $scope.modalOpened = false;
		    $location.path(path);
		};
		var offerId = $location.search().id;
		var value = $location.search().value;
		GiftCardOfferService.getGiftCardOffer(offerId).then(function(offer) {
		    offer.value = value;
		    if (offer.status !== "ACTIVE") {
			/* If offer is inactive, notify the user and
			 * redirect to home page */
			notify({message: "The offer is inactive.", templateUrl: 'partials/module/notify-popup.html'});
			$location.path('/Home');
		    }
		    $scope.offers = [offer];
		    $scope.showNextSteps = function() {
			$scope.nextSteps = true;
		    }
		    $scope.pay();
		    if (offer.invalid) {
			/* The offer was marked as invalid by the pay
			 * process (maxAmount). The user was already
			 * notified. Redirect to home page. */
			$location.path('/Home');
		    }
		});
	    } else {
		/* END TEMPORARY: [PMP-178] */

		$scope.nextSteps = false;
		$scope.view = 'cart';
		var promises = _.map(storage.getItemFromCart(), function (offerId) {
		    return GiftCardOfferService.getGiftCardOffer(offerId);
		});

		$q.all(promises).then(function (offers) {
		    $scope.offers = _.filter(offers, function (offer) {
			if (offer.status !== "ACTIVE") {
			    storage.removeItemFromCart(offer.id);
			    return false;
			}
			offer.value = 0;
			return true;
		    })
		});
	    }

	    $scope.showNextSteps = function() {
		$scope.nextSteps = true;
	    };

	    var tokenPromise = GiftCardOfferService.getBraintreeToken().then(function (data) {
		return data.token;
	    }, function () {
		notify({message: "Cannot get braintree token.", templateUrl: 'partials/module/notify-popup.html'});
	    });

	    /**
	     * Go to the payment page.
	     */
	    $scope.pay = function () {
		var maxAmount = false;
		if (!$scope.offers.length || _.any($scope.offers, function (offer) {
		    if (!offer.value) {
			offer.invalid = true;
			return true;
		    }
		    if (offer.value > 2000) {
			offer.invalid = true;
			maxAmount = true;
			return true;
		    }
		    return false;
		})) {
		    if (maxAmount) {
			notify({message: "Maximum allowed amount is $2000", templateUrl: 'partials/module/notify-popup.html'});
		    }
		    return;
		}

		$scope.totalPrice = 0;
		_.each($scope.offers, function(offer) {
		    var price = (Number(offer.value) * (100-Number(offer.discount))/100);
		    $scope.totalPrice += price;
		});
		$scope.view = 'payment';

		tokenPromise.then(function (data) {
		    braintree.setup(data, 'dropin', {
			container: 'dropin-container',
			paymentMethodNonceReceived: function (event, nonce) {
			    if (config.FAKE_NONCE) {
				nonce = 'fake-valid-nonce'; //FAKE NONCE for testing
			    }
			    GiftCardOfferService.purchase(_.map($scope.offers, function (offer) {
				return {
				    "paymentMethodNonce": nonce,
				    "giftCardOfferId": offer.id,
				    "quantity": Number(offer.value)
				}
			    })).then(function () {
				$scope.verificationName = 'It is a great local biz - they are doing something cool. Take a look ';
				$rootScope.modal = true;
				_.each($scope.offers, function (offer) {
				    storage.removeItemFromCart(offer.id);
				})
				    }, function (reason) {
					notify({message: 'Oops! Your payment didn\'t go through. You can give it another try, or let support know that you had a problem with payment.', templateUrl: 'partials/module/notify-popup.html'});
				    });
			}
		    });
		});
	    };

	    /**
	     * Get total amount of all items in cart
	     * @returns {Number} the total amount
	     */
	    $scope.getTotal = function () {
		return _.reduce($scope.offers, function (memo, offer) {
		    if (!offer.value) {
			return memo;
		    }
		    var price = offer.value * (100 - offer.discount) / 100;
		    price = Math.round(price * 100) / 100;
		    return memo + price;
		}, 0);
	    };

	    /**
	     * Close the modal.
	     */
	    $scope.cancel = function () {
		$rootScope.modal = false;
	    };
	    /**
	     * Delete the item.
	     * @param offer the offer
	     */
	    $scope.delete = function (offer) {
		storage.removeItemFromCart(offer.id);
		$scope.offers = _.without($scope.offers, offer);
	    };
	    /**
	     * Close the modal.
	     */
	    $scope.closeModal = function () {
		$rootScope.modal = false;
		$location.path('/Founder$hares');
	    };
	}]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for show business history popup.
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("showBusinessHistoryPopupCtrl", ['$scope', '$rootScope', '$location', 'BusinessService', "NotificationService", "GiftCardOfferService", 'storage', '$log', 'util', 'config', 'notify',
        function ($scope, $rootScope, $location, BusinessService, NotificationService, GiftCardOfferService, storage, $log, util, config, notify) {

            $scope.historyList = [];
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            /**
             * Show popup.
             */
            $scope.showPopup = function () {
                $scope.display = true;
                $rootScope.details = true;
            };

            /**
             * Hide popup.
             */
            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            $scope.$on("showBusinessHistoryPopup", function (e, businessId) {
                BusinessService.getAllBusinessActions({pageNumber: 0, businessId: businessId}).then(function (result) {
                    $scope.historyList = result.items;
                    $scope.showPopup();
                }, function () {
                    notify({message: 'Cannot get history', templateUrl: 'partials/module/notify-popup.html'});
                });

            });
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Static pages controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('staticPagesCtrl', ['$scope', '$location', '$sce', 'StaticPageService', 'notify', function ($scope, $location, $sce, StaticPageService, notify) {
	$scope.page = {
	    name: '',
	    content: ''
	};

	loadPage();

	/**
	 * Load the page content.
	 */
	function loadPage() {
	    var path = $location.path();
	    var name;
	    switch(path) {
	    case '/Faq':
		name = 'faq';
		break;
	    case '/PrivacyPolicy':
		name = 'privacy';
		break;
	    case '/TermsAndConditions':
		name = 'terms';
		break;
	    case '/Copyright':
		name = 'copyright';
		break;
	    default:
		notify({message: "The page you requested does not exist.", templateUrl: 'partials/module/notify-popup.html'});
		$location.path('/home');
		return;
	    }
	    StaticPageService.getPageByName(name).then(function(page) {
		$scope.page = page;
		$scope.page.content = $sce.trustAsHtml(page.content);
	    }, function(reason) {
		notify({message: "The page could not be loaded: "+reason.error, templateUrl: 'partials/module/notify-popup.html'});
	    });
	}
	
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Verify email Controller
 *
 * Changes in version 1.1
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.2:
 * - [PMP-251] Fix gift open process
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("verifyEmailCtrl", ['$scope', '$routeParams', 'UserService', 'util', '$rootScope', 'notify', 'storage', '$log', 'GiftCardService', '$location', '$analytics', function ($scope, $routeParams, UserService, util, $rootScope, notify, storage, $log, GiftCardService, $location, $analytics) {

        UserService.verifyEmail($routeParams.userId, $routeParams.token).then(function (result) {
            $rootScope.tmp = undefined;
            util.loginHandler(result.sessionToken, true, function () {
                $analytics.eventTrack($rootScope.isFounder ? "Owner" : "Champion", {  category: 'Complete registration' });
                var code = storage.getGiftToken();
                if (code) {
                    $log.info('Accepting pending gift cards for newly registered user');
                    GiftCardService.acceptGift(code, result.sessionToken).then(function (gift) {
                        if (!$rootScope.tmp) {
                            $rootScope.tmp = {};
                        }
                        $rootScope.tmp.giftOpened = gift;
                        $location.path('/Founder$hares');
                    })
                } else {
		    $location.path('/Founder$hares');
		}
            });
        }, function (reason) {
            $rootScope.tmp = {
                redirectUrl: '/'
            };
            notify({message: reason.error, templateUrl: 'partials/module/notify-popup.html'});
            return;
        });

    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for view champions popup.
 *
 * Changes in 1.1:
 *  - Display completely new table with champions
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("viewChampionsPopupCtrl", ['$scope', '$rootScope', 'GiftCardService', 'notify',
        function ($scope, $rootScope, GiftCardService, notify) {
            // close view details
            $scope.closeInfo = function () {
                $scope.hidePopup();
            };

            /**
             * Show popup.
             */
            $scope.showPopup = function () {
                $scope.display = true;
                $rootScope.details = true;
            };

            /**
             * Hide popup.
             */
            $scope.hidePopup = function () {
                $scope.display = false;
                $rootScope.details = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            $scope.champions = [];

            /**
             * Get champions.
             * @param id the gift card id.
             */
            $scope.getChampions = function (id) {
                GiftCardService.searchChampions(id, {pageNumber: 0}).then(function (result) {

                    var champions = {};
                    var total = $scope.total = {
                        purchased: 0,
                        gifted: 0,
                        redeemed: 0,
                        remaining: 0,
                        received: 0
                    };
                    _.each(result, function (item) {
                        if (!champions[item.ownerId]) {
                            champions[item.ownerId] = {
                                name: item.firstName + " " + item.lastName,
                                purchased: 0,
                                gifted: 0,
                                redeemed: 0,
                                remaining: 0,
                                received: 0,
                                accountType: item.linkedSocialNetwork || "e-mail"
                            }
                        }
                        var stats = champions[item.ownerId];
                        var redeemed = _.reduce(item.giftCardRedeems, function (memo, redeem) {
                            return memo + redeem.amount;
                        }, 0);
                        if (!item.isGift) {
                            stats.purchased += item.originalQuantity;
                        } else {
                            stats.received += item.originalQuantity;
                        }
                        stats.redeemed += redeemed;
                        stats.gifted += item.originalQuantity - item.quantity - redeemed;
                        stats.remaining += item.quantity;

                        total.purchased += stats.purchased;
                        total.gifted += stats.gifted;
                        total.redeemed += stats.redeemed;
                        total.remaining += stats.remaining;
                        total.received += stats.received;
                    });
                    $scope.champions = _.values(champions);

                    $scope.showPopup();
                }, function () {
                    notify({message: 'Cannot get champions list', templateUrl: 'partials/module/notify-popup.html'});
                });

            };

            $scope.$on("showViewChampionsPopup", function (e, id) {
                $scope.getChampions(id);
            });
        }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application directives.
 *
 * @version 1.3
 * @author TCSASSEMBLER
 *
 * Changes in 1.1:
 * 1. add ngcEmailOrPhone
 *
 * Changes in version 1.2
 * 1. Restrict max number to two decimal places only
 *
 * Changes in version 1.3 (Project Mom and Pop - Release Fall 2015 Assembly):
 * 1. Add slider directive
 */
'use strict';

var app = angular.module("app");

//Only Number
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

//Only Dollar
app.directive('dollarOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9.$+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(Number(transformedInput));
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);


//Max Number
app.directive('maxNumber', function ($filter) {
    return {
        require: 'ngModel',
        scope: {
            max: '=maxNumber',
            min: '=minNumber',
            model: '=ngModel'
        },
        link: function (scope, element, attrs, modelCtrl) {
            element.on('keydown', function () {
                setTimeout(function () {
                    scope.$apply(function () {
                        if (scope.model > scope.max) {
                            scope.model = $filter('number')(scope.max, 2);
                        }
                        if (scope.min && scope.model < scope.min) {
                            scope.model = scope.min;
                        }
                        scope.model = Number($filter('number')(scope.model, 2));
                    });
                }, 0);
            });
        }
    };
});


// set percent progress bar for gift card
app.directive('progress', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var val = attrs['progress'].split(',');
            var progress = isNaN(Number(val[0])) ? 0 : Number(val[0]);
            var aProgress = isNaN(Number(val[1])) ? 0 : Number(val[1]);
            var percent = (progress / aProgress) * 100;
            var rotageElement1 = element.find('.circle .mask.full');
            var rotageElement2 = element.find('.circle .fill');
            rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
        }
    }
});

// set position for modal
app.directive('initModal', function ($window) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var w = angular.element($window);
            var mt = (w.height() - element.height()) / 2;
            element.css({'margin-top': mt})
        }
    }
});

// trigger submit on given form if element is clicked
app.directive('ngcSubmitForm', function ($window) {
    return {
        restrict: 'EA',
        scope: {
            form: "=ngcSubmitForm",
            onlyMark: "=onlyMark"
        },
        link: function (scope, element, attrs) {
            $(element).click(function () {
                $(scope.form).submit(function () {
                    return false;
                });
                setTimeout(function () {
                    var $form = $(scope.form);
                    $form.addClass("ngc-submitted");
                    if (!scope.onlyMark) {
                        $form.trigger("submit");
                    }
                });
            })
        }
    }
});

//validator for date in format e.g. 01/01/2015
app.directive('ngcDate', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.date = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "M/D/YYYY", true);
                return date.isValid();
            };
        }
    };
});

//validator for time in format e.g. 10:00 PM
app.directive('ngcTime', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.time = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "h:mm A");
                if (date.isValid()) {
                    //check if date ends with AM or PM
                    //moment allows A or P
                    viewValue = viewValue.trim();
                    return /AM$/i.test(viewValue) || /PM$/i.test(viewValue);
                }
                return false;
            };
        }
    };
});

//include html from wordpress url
app.directive('ngcWpInclude', ["$http", function ($http) {
    return {
        scope: {
            url: "=ngcWpInclude"
        },
        link: function (scope, element) {
            $http.get(scope.url).then(function (response) {
                var iframe = document.createElement('iframe');
                $(element).append(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(response.data);
                iframe.contentWindow.document.close();
                var $frame = $(element).find('iframe');
                $frame.attr('frameborder', '0');
                $frame.attr('scrolling', 'no');
                $frame.css('width', '960px');
                $frame.css('height', '1000px');
                $frame.on('load', function(){
                    $frame.contents().find('head').prepend($('<link href="'+ window.location.origin +'/css/screen.css" rel="stylesheet" type="text/css">'));
                    $frame.show();
                    $frame.css('height', $frame.contents().outerHeight());
                });
            });
        }
    };
}]);


//validator for email address or phone
app.directive('ngcEmailOrPhone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.emailOrPhone = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                function validateEmail(email) {
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(email);
                }
                //if contains any letter or @ character, assume this is an email
                if (/[a-zA-Z@]/.test(viewValue) && !validateEmail(viewValue)) {
                    return false;
                }
                return true;
            };
        }
    };
});

// Slider directive
app.directive('slider', function () {
    return {
        require: 'ngModel',
        scope: {
	    max: '=max',
	    min: '=min',
	    model: '=ngModel'
        },
        link: function(scope, element, attrs, modelCtrl) {
	    //construct nonlinear slider ranges
	    var min = parseFloat(scope.min),
		max = Math.floor(parseFloat(scope.max));
	    var range = {};
	    if (max > 1 && min < 1) {
                range.min = [min, 1];
	    } else if (min < 10) {
		range.min = [min, 1];
	    } else if (min < 100) {
		range.min = [min, 5];
	    } else {
		range.min = [min, 10];
	    }
	    if (max > 10 && min < 10) {
		range['10%'] = [10, 1];
	    }
	    if (max > 100 && min < 100) {
                range['50%'] = [100, 5];
	    }
	    if (max > 500 && min < 500) {
                range['80%'] = [500, 10];
	    }
	    range.max = [max];
	    //Create Slider
	    noUiSlider.create(element[0], {
                start: scope.model,
                range: range,
                connect: "lower"
	    });
	    
	    //Setup binding to ngModel
	    modelCtrl.$render = function() {
                var val = parseFloat(modelCtrl.$viewValue);
                var oldVal = parseFloat(element[0].noUiSlider.get());
                if (oldVal !== val) {
                    element[0].noUiSlider.set(val);
                }
	    };
	    element[0].noUiSlider.on('slide', function() {
                setTimeout(function () {
		    scope.$apply(function () {
                        var val = parseFloat(element[0].noUiSlider.get());
                        scope.model = val;
		    });
                });
	    });
        }
    };
});

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application filters.
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 * - Add format to timeRemaining
 *
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - Add multiline filter
 */
'use strict';

var app = angular.module("app");

//Force Number
app.filter('num', function () {
    return function (input) {
        return Number(input.replace('$', ''));
    }
});

//Force Percent
app.filter('percentage', function () {
    return function (input) {
        if (input < 0 || input > 100 || isNaN(input) || input === '') {
            return '0';
        } else {
            return input;
        }
    }
});

//Validate Date
app.filter('endDate', function () {
    return function (input) {
        if (Date.parse(input)) {
            return input;
        } else {
            return "No expiration date";
        }
    }
});

//format remaining time in format XX days YYh
app.filter('timeRemaining', function () {
    return function (input, format) {
        if (!input) {
            return "-";
        }
        var diff = new Date(input).getTime() - new Date().getTime();
        if (diff <= 0) {
            return "Expired"
        }
        var totalMinutes = diff / 1000 / 60;
        if (totalMinutes < 60) {
            if (totalMinutes < 1) {
                return "< 1 min";
            }
            return Math.floor(totalMinutes) + " min";
        }
        var totalHours = totalMinutes / 60;
        var days = Math.floor(totalHours / 24);
        var hours = Math.floor(totalHours % 24);
        var ret = "";
        if (days) {
            if(days <= 1) {
                return "today"
            } else if(days > 1 && days <= 2) {
                return "tomorrow";
            } else if(format === 'short') {
                return "in " + days + " days";
            }
            ret = days + " day";
            if (days > 1) {
                ret += "s";
            }
            ret += " ";
        }
        if (hours) {
            ret += hours + "h";
        }
        return ret;
    }
});

// Transforms a string and replaces LF (\n) characters with <br/>
app.filter('multiline', ['$sce', function ($sce) {
    return function(input) {
	if (input) {
	    return $sce.trustAsHtml(input.replace('\n', '<br/>\n'));
	} else {
	    return input;
	}
    };
}]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service encapsulates the btoa() and atob() javascript functions for binary to base64 encode/decode
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';


angular.module("app")
    .factory('base64', [function () {
        var service = {};
        /**
         * Encode a binary string data into base64 string
         */
        service.encode = function (data) {
            return btoa(data);
        };
        /**
         * Decodes a base64 string data into binary string data.
         */
        service.decode = function (data) {
            return atob(data);
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The service helper
 *
 * Changes in 1.1:
 *  - Handle expired session token
 *
 * Changes in version 1.2
 * - Replace native javascript alert with notify
 *
 * @version 1.2
 * @author TCSASSEMBLER
 */
'use strict';


angular.module("app")
    .factory('common', ['$http', '$q', '$log', 'storage', 'config', '$injector', 'notify', function ($http, $q, $log, storage, config, $injector, notify) {
        var alertTimeout;
        return {
            /**
             * Make an http request and add access token
             * @param {Object} options the options for $http call
             * @returns {Promise} promise
             */
            makeRequest: function (options) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                if (!options.headers) {
                    options.headers = {};
                }
                if (accessToken && !options.headers.Authorization) {
                    options.headers.Authorization = 'Bearer ' + accessToken;
                }
                if (options.url.indexOf("http") !== 0) {
                    options.url = config.REST_SERVICE_BASE_URL + options.url;
                }
                $http(options)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(status, config.method, config.url, data);
                        if (data && (data.error === 'Session Token not found' || data.error === 'Session Token Expired')) {
                            $injector.get('util').logout();
                            //it won't alert multiple times if there were parallel requests
                            if (alertTimeout) {
                                return;
                            }
                            setTimeout(function () {
                                alertTimeout = false;
                            }, 5000);
                            alertTimeout = true;
                            setTimeout(function () {
                                notify({message: "Your session has expired. Please log in.", templateUrl: 'partials/module/notify-popup.html'});
                            }, 100);
                            return;
                        }
                        deferred.reject(data || {"error": "Unknown error"});
                    });
                return deferred.promise;
            }
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * Changes in version 1.1:
 *  - Added shopping cart related functions.
 *
 * Changes in version 1.2
 * - Add session storage for pending gift card accept task
 *
 * Changes in version 1.3 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-195] Add functions to store the user's email address
 *
 * @version 1.3
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('storage', [function () {
        var service = {};
        /**
         * Returns the stored sessionToken
         * This method first checks in sessionStorage if sessionToken is not found in sessionStorage
         * this method checks in localStorage, if sessionToken still not found in localStorage, then it will return null or undefined
         * The controllers has to implement the logic that if sessionToken is null/undefined then user is not authorized
         */
        service.getSessionToken = function () {
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
        service.storeSessionToken = function (sessionToken, flag) {
            sessionStorage.setItem('momandpop.auth.token', sessionToken);
            if (flag) {
                localStorage.setItem('momandpop.auth.token', sessionToken);
            }
        };

        /**
         * Get current user profile stored in sessionStorage or localStorage
         */
        service.getCurrentUserProfile = function () {
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
        service.storeCurrentUserProfile = function (profile, flag) {
            profile = angular.toJson(profile);
            sessionStorage.setItem('momandpop.auth.profile', profile);
	    if (flag) {
		// Store the email separately to be able to populate the
		// login form. PMP-195
		service.storeUserEmail(JSON.parse(profile).email);
	        localStorage.setItem('momandpop.auth.profile', profile);
            }
        };

        /**
         * Added shopping item to cart.
         * @param offerId the gift card offer Id.
         */
        service.addItemToCart = function (offerId) {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }

            if (!_.contains(storedItem, offerId)) {
                storedItem.push(offerId);
            }

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
        };

        /**
         * Clear all items from cart
         */
        service.clearCart = function () {
            sessionStorage.removeItem('momandpop.cart.item');
        };

        /**
         * Get shopping items from cart
         * @returns {*} the shopping item
         */
        service.getItemFromCart = function () {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }

            return storedItem;
        };

        /**
         * Removed shopping item from cart.
         * @param id the item id.
         */
        service.removeItemFromCart = function (id) {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }
            storedItem = _.without(storedItem, id);

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
        };

        /**
         * store the pending gift card accept token
         * @param {String}  token       token to store
         */
        service.storeGiftToken = function(token) {
            localStorage.setItem('momandpop.gift.token', token);
        };

        /**
         * Return the pending gift card accept token
         */
        service.getGiftToken = function(token) {
            return localStorage.getItem('momandpop.gift.token');
        };

        /**
         * Clear the stored gift token
         */
        service.clearGiftToken = function() {
            localStorage.removeItem('momandpop.gift.token');
        };

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');
            sessionStorage.removeItem('momandpop.cart.item');

	    localStorage.removeItem('momandpop.gift.token');
	    localStorage.removeItem('momandpop.auth.token');
            localStorage.removeItem('momandpop.auth.actions');
            localStorage.removeItem('momandpop.auth.profile');
        };

	/**
	 * Store the users email address into local storage. This is
	 * used to prepopulate the login form. PMP-195
	 * @param {String} [email] The email address
	 */
	service.storeUserEmail = function(email) {
	    localStorage.setItem('momandpop.auth.email', email);
	};

	/**
	 * Return the stored email address last used to login. PMP-195
	 */
	service.getUserEmail = function() {
	    return localStorage.getItem('momandpop.auth.email');
	};

        return service;
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application utility service
 *
 * Changes in version 1.1:
 *  - Added getUserRoles() method.
 *
 * Changes in version 1.2:
 *  - Add support for redirect after login
 *
 * Changes in version 1.3:
 *  - Updated loginHandler and logout method to handle login page redirect.
 *
 * Changes in version 1.4:
 *  - Add pendingComment login to loginHandler
 *
 * Changes in version 1.5
 * - Replace native javascript alert with notify
 *
 * Changes in version 1.6:
 * - [PMP-251] Add callback parameter to loginHandler
 * - [PMP-252] Check if business payment method is verified
 *
 * @version 1.6
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('util', ['$log', '$rootScope', 'SecurityService', 'UserService', 'GiftCardOfferService', 'BusinessService', 'storage', '$location', 'notify', function ($log, $rootScope, SecurityService, UserService, GiftCardOfferService, BusinessService, storage, $location, notify) {
        var service = {};

        /**
         * This function is called in interval to refresh the session token
         */
        service.refreshToken = function () {
            $log.info('Refreshing sessionToken');
            var token = storage.getSessionToken(true);
            if (token) {
                SecurityService.refreshToken(token).then(function (loginResult) {
                    storage.storeSessionToken(loginResult.sessionToken, true);
                    // get user profile
                    UserService.getMyUserProfile().then(function (user) {
                        storage.storeCurrentUserProfile(user, true);
                    }, function (userReason) {
                        $log.error('Error fetching current user profile ' + userReason);
                    });
                }, function (reason) {
                    // some error occurred
                    $log.error('Session Token Refresh Error ' + reason);
                });
            }
        };

        /**
         * Function to check if any user is currently logged in
         */
        service.isLoggedIn = function () {
            var profile = storage.getCurrentUserProfile();
            var sessionToken = storage.getSessionToken();
            return !!(profile && sessionToken);

        };

        service.getCartItemNumber = function () {
            var items = storage.getItemFromCart();
            if (items) {
                return items.length;
            }
            return 0;
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
        service.getUserRoles = function (key) {
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
         * Login user by token
         * @param token the access token
         * @param rememberMe the flag if remember login
	 * @param Function() callback If set, the callback is called
	 *   instead of redirecting the user after handling login
         */
        service.loginHandler = function (token, rememberMe, callback) {
            storage.storeSessionToken(token, rememberMe);
            UserService.getMyUserProfile().then(function (data) {
                $rootScope.loggedUser = data;
                storage.storeCurrentUserProfile(data, rememberMe);
                $rootScope.isFounder = service.getUserRoles(service.BUSINESS_ADMIN);
                $rootScope.isUser = service.getUserRoles(service.INDIVIDUAL_USER);
                $rootScope.isPlatformAdmin = service.getUserRoles(service.PLATFORM_EMPLOYEE);
		//if user is a founder, check if the business is setup
		if ($rootScope.isFounder) {
		    BusinessService.getMyBusiness().then(function (business) {
			$rootScope.isVerificationFeePaid = business.isVerificationFeePaid;
		    });
		}
                if ($rootScope.tmp && $rootScope.tmp.pendingComment) {
                    var offerId = $rootScope.tmp.pendingComment.giftCardOfferId;
                    var comment = $rootScope.tmp.pendingComment.comment;
                    delete $rootScope.tmp.pendingComment;
                    GiftCardOfferService.createGiftCardOfferComment(offerId, comment).then(function () {
                        $location.url('/?offerId=' + offerId);
                    }, function () {
                        $location.url('/?offerId=' + offerId);
                        notify({message: 'Cannot create comment', templateUrl: 'partials/module/notify-popup.html'});
                    });
                    return;
                }
                if (service.getUserRoles(service.BUSINESS_EMPLOYEE)) {
                    notify({message: 'Business employee are not allowed to log in.', templateUrl: 'partials/module/notify-popup.html'});
                    storage.clear();
                    return;
                }
                if ($rootScope.tmp && $rootScope.tmp.redirectUrl) {
		    $location.url($rootScope.tmp.redirectUrl);
                    $rootScope.tmp.redirectUrl = null;
                    return;
                }
		if (callback) {
		    return callback();
		}
                if (service.getUserRoles(service.PLATFORM_EMPLOYEE)) {
                    $location.path('/FounderStatus');
                } else {
                    $location.path('/Founder$hares');
                }
            }, function (profileReason) {
                $log.error('Error fetching user profile HTTP STATUS CODE [ ' + profileReason.status + ' ] Error [ ' + angular.toJson(profileReason.data) + ' ]');
            });
        };

        /**
         * Logout user and clear the data
         */
        service.logout = function () {
            if ($rootScope.tmp) {
                delete $rootScope.tmp;
            }
            storage.clear();
            $rootScope.loggedUser = null;
            $rootScope.isFounder = false;
            $rootScope.isUser = false;
            $rootScope.isPlatformAdmin = false;
	    $rootScope.isVerificationFeePaid = false;
            $location.path('/Login');
        };

        return service;
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business service.
 *
 * Changes in version 1.1:
 *  - Added updateMyBusinessProfile() method.
 *
 * Changes in version 1.2:
 *  - Updated verification logic.
 *
 * Changes in version 1.3:
 *  - Added getAllBusinessActions method.
 * @version 1.3
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('BusinessService', ['config', '$http', '$q', 'common', function (config, $http, $q, common) {
        var service = {};

        service.getBusiness = function (id) {
            var req = {
                method: 'GET',
                url: '/businesses/' + id
            };
            return common.makeRequest(req);
        };
        
        service.search = function (filter) {
            var req = {
                method: 'GET',
                url: '/businesses',
                params: filter
            };
            return common.makeRequest(req);
        };

        service.getMyBusiness = function () {
            var req = {
                method: 'GET',
                url: '/businesses/me'
            };
            return common.makeRequest(req);
        };

        service.getMyBusinessActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/businesses/me/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Get all business actions.
         * @param criteria the search condition
         * @returns {Promise} the promise result.
         */
        service.getAllBusinessActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/businesses/all/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        service.payForVerification = function (merchantAccountParams, paymentInfo) {
            var req = {
                method: 'POST',
                url: '/businesses/me/verify',
                data: {
                    merchantAccountParams: merchantAccountParams,
                    paymentInfo: paymentInfo
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Verify business by platform role.
         * @param businessId the business id.
         */
        service.verifyByPlatformAdmin = function (businessId) {
            var req = {
                method: 'POST',
                url: '/businesses/' + businessId + '/platform/verify'
            };
            return common.makeRequest(req);
        };

        service.getBusinessEmployees = function () {
            var req = {
                method: 'GET',
                url: '/businesses/me/employees'
            };
            return common.makeRequest(req);
        };

        service.addBusinessEmployees = function (employee) {
            var req = {
                method: 'POST',
                url: '/businesses/me/employees',
                data: employee
            };
            return common.makeRequest(req);
        };

        service.deleteBusinessEmployee = function (id) {
            var req = {
                method: 'DELETE',
                url: '/businesses/me/employees/' + id
            };
            return common.makeRequest(req);
        };

        service.updateBusinessEmployee = function (id, employee) {
            var req = {
                method: 'PUT',
                url: '/businesses/me/employees/' + id,
                data: employee
            };
            return common.makeRequest(req);
        };

        /**
         * Update my business profile.
         * @param business the business entity
         */
        service.updateMyBusinessProfile = function (business, image) {
            var values = _.pick(business, 'name', 'type', "streetAddress", "city", "state", "country", "zip", 'telephoneNumber', 'businessHours', 'description', 'website');
            var data = new FormData();
            if (image) {
                data.append('image', image);
            }
            _.each(values, function (value, name) {
                data.append(name, value);
            });
            var req = {
                method: 'PUT',
                url: '/businesses/me',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        service.createMyBusinessProfile = function (business) {
            var req = {
                method: 'POST',
                url: '/businesses/me',
                data: business
            };
            return common.makeRequest(req);
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Data service for unimplemented pages.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//factory for Data
angular.module("app")
    .factory('DataService', ['$http', '$q', function ($http, $q) {
        return {
            query: function (fileName) {
                var deferred = $q.defer();
                $http({method: 'GET', url: 'data/' + fileName + '.json'}).
                    success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offer Service.
 *
 * Changes in version 1.1:
 *  - Added purchase() method.
 *
 * Changes in version 1.2:
 *  - Added getBraintreeToken() method.
 *
 * Changes in version 1.3:
 *  - Combine all query parameters to filter in getAllGiftCardOffers
 *
 * Changes in version 1.4:
 *  - Added removeGiftCardOfferComment / removeGiftCardOffer / renewGiftCard method.
 * @version 1.4
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('GiftCardOfferService', ['common', function (common) {
        return {
            /**
             * Search for gift card offers
             * @param filter the filter
             */
            getAllGiftCardOffers: function (filter) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers',
                    params: filter
                });
            },
            /**
             * Get a gift card offer
             * @param offerId the gift card offer id
             */
            getGiftCardOffer: function (offerId) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/' + offerId
                });
            },

            /**
             * Get comments of a gift card offer
             * @param giftCardOfferId the gift card offer id
             */
            getGiftCardOfferComments: function (giftCardOfferId) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/' + giftCardOfferId + '/comments'
                });
            },

            /**
             * Create a comment for a gift card
             * @param giftCardOfferId the gift card offer id
             * @param comment the comment text
             */
            createGiftCardOfferComment: function (giftCardOfferId, comment) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + giftCardOfferId + '/comments',
                    data: {
                        "comment": comment,
                        "giftCardOfferId": giftCardOfferId
                    }
                });
            },

            /**
             * Remove gift card offer comment.
             * @param commentId the comment id.
             * @param businessId the business id
             * @returns {Promise} the promise result
             */
            removeGiftCardOfferComment: function (commentId, businessId) {
                return common.makeRequest({
                    method: 'DELETE',
                    url: '/giftCardOffers/comments/' + commentId + '/' + businessId
                });
            },

            /**
             * Remove gift card offer.
             * @param id the offer id.
             * @returns {Promise} the promise result.
             */
            removeGiftCardOffer: function (id) {
                return common.makeRequest({
                    method: 'DELETE',
                    url: '/giftCardOffers/' + id
                });
            },

            /**
             * Create a gift card
             * @param giftCardOffer the gift card
             * @returns {promise} the promise
             */
            createGiftCard: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers',
                    data: giftCardOffer
                });
            },
            /**
             * Update a gift card
             * @param giftCardOffer the gift card
             */
            updateGiftCard: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'PUT',
                    url: '/giftCardOffers/' + giftCardOffer.id,
                    data: giftCardOffer
                });
            },

            /**
             * Purchase.
             *
             * @param giftCardOffer the gift card offer entity.
             */
            purchase: function (giftCardOffer) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCards',
                    data: giftCardOffer
                });
            },
            /**
             * Get braintree token.
             */
            getBraintreeToken: function () {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCards/braintree/token'
                });
            },
            /**
             * Cancel a gift card
             * @param id the gift card id
             */
            cancelGiftCard: function (id) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + id + "/cancel"
                });
            },
            /**
             * Renew gift card.
             * @param id the gift card id
             * @returns {Promise} the promise result.
             */
            renewGiftCard: function (id) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/giftCardOffers/' + id + "/renew"
                });
            },
            /**
             * Add the view count.
             * @param id the gift card offer id
             * @returns {Promise} the promise result.
             */
            increaseViewCount: function (id) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/view/' + id
                });
            },
            /**
             * Add the shared count.
             * @param id the gift card offer id
             * @returns {Promise} the promise result.
             */
            increaseSharedCount: function (id) {
                return common.makeRequest({
                    method: 'GET',
                    url: '/giftCardOffers/share/' + id
                });
            }
        };
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Service.
 *
 * @version 1.4
 * @author TCSASSEMBLER
 *
 * Changes in 1.1:
 * 1. add actions for gifting
 *
 * Changes in 1.2:
 *  - Added searchAll / searchChampions method.
 *
 * Changes in 1.3:
 *  - Remove businessId param from searchAll
 *
 * Changes in version 1.4
 * - accessToken can be passed to acceptGift
 */

angular.module("app")
    .factory('GiftCardService', ['common', function (common) {
        var service = {};
        /**
         * Search gift cards
         * @param {Object} criteria the query string criteria
         */
        service.search = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/giftCards?',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Search all gift cards.
         *
         * @param criteria the search condition
         * @returns {Promise} the promise result
         */
        service.searchAll = function (criteria) {
            var req = {
                method: 'GET',
                url: '/gifts',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Search gift card champion list.
         * @param id the gift card offer id.
         * @param criteria the search condition.
         * @returns {Promise} the promise result.
         */
        service.searchChampions = function (id, criteria) {
            var req = {
                method: 'GET',
                url: '/gifts/champions/' + id,
                params: criteria
            };
            return common.makeRequest(req);
        };
        /**
         * Get gift card by id
         * @param id the id
         */
        service.get = function (id) {
            var req = {
                method: 'GET',
                url: '/users/me/giftCards/' + id
            };
            return common.makeRequest(req);
        };
        /**
         * Send gift
         * @param id the id
         * @param data the data
         * @since 1.1
         */
        service.sendGift = function (id, data) {
            var req = {
                method: 'POST',
                url: '/giftCards/' + id + "/send",
                data: data
            };
            return common.makeRequest(req);
        };
        /**
         * Send gift to twitter
         * @param id the id
         * @param data the data
         * @since 1.1
         */
        service.sendGiftToTwitter = function (id, data) {
            var req = {
                method: 'POST',
                url: '/giftCards/' + id + "/send/twitter",
                data: data
            };
            return common.makeRequest(req);
        };
        /**
         * Accept gift
         * @param code the gift code
         * @since 1.1
         */
        service.acceptGift = function (code, accessToken) {
            var req = {
                method: 'POST',
                url: '/gift/' + code
            };
            if(accessToken) {
                req.headers = {};
                req.headers.Authorization = 'Bearer ' + accessToken;
            }
            return common.makeRequest(req);
        };
        /**
         * Accept gift from twitter
         * @param code the gift code
         * @param data the data
         * @since 1.1
         */
        service.acceptGiftFromTwitter = function (code, data) {
            var req = {
                method: 'POST',
                url: '/gift/' + code + "/twitter",
                data: data
            };
            return common.makeRequest(req);
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Lookup Service.
 *
 * Changes in version 1.1 (Project Mom and Pop - MiscUpdate5):
 * - [PMP-206] Add #getPlatformGiftCardOfferConditions
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('LookupService', ['config', '$http', '$q', function (config, $http, $q) {
        var service = {};

        /**
         * Get all business types
         */
        service.getAllBusinessTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businessTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all feedback types
         */
        service.getAllFeedbackTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/feedbackTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all action types
         */
        service.getAllActionTypes = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/actionTypes'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all offer categories
         */
        service.getAllOfferCategories = function () {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/offerCategories'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

	/**
	 * Get default platform conditions for gift card offers
	 */
	service.getPlatformGiftCardOfferConditions = function() {
	    var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/platformConditions'
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
	};

        return service;
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification Service.
 *
 * Changes in version 1.1:
 *  - Added sendFeedback() and reportAbuse() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('NotificationService', ['config', '$rootScope', 'common', function (config, $rootScope, common) {
        return {
            /**
             * Send an invitation email to a friend
             * @param friendInvitation the friend invitation
             */
            invitations: function (friendInvitation) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/invitations/',
                    data: {
                        "friendEmail": friendInvitation.friendEmail,
                        "offerId": friendInvitation.offerId,
                        "offerTitle": friendInvitation.offerTitle
                    }
                });
            },

            /**
             * Send feed back email.
             * @param feedback the feedback entity
             */
            sendFeedback: function (feedback) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/feedbacks',
                    data: feedback
                });
            },
            /**
             * Report abused email.
             * @param report the report entity
             */
            reportAbuse: function (report) {
                return common.makeRequest({
                    method: 'POST',
                    url: '/reportAbuse',
                    data: report
                });
            }
        };
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Security Service.
 *
 * Changes in version 1.1:
 *  - Updated the resetPassword() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('SecurityService', ['storage', 'common', 'config', function (storage, common, config) {
        var service = {};
        /**
         * Authenticate the user using password type.
         */
        service.authenticate = function (email, password) {
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
         * Authenticate the user based on the given social network and accessToken for that socialNetwork
         */
        service.authenticateWithSocialNetwork = function (socialNetwork, accessToken) {
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
         */
        service.refreshToken = function (sessionToken) {
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
         */
        service.recoverPassword = function (email) {
            var req = {
                method: 'POST',
                url: '/forgotPassword?email=' + email
            };
            return common.makeRequest(req);
        };

        /**
         * Reset forgotten password. Reset password token is mandatory
         */
        service.resetForgottenPassword = function (token, password) {
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
        service.revokeSessionToken = function () {
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
        service.resetPassword = function (password) {
            var req = {
                method: 'POST',
                url: '/resetPassword',
                data: {
                    newPassword: password
                }
            };
            return common.makeRequest(req);
        };
        service.checkPasswordLength = function (password) {
            return (password.length <= config.PASSWORD_LENGTH);
        };

        service.checkPasswordContent = function (password) {
            return (/\d/.test(password) && /[A-Za-z]/.test(password));
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Static Page Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('StaticPageService', ['common', function (common) {

	var service = {};

	/**
	 * Get all static pages.
	 */
	service.getAllPages = function() {
	    var req = {
                method: 'GET',
                url: '/staticPages'
            };
            return common.makeRequest(req);
	};

	/**
	 * Get a page by its name.
	 * @param {String} name the page name
	 */
	service.getPageByName = function(name) {
	    var req = {
                method: 'GET',
                url: '/staticPages/' + name
            };
            return common.makeRequest(req);
	};

	/**
	 * Save a page. The admin must give his password to approve.
	 * @param {StaticPage} page the page
	 * @param {String} password the admin password
	 */
	service.savePage = function(page, password) {
	    var req = {
		method: 'PUT',
		url: '/staticPages/' + page.name,
		data: {
		    page: page,
		    password: password
		}
	    };
	    return common.makeRequest(req);
	};

	return service;
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * User Service.
 *
 * Changes in version 1.1:
 *  - Added getActionRecords() method and fixed some other issues.
 *
 * Changes in version 1.2:
 *  - Added verifyEmail method.
 *
 * Changes in version 1.3
 * - Add deletPlatformAdmin
 * - Add addPlatformAdmin
 * - Add getAllPlatformAdmins
 * - Add verifyPlatformAdmin
 *
 * Changes in version 1.4
 * - Add updatePlatformAdmin
 *
 * Changes in version 1.5 (Project Mom and Pop - Release Fall 2015 Assembly):
 * - [PMP-220] Add subscribedToNews field
 *
 * @version 1.5
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('UserService', ['common', function (common) {
        var service = {};

        /**
         * Register the user on mom and pop platform
         * registration is registration entity object which would be converted to json string
         * userProfile and businessProfile are optional
         */
        service.register = function (registration, userImage, businessImage) {
            var data = new FormData();
            data.append('registration', angular.toJson(registration));
            if (userImage) {
                data.append('profileImage', userImage);
            }
            if (businessImage) {
                data.append('businessImage', businessImage);
            }
            // prepare request object
            var req = {
                method: 'POST',
                url: '/register',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Verify email.
         * @param userId the user id
         * @param token the token
         * @returns {Promise} the promise result
         */
        service.verifyEmail = function (userId, token) {
            var data = new FormData();
            var requestData = {userId: userId, token: token};
            data.append('requestData', angular.toJson(requestData));

            // prepare request object
            var req = {
                method: 'POST',
                url: '/verifyEmail',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Get my user profile
         */
        service.getMyUserProfile = function () {
            var req = {
                method: 'GET',
                url: '/users/me'
            };
            return common.makeRequest(req);
        };

        /**
         * Get my action records
         */
        service.getMyActions = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/actions',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Get action records entity.
         * @param criteria the search condition
         */
        service.getActionRecords = function (criteria) {
            var req = {
                method: 'GET',
                url: '/users/me/actionRecords',
                params: criteria
            };
            return common.makeRequest(req);
        };

        /**
         * Update current user profile
         * @param user the user to update
         * @param userImage the optional html file used as image
         */
        service.updateMyUserProfile = function (user, userImage) {
            var values = _.pick(user, 'firstName', 'lastName', 'email', 'location', 'isFirstNamePublic',
				'isLastNamePublic', 'isEmailPublic', 'isLocationPublic', 'isPicturePublic', 'subscribedToNews');
            var data = new FormData();
            if (userImage) {
                data.append('image', userImage);
            }
            _.each(values, function (value, name) {
                data.append(name, value);
            });
            var req = {
                method: 'PUT',
                url: '/users/me',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            return common.makeRequest(req);
        };

        /**
         * Add a platform employee
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.addPlatformAdmin = function(user, password) {
            var req = {
                method: 'POST',
                url: '/users/platformAdmins',
                data: {
                    user: user,
                    password: password
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Delete a platform employee
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.deletePlatformAdmin = function(id, entity) {
            var req = {
                method: 'DELETE',
                data: entity,
                url: '/users/platformAdmins/' + id,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Fetch all platform employees
         * Only users who have a PLATFORM_EMPLOYEE role is able to perform this operation
         */
        service.getAllPlatformAdmins = function() {
            var req = {
                method: 'GET',
                url: '/users/platformAdmins'
            };
            return common.makeRequest(req);
        };

        /**
         * Verify a platform admin account
         */
        service.verifyPlatformAdmin = function(token) {
            var req = {
                method: 'POST',
                url: '/users/platformAdmins/verify',
                data: {
                    token: token
                }
            };
            return common.makeRequest(req);
        };

        /**
         * Update a platform admin account
         */
        service.updatePlatformAdmin = function(user) {
            var req = {
                method: 'POST',
                url: '/users/me/platformAdmins',
                data: user
            };
            return common.makeRequest(req);
        };

        return service;
    }]);

(function() {
	angular.module("app")
		.controller("forumCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$route", "crumble", "$location", "MockForumRepository", "$uibModal",
			function($scope, $http, $routeParams, $rootScope, $route, crumble, $location, repository, $uibModal) {
				var displayColumns = null;
				
				$http.get('/Forum/data/forumColumns.json').success(function(data) {
					displayColumns = data;
					
					// Add href generator to the first (name) column of the view template
					displayColumns.sections[0].getHref = displayColumns.threads[0].getHref = function(entry) {
						return '#' + $location.url() + '/' + entry.id;
					}
					
					// If section id and thread id are provided - render posts for the specified thread
					if($routeParams.hasOwnProperty('sectionId') && $routeParams.hasOwnProperty('threadId')) {
						repository.getThread($routeParams.sectionId, $routeParams.threadId).then(function(thread) {
							$scope.entries = thread.posts;
							$scope.currentThreadPath = $location.path();
							$route.routes["/Forum/:sectionId/:threadId"].label = thread.name;
							crumble.update();
						});
					}
					// If section id is provided - render threads for the specified section
					else if($routeParams.hasOwnProperty('sectionId')) {
						repository.getSection($routeParams.sectionId).then(function(section) {
							$scope.entries = section.threads;
							$scope.columns = displayColumns.threads;
							$route.routes["/Forum/:sectionId"].label = "Threads of " + section.name;
							crumble.update();
						});
						
						$scope.forumButtons = [{
							title: 'Post New Thread',
							href: 'javascript:;'
						}];
					}
					// Render the sections
					else {
						repository.getSections().then(function(sections) {
							$scope.entries = sections;
							$scope.columns = displayColumns.sections;	
						});
						
						if($scope.loggedUser.isAdmin) {
							$scope.forumButtons = [{
								title: 'Create New Section',
								href: 'javascript:;'
							}];
						}
					}
				});
																			

				
				$scope.itemsPerPageOptions = [
					{ label: '10 Per Page', count: 10 },	
					{ label: '20 Per Page', count: 20 },	
					{ label: '30 Per Page', count: 30 },	
					{ label: '40 Per Page', count: 40 },	
					{ label: '50 Per Page', count: 50 }	
				];
				
				$scope.itemsPerPage = _.clone($scope.itemsPerPageOptions[0]);
			}]);
})();
angular.module("app")
	.factory("MockForumRepository", ["$http", "$q", function($http, $q) {
		var repository = {},
			mockData = null;
			
	    function getData() {
			return $q(function(resolve) {
				if(mockData) {
					return resolve(mockData);
				}
				else {
					// Retrieve mock data from JSON file
					$http.get('/forum/data/mockForum.json').success(function(data) {
						mockData = data;
						resolve(mockData);
					});
				}
			});
		}
		
		repository.checkNicknameAvailability = function(nickname) {
			return getData().then(function(data) { 
				return nickname != 'rioandrew' && !_.find(data.users, function(user) {
					user.nickname === nickname;
				});
			});
		}
		
		repository.getUsers = function() {
			return getData().then(function(data) { return data.users; });
		};
		
		repository.getSections = function() {
			return getData().then(function(data) { return data.sections; });
		};
		
		repository.getSection = function(id) {
			return getData().then(function(data) { 
				var section = _.find(data.sections, function(section) { return section.id.toString() === id.toString() });
				
				// Prefill the section with sample threads
				if(section && typeof section.threads === "undefined" ) {
					section.threads = data.threads;
				}
				
				return section;
			});
		}
		
		repository.getThread = function(sectionId, threadId) {
			return repository.getSection(sectionId).then(function(section) { 
				var thread = _.find(section.threads, function(thread) { return thread.id.toString() === threadId.toString() });
				
				// Prefill the thread with sample posts
				if(thread && typeof thread.posts === "undefined") {
					return getData().then(function(data) {
						thread.posts = data.posts.slice();
						return thread;
					});
				} else {
					return thread;	
				}
			});
		}
		
		repository.getPost = function(postId) {
			return getData().then(function(data) {
				return _.find(data.posts, function(post) { return post.id.toString() === postId.toString() });
			});
		}
		
		repository.createThread = function(sectionId, title, body, username) {
			var thread = {
				name: title,
				replyCount: 0,
				viewCount: 0,
				lastPostDate: 'Teu, Nov 15 2015, 07:45 PM',
				lastPostAuthor: username,
				hasNewActivity: true,
				id: Math.round(Math.random()*100000),
				posts: []
			};
			
			return repository.getSection(sectionId).then(function(section) {
				section.threads.unshift(thread);
				
				return repository.createPost(sectionId, thread.id, title, body, username)
					.then(function() {
						return thread;
					});
			});
		}
		
		
		repository.createPost = function(sectionId, threadId, title, body, username) {
			return repository.getThread(sectionId, threadId).then(function(thread) {
				var post = {
					id: Math.round(Math.random()*100000),
					date: 'Teu, Nov 15 2015, 07:45 PM',
					title: title, 
					body: body, 
					ordinalNumber: thread.posts.length + 1,
					author: {
						name: username,
						avatar: "/forum/assets/i/avatar-placeholder.png",
						type: "Bussiness Owner",
						numPosts: 123
					}
				};
				
				thread.posts.push(post);
				return post;
			});
		}
		
		return repository;
	}]);
(function() {
	angular.module("mockSecurity", ['ngMockE2E'])
		.run(['$httpBackend', 'MockForumRepository', function($httpBackend, repository) {
			var sampleUsers = null;
			
			repository.getUsers().then(function(users) {
				sampleUsers = users;
			});
			
			// Login mock - uses sample user list to lookup mock session token
			$httpBackend.whenPOST(/login/).respond(function(method, url, data) {
				data = angular.fromJson(data);
				var user = _.find(sampleUsers, function(user) { return user.email === data.email && user.password === data.password });
				
				if(user) {
					return [200, {"sessionToken":user.sessionToken}, {}];
				}
			});
			
			// User info mock - uses sample user list to retrieve user based on provided session token
			$httpBackend.whenGET(/users\/me/).respond(function(method, url, data, headers) {
				var user = _.find(sampleUsers, function(user) { return headers.Authorization === 'Bearer ' + user.sessionToken });
				return [200, user, {}];
			});
			
			// pass through all other requests
			$httpBackend.whenGET(/^.*$/).passThrough();
			$httpBackend.whenPOST(/^.*$/).passThrough();
		}]);
})();
(function() {
	angular.module("app")
		.controller("nicknamePopupCtrl", ["$scope", "MockForumRepository",
			function($scope, repository) {
				var vm = this;
				
				vm.nickname = $scope.loggedUser.firstName + $scope.loggedUser.lastName; // Replace with a default nickname
				vm.nicknameAvailable = true;
				
				vm.checkNickname = function(nickname) {
					repository.checkNicknameAvailability(nickname).then(function(available) {
						vm.nicknameAvailable = available;
					});
				};
				
			}]);
})();
(function() {
	angular.module("app")
		.controller("postEditorCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$route", "crumble", "$location", "MockForumRepository", 'config', '$interpolate',
			function($scope, $http, $routeParams, $rootScope, $route, crumble, $location, repository, config, $interpolate) {
				var originalPostId = $routeParams.quotePostId || $routeParams.replyPostId,
					backUrl = null;
				
				// Reply or quote
				if(originalPostId) {
					repository.getPost(originalPostId).then(function(post) {
						$scope.originalPost = post;
						$scope.postTitle = 'Re:' + post.title;
						backUrl = '/Forum/' + $routeParams.sectionId + '/' +  $routeParams.threadId;
						
						// If user is quoting a post - add original post to editor
						if($routeParams.hasOwnProperty('quotePostId')) {
							$scope.postBody = $interpolate(config.FORUM_QUOTE_HTML_TEMPLATE)({post: post});	
						}
						else {
							$scope.postBody = '';
						}
					});	
				} 
				else {
					$scope.postTitle = $scope.postBody = '';
				}
				
				$scope.submit = function() {
					if(originalPostId) {
						repository.createPost($routeParams.sectionId, $routeParams.threadId, $scope.postTitle, $scope.postBody, $rootScope.loggedUser.nickname)
							.then(function() {
								$location.path('/Forum/' + $routeParams.sectionId + '/' + $routeParams.threadId);
							});
					}
					else {
						repository.createThread($routeParams.sectionId, $scope.postTitle, $scope.postBody, $rootScope.loggedUser.nickname)
							.then(function(thread) {
								$location.path('/Forum/' + $routeParams.sectionId + '/' + thread.id);
							});
					}
				}
				
				$scope.cancel = function() {
					
				}
			}]);
})();