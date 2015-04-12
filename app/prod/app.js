/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The main application entry
 *
 * @version 1.0
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
            .when("/ChampionMyHistory", {
                templateUrl: "partials/history.html",
                controller: 'championMyHistoryCtrl'
            })
            .when("/PostCards", {
                templateUrl: "partials/PostCards.html",
                controller: 'postCardsCtrl'
            })
            .when("/FounderMyInfo", {
                templateUrl: "partials/FounderMyInfo.html",
                controller: 'founderMyInfoCtrl'
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
                templateUrl: 'partials/HowItWorks.html'
            })
            .when('/About', {
                templateUrl: 'partials/About.html'
            })
            .when('/Forums', {
                templateUrl: 'partials/Forums.html'
            })
            .when('/Blog', {
                templateUrl: 'partials/Blog.html'
            })
            .when('/Faq', {
                templateUrl: 'partials/Faq.html'
            })
            .when('/Copyright', {
                templateUrl: 'partials/Copyright.html'
            })
            .when('/PrivacyPolicy', {
                templateUrl: 'partials/PrivacyPolicy.html'
            })
            .when('/TermsAndConditions', {
                templateUrl: 'partials/TermsAndConditions.html'
            })
            .when('/VerifyPDFForm', {
                templateUrl: 'partials/VerifyPDFForm.html'
            })
            //==================//

            .otherwise({
                redirectTo: '/'
            });
    }
]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//global config can be accessed by non-angular files
var GlobalConfig = {
    LINKEDIN_APP_ID: '75bfedn3v85xvw',
    FACEBOOK_APP_ID: '435002143324161',
    TWITTER_CONSUMER_KEY: 'HCXijRV8yZLry5pTS24FQ',
    SHARE_THIS_PUBLISHER_KEY: '',
    OAUTH_PUBLIC_KEY: 'SGfONjUkyc91aZpcpFUB07WCkCM'
};

angular.module("app")
    .constant('config', {
        REST_SERVICE_BASE_URL: 'http://localhost:4040',
        FRIEND_INVITATION_MESSAGE_TEMPLATE: '',
        SESSION_TOKEN_REFRESH_PERIOD: 1800,

        LINKEDIN_APP_ID: GlobalConfig.LINKEDIN_APP_ID,
        FACEBOOK_APP_ID: GlobalConfig.FACEBOOK_APP_ID,
        TWITTER_CONSUMER_KEY: GlobalConfig.TWITTER_CONSUMER_KEY,
        SHARE_THIS_PUBLISHER_KEY: '',
        OAUTH_PUBLIC_KEY: GlobalConfig.OAUTH_PUBLIC_KEY
    })
    .constant('roles', {
        BUSINESS_ADMIN: "BUSINESS_ADMIN"
    });
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Forgot Password Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("forgotPasswordCtrl", ['$scope', '$rootScope', '$location', 'SecurityService', function ($scope, $rootScope, $location, SecurityService) {
        $rootScope.modal = true;
        $scope.closeModal = function () {
            $rootScope.modal = false;
        };
        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                // send the password reset link to user email address
                SecurityService.recoverPassword($scope.email).then(function (data) {
                    $rootScope.modal = false;
                    $location.path('/');
                }, function (reason) {
                    $log.error('Error sending reset password link HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                });
            }
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offers Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOfferCtrl', ['$scope', '$location', 'GiftCardOfferService', 'BusinessService', "LookupService", "storage", "$routeParams",
        function ($scope, $location, GiftCardOfferService, BusinessService, LookupService, storage, $routeParams) {
            $scope.selectedBusiness = null;
            $scope.modal = false;
            BusinessService.getMyBusiness().then(function (businesses) {
                $scope.selectedBusiness = angular.extend({}, businesses[0]);
                $scope.businesses = businesses;
            }, function () {
                alert("Cannot get businesses")
            });
            LookupService.getAllBusinessTypes().then(function (types) {
                $scope.businessTypes = types;
            }, function () {
                alert("Cannot business types")
            });


            if ($routeParams.id) {
                // get existing gift card offer
                GiftCardOfferService.getGiftCardOffer($routeParams.id).then(function (result) {
                    $scope.cardOffer = result;
                    $scope.progress = result.availableQuantity + "," + result.totalQuantity;
                    $scope.spentQuantity = result.totalQuantity - result.availableQuantity;
                    var endDateTime = moment(result.endDateTime);
                    var activationDateTime = moment(result.activationDateTime);
                    $scope.postingEnd = {
                        date: endDateTime.format("DD/MM/YYYY"),
                        time: endDateTime.format("hh:mm A")
                    };
                    $scope.activation = {
                        date: activationDateTime.format("DD/MM/YYYY"),
                        time: activationDateTime.format("hh:mm A")
                    };
                }, function () {
                    alert("Cannot get gift card offer")
                });
            } else {
                //for new item, show always 100% progress
                $scope.progress = "1,1";
                $scope.spentQuantity = 0;
                $scope.cardOffer = {
                    status: "DRAFT",
                    redeemedQuantity: 0
                };
                //will keep date and time for posting end date and activation date time
                $scope.postingEnd = {};
                $scope.activation = {};
            }


            //close all modals
            $scope.closeModal = function () {
                $scope.notDraftModal = $scope.postModal = $scope.saveModal = $scope.modal = false;
            };

            //save offer or create new item
            //this method is called when save button is clicked and after post now is clicked 
            $scope.save = function (setActive) {
                if ($scope.cardOffer.status !== "DRAFT") {
                    $scope.notDraftModal = $scope.modal = true;
                    return;
                }
                if ($scope.form.$invalid) {
                    return;
                }
                if (setActive) {
                    $scope.cardOffer.status = "ACTIVE";
                }
                $scope.cardOffer.businessId = $scope.selectedBusiness.id;
                $scope.cardOffer.businessName = $scope.selectedBusiness.name;
                $scope.cardOffer.businessType = $scope.selectedBusiness.type;
                $scope.cardOffer.businessAddress = $scope.selectedBusiness.address;
                $scope.cardOffer.businessPicture = $scope.selectedBusiness.picture;
                $scope.cardOffer.businessTelephone = $scope.selectedBusiness.telephoneNumber;
                $scope.cardOffer.availableQuantity = $scope.cardOffer.totalQuantity;
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
                }, function () {
                    $scope.cardOffer.status = "DRAFT";//revert status
                    alert("Cannot save gift card offer");
                });
            };

            //activate offer
            $scope.postNow = function () {
                $scope.save(true)
            };

            //parse date object (date, time fields) and return ISO String
            function parseDate(obj) {
                var date = moment(obj.date + " " + obj.time, "D/M/YYYY h:mm");
                return date.toISOString();
            }

            //convert user input to card offer field
            function updateExpirationDate() {
                if ($scope.postingEnd && $scope.postingEnd.date && $scope.postingEnd.time) {
                    $scope.cardOffer.endDateTime = parseDate($scope.postingEnd);
                }
            }

            function updateActivationDate() {
                if ($scope.activation && $scope.activation.date && $scope.activation.time) {
                    $scope.cardOffer.activationDateTime = parseDate($scope.activation);
                }
            }

            $scope.$watch("postingEnd.date", updateExpirationDate);
            $scope.$watch("postingEnd.time", updateExpirationDate);
            $scope.$watch("activation.date", updateActivationDate);
            $scope.$watch("activation.time", updateActivationDate);
        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offers Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('giftCardOffersCtrl', ['$scope', '$location', 'GiftCardOfferService', 'BusinessService', "storage", "roles",
        function ($scope, $location, GiftCardOfferService, BusinessService, storage, roles) {
            var maxPageSize = 1e6;//should be enough
            var user = storage.getCurrentUserProfile();
            var businessIds = _.chain(user.userRoles)
                .filter(function (role) {
                    return role.role === roles.BUSINESS_ADMIN;
                })
                .pluck("businessId")
                .value();
            $scope.businesses = [];
            _.each(businessIds, function (id) {
                BusinessService.getBusiness(id).then(function (business) {
                    $scope.businesses.push(business);
                }, function () {
                    alert("Cannot get businesses");
                })
            });
            GiftCardOfferService.getAllGiftCardOffers(1, maxPageSize).then(function (result) {
                var offers = _.filter(result.items, function (item) {
                    return _.contains(businessIds, item.businessId);
                });
                $scope.offers = offers;

                // calculate total values
                var totalSold = 0, totalRedeemed = 0;
                angular.forEach(offers, function (offer) {
                    totalSold += offer.totalQuantity - offer.availableQuantity;
                    totalRedeemed += offer.redeemedQuantity;
                });
                $scope.totalAmountSold = totalSold;
                $scope.totalAmountRedeemed = totalRedeemed;
                $scope.totalCount = offers.length;
            }, function () {
                alert("Cannot get gift cards");
            });

            //cancel the offer
            $scope.cancel = function (offer) {
                GiftCardOfferService.cancelGiftCard(offer.id).then(function () {
                    offer.status = "CANCELLED";
                }, function () {
                    alert("Cannot cancel posting");
                });
            };
        }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Home Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('homeCtrl', ['$scope', '$location', '$routeParams', 'DataService', 'GiftCardOfferService', 'BusinessService', '$timeout', 'NotificationService', "util",
        function ($scope, $location, $routeParams, DataService, GiftCardOfferService, BusinessService, $timeout, NotificationService, util) {
            $scope.pause = false;
            $scope.check = false;
            $scope.Home = {};
            function initMaps() {
                // Check google maps api already loaded
                if ($('#google-maps-script').length) {
                    loadMap();
                    return;
                }

                // Map api load callback
                window.initializeGoogleMaps = function () {
                    delete window.initializeGoogleMaps;
                    loadMap();
                };

                // Load google maps api
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = 'google-maps-script';
                script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
                document.body.appendChild(script);
            }

            function loadMap() {
                var lat = 0,
                    lng = 0;

                if ($scope.detailGiftCardOffer && $scope.detailGiftCardOffer.coordinates) {
                    lat = $scope.detailGiftCardOffer.coordinates[0];
                    lng = $scope.detailGiftCardOffer.coordinates[1];
                }

                var mapPosition = new google.maps.LatLng(lat, lng);
                var mapCanvas = $('#map-canvas').get(0);
                var mapOptions = {
                    center: mapPosition,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(mapCanvas, mapOptions);
                var marker = new google.maps.Marker({
                    position: mapPosition,
                    map: map
                });
            }

            // display view details
            var GetBusinessPromise = BusinessService.getBusiness;
            var GetGiftCardOfferCommentsPromise = GiftCardOfferService.getGiftCardOfferComments;
            $scope.display = false;
            $scope.showInfo = function (item) {
                $scope.detailGiftCardOffer = item;
                $scope.display = true;

                GetBusinessPromise(item.businessId).then(function (data) {
                    delete data.id;
                    angular.extend($scope.detailGiftCardOffer, data);

                    initMaps();

                    GetGiftCardOfferCommentsPromise(item.id).then(function (comments) {
                        $scope.detailGiftCardOffer.comments = comments;

                    }, function (comments) {
                    });

                }, function (data) {
                });
            };

            // close view details
            $scope.closeInfo = function () {
                $scope.display = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
            GiftCardOfferPromise(1, 12, $scope.search.name).then(function (data) {

                $scope.totalRecords = data.totalRecords;
                $scope.giftCardOffers = data.items;

                if (window.location.hash.indexOf('search') !== -1) {
                    $scope.Home.title = "Search Results";
                }
            }, function (data) {
            });

            var currentPageNum = 4;

            // infinite scroll
            $scope.loadMore = function () {

                if ($scope.giftCardOffers && $scope.giftCardOffers.length < $scope.totalRecords && !$scope.pause) {
                    $scope.pause = true;
                    $timeout(function () {
                        GiftCardOfferPromise(currentPageNum, 4, $scope.search.name).then(function (data) {
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

            var CreateGiftCardOfferCommentPromise = GiftCardOfferService.createGiftCardOfferComment;

            $scope.checkEnter = function ($event, comment) {
                if ($event.keyCode === 13) {
                    if (util.isLoggedIn()) {
                        var giftCardOfferId = $scope.detailGiftCardOffer.id;
                        var comment = $.trim($("#commentToAdd").val());
                        $("#commentToAdd").val("");
                        CreateGiftCardOfferCommentPromise(giftCardOfferId, comment).then(function (data) {
                            GetGiftCardOfferCommentsPromise(giftCardOfferId).then(function (comments) {
                                $scope.detailGiftCardOffer.comments = comments;

                            }, function (comments) {
                            });
                        }, function (data) {
                        });
                    } else {
                        $location.path('/Login');
                    }

                }
            };

            $scope.emailError = false;

            $scope.emailToFriend = function (friendEmail, offerId, offerTitle) {
                if (friendEmail && friendEmail.indexOf('@') > 1) {
                    if (util.isLoggedIn()) {
                        $scope.emailError = false;
                        var url = window.encodeURIComponent($location.absUrl()) + '?offerId=' + offerId;
                        var friendInvitation = {
                            "friendEmail": friendEmail,
                            "message": 'Come to this cool site: <a href="' + url + '">' + offerTitle + '</a>!'
                        };
                        NotificationService.invitations(friendInvitation).then(function (data) {
                            alert("Email has sent to " + friendEmail + " successfully!");
                        }, function (data) {
                            console.log(data);
                        });
                    } else {
                        $location.path('/Login');
                    }
                } else {
                    $scope.emailError = true;
                }
            };


            // Show giftCardOffer Detail if router params contains offerId
            if ($routeParams.offerId && $routeParams.offerId.length > 0) {

                GiftCardOfferService.getGiftCardOffer($routeParams.offerId).then(function (data) {

                    $scope.showInfo(data);

                }, function (data) {
                });
            }
        }
    ]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Login Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('loginCtrl', ['$scope', '$location', '$rootScope', '$log', 'SecurityService', 'UserService', 'storage', 'base64',
        function ($scope, $location, $rootScope, $log, SecurityService, UserService, storage, base64) {
            $scope.rememberMe = false;
            $scope.username = '';
            $scope.password = '';
            $scope.loginError = false;

            var loginHandler = function (token) {
                storage.storeSessionToken(token, $scope.rememberMe);
                UserService.getMyUserProfile().then(function (data) {
                    storage.storeCurrentUserProfile(data, $scope.rememberMe);
                    SecurityService.getAllowedActions().then(function (actions) {
                        storage.storeAllowedActions(actions, $scope.rememberMe);
                        // broadcast event
                        $rootScope.$broadcast('userActionsChanged', actions);
                        if ($rootScope.isActionAllowed('businessAdmin')) {
                            $location.path('/Founder$hares');
                        } else if ($rootScope.isActionAllowed('businessEmployee')) {
                            $location.path('/FounderStatus');
                        } else {
                            $location.path('/ChampionMyFounder$hares');
                        }
                    }, function (reason) {
                        $log.error('Error fetching allowed actions HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                    });
                }, function (profileReason) {
                    $log.error('Error fetching user profile HTTP STATUS CODE [ ' + profileReason.status + ' ] Error [ ' + angular.toJson(profileReason.data) + ' ]');
                });
            }

            $scope.login = function () {
                if (!$scope.username || !$scope.password) {
                    $scope.loginError = true;
                } else {
                    // login via password type
                    SecurityService.authenticate($scope.username, $scope.password).then(function (data) {
                        loginHandler(data.sessionToken);
                    }, function (reason) {
                        $log.error('Login Error HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                        $scope.loginError = true;
                        if (reason.status === 401 || reason.status === 403) {
                            $scope.errorMsg = 'Invalid email/password';
                        } else {
                            $scope.errorMsg = reason.data.error;
                        }
                    });
                }
            };

            var socialNetworkLoginHandler = function (socialNetwork, token) {
                SecurityService.authenticateWithSocialNetwork(socialNetwork, token).then(function (data) {
                    loginHandler(data.sessionToken);
                }, function (reason) {
                    $log.error('Error authenticating social network ' + socialNetwork + ' HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                    $scope.loginError = true;
                    if (reason.status === 404) {
                        // user not found. First register user using social network
                        $scope.errorMsg = 'User is not registered';
                    } else {
                        $scope.errorMsg = reason.data.error;
                    }
                });
            };

            $scope.loginWithSocialNetwork = function (socialNetwork) {
                if (socialNetwork === $scope.socialNetworks.facebook) {
                    FB.getLoginStatus(function (response) {
                        if (response.status === $scope.facebookLoginResponse.connected) {
                            socialNetworkLoginHandler(socialNetwork, response.authResponse.accessToken);
                        } else {
                            FB.login(function (response) {
                                if (response.authResponse) {
                                    socialNetworkLoginHandler(socialNetwork, response.authResponse.accessToken);
                                }
                            }, {scope: 'email'});
                        }
                    });
                } else if (socialNetwork === $scope.socialNetworks.linkedin) {
                    IN.User.authorize(function () {
                        // get the oauth_token from ENV
                        var oauthToken = IN.ENV.auth.oauth_token;
                        socialNetworkLoginHandler(socialNetwork, oauthToken);
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
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("mainCtrl", ['$scope', '$rootScope', 'DataService', '$location', 'util', 'storage', function ($scope, $rootScope, DataService, $location, util, storage) {
        $rootScope.modal = false;
        $scope.util = util;
        // store search data
        $rootScope.keyword = '';
        // mock up add to card
        $scope.addToCard = function () {
            if (util.isLoggedIn()) {
                $location.path('/ShoppingCart');
            } else {
                $location.path('/Login');
            }
        };
        $scope.socialNetworks = {
            facebook: 'facebook',
            twitter: 'twitter',
            linkedin: 'linkedin'
        };
        $scope.facebookLoginResponse = {
            connected: 'connected',
            not_authorized: 'not_authorized',
            unknown: 'unknown'
        };
        // store search data
        $scope.search = {};

        //logout
        $scope.logout = function () {
            storage.clear();
            $location.path('/Login');
        };

        //go to my profile
        $scope.goUser = function () {
            $location.path($rootScope.getHome());
        };

        $scope.searchCards = function () {
            // redirect to home page home page will perform search based on the keyword in rootscope
            $location.path('/');
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

//My Employees Controller
angular.module("app")
.controller("MyEmployeesCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get Employees
    //$rootScope.role = 'Founder';
    var promise = DataService.query("employees");
    promise.then(function(data){
        $scope.employeesList = data.employees;
        angular.forEach($scope.employeesList,function(employees,index){
            angular.extend(employees,{'flag' : false , 'nameEmpty' : false , 'passwordEmpty': false});
        });
        //Add
        $scope.add = function(){
            var item = {
                "name": "",
                "password": "",
                "flag": true,
                "nameEmpty": "",
                "passwordEmpty": ""
            }
            $scope.employeesList.push(item);
        }
        //Modify
        $scope.modify = function(idx){
            $scope.employeesList[idx].flag = true;
        };
        //Save
        $scope.save = function(idx){
            if($scope.employeesList[idx].name && $scope.employeesList[idx].password){
                $scope.employeesList[idx].flag =
                    $scope.employeesList[idx].passwordEmpty =
                        $scope.employeesList[idx].nameEmpty = false;
            }else{
                if(!$scope.employeesList[idx].name){
                    $scope.employeesList[idx].nameEmpty = true;
                }
                if(!$scope.employeesList[idx].password){
                    $scope.employeesList[idx].passwordEmpty = true;
                }
            }
        };
        //Delete
        $scope.remove = function(idx){
            $scope.employeesList.splice(idx, 1);
        };
    },function(data){});
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


//championMyFounder$hares Controller
angular.module("app")
.controller('championMyFounder$haresCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {

        $scope.pause = false;

        // open file dialog
        $scope.openFileDialog = function (elementName) {
            angular.element('#' + elementName)[0].click();
        };

        // data content MyCart
        var MyCartPromise = DataService.query('MyCart');
        MyCartPromise.then(function(data) {
            $scope.MyCart = data;
        }, function(data) {});


        $scope.user = {item: 0};
        $scope.activeButton = {item: 1};
        $scope.show = "show";

        // mock up infinite scroll
        $scope.loadMore = function() {
            if($scope.MyCart && $scope.MyCart.listItem.length <= 30 && !$scope.pause) {
                $scope.pause = true;
                $timeout(function () {
                    for(var i = 0; i < 5; i++) {
                        $scope.MyCart.listItem.push(angular.copy($scope.MyCart.more));
                    }
                    $scope.pause = false;
                }, 800);
            }
        };

        $scope.showAddNew = false;

        $scope.startAddNew = function () {
            $scope.showAddNew = true;
        };

        //add item
        $scope.addItem = function (source, object) {
            object.push(angular.copy(source));
            $scope.showAddNew = false;
        };

        //delete Custom Site
        $scope.delete = function (index, object) {
            if (index > -1) {
                object.splice(index, 1);
            }
        };
        // init when page loaded
        function init() {
            $scope.user.item = 1;
        }
        init();

    }
]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//My History Controller
angular.module("app")
.controller("championMyHistoryCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    var promise = DataService.query("championHistory");
    promise.then(function(data){
        $scope.historyList = data.history;
        //$rootScope.role = 'Champion';
    },function(data){});
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

//championMyInfo Controller
angular.module("app")
.controller('championMyInfoCtrl', ['$scope', '$rootScope', 'DataService',
    function ($scope, $rootScope, DataService) {

        $rootScope.modal = false;
        //$rootScope.role = 'Employee';
        $scope.uploader = {};

        $scope.businessType = [
            {
                name: 'Champion',
                value: 'Champion'
            },
            {
                name: 'Business Owner',
                value: 'Business Owner'
            }
        ];

        //Get Info
        var promise = DataService.query("info");
        promise.then(function(data){
            $scope.Myinfo = data;
            $scope.Editinfo = jQuery.extend(true, {}, data);
        },function(data){});
        $scope.save = function(){
            $scope.Myinfo = jQuery.extend(true, {}, $scope.Editinfo);
            if ($scope.uploader.flow.files[0]) {
                $scope.Editinfo.photo.describe = $scope.Myinfo.photo.describe = $scope.uploader.flow.files[0].name;
            }
            $scope.uploader.flow.files = [];
        };

        $scope.cancel = function() {
            $scope.Editinfo = jQuery.extend(true, {}, $scope.Myinfo);
            $scope.uploader.flow.files = [];
        };

        $scope.password = "123456";
        $scope.clonepassword = "123456";
        $scope.cancelPassword = function(){
            $scope.password = $scope.clonepassword;
            $scope.newpassword = $scope.confirmpassword = "";
            $scope.switchPassword = false;
        };
        $scope.savePassword = function(){
            $scope.submitted = true;
            if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
                $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
                $scope.switchPassword = false;
            }
        };
    }
]);
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
.controller("founderF$PostingCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    //$rootScope.role = 'Founder';
    var promise = DataService.query("post");
    promise.then(function(data){
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
        $scope.save = function(){
            if($scope.form.$valid){
                $scope.saveModal = $scope.modal = true;
            }
        }
        //Done
        $scope.done = function(){
            $scope.saveModal = $scope.modal = false;
        }
        //Post
        $scope.postNow = function(){
            if($scope.form.$valid){
                $scope.postModal = $scope.modal = true;
            }
        }
        //Close Modal
        $scope.closeModal = function(){
            $scope.postModal = $scope.saveModal = $scope.modal = false;
        }
    },function(data){});
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

angular.module("app")
.controller("founderMyHistoryCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    var promise = DataService.query("founderHistory");
    promise.then(function(data){
        $scope.historyList = data.history;
        //$rootScope.role = 'Founder';
    },function(data){});
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

//founderMyInfoCtrl Controller
angular.module("app")
.controller('founderMyInfoCtrl', ['$scope', '$rootScope', 'DataService',
    function ($scope, $rootScope, DataService) {
        $rootScope.modal = false;
        //$rootScope.role = 'Employee';
        $scope.uploader = {};

        $scope.businessType = [
            {
                name: 'Super Market',
                value: 'supermarket'
            },
            {
                name: 'Commercial',
                value: 'Commercial'
            },
            {
                name: 'Retail',
                value: 'Retail'
            }
        ];
        $scope.feedback_type = {
            name: 'Question',
            value: 'Question'
        };

        //Get Info
        var promise = DataService.query("info");
        promise.then(function(data){
            $scope.Myinfo = data;
            $scope.Editinfo = jQuery.extend(true, {}, data);
        },function(data){});
        $scope.save = function(){
            $scope.Myinfo = jQuery.extend(true, {}, $scope.Editinfo);
            if ($scope.uploader.flow.files[0]) {
                $scope.Editinfo.logo.describe = $scope.Myinfo.logo.describe = $scope.uploader.flow.files[0].name;
            }
            $scope.uploader.flow.files = [];
        };

        $scope.cancel = function() {
            $scope.Editinfo = jQuery.extend(true, {}, $scope.Myinfo);
            $scope.uploader.flow.files = [];
        };

        $scope.password = "123456";
        $scope.clonepassword = "123456";
        $scope.cancelPassword = function(){
            $scope.password = $scope.clonepassword;
            $scope.newpassword = $scope.confirmpassword = "";
            $scope.switchPassword = false;
        };
        $scope.savePassword = function(){
            $scope.submitted = true;
            if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
                $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
                $scope.switchPassword = false;
            }
        };
    }
]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Founder Status Controller
angular.module("app")
.controller("founderStatusCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //$rootScope.role = 'Employee';
    //Get Founder Status
    var promise = DataService.query("founder");
    promise.then(function(data){
        $scope.founderList = data.founder;
        $scope.founderList[0].active = true;
        $scope.active = function(idx){
            for(var i=0;i<$scope.founderList.length;i++){
                $scope.founderList[i].active = false;
            }
            $scope.founderList[idx].active = true;
        }
    },function(data){});
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

//Payment
angular.module("app")
.controller("paymentCtrl",function($scope,$rootScope, $location, localStorageService){
    $rootScope.modal = false;
    $scope.userRole = localStorageService.get("role");
    var currentYear = new Date().getFullYear();
    $scope.years = new Array();
    for (var i = currentYear; i< currentYear+20; i++) {
        $scope.years.push({
            name: i,
            value: i
        });
    }
    $scope.months = [
        {
            name: 'month',
            value: 'month'
        },
        {
            name: '1',
            value: '1'
        },
        {
            name: '2',
            value: '2'
        },
        {
            name: '3',
            value: '3'
        },
        {
            name: '4',
            value: '4'
        },
        {
            name: '5',
            value: '5'
        },
        {
            name: '6',
            value: '6'
        },
        {
            name: '7',
            value: '7'
        },
        {
            name: '8',
            value: '8'
        },
        {
            name: '9',
            value: '9'
        },
        {
            name: '10',
            value: '10'
        },
        {
            name: '11',
            value: '11'
        },
        {
            name: '12',
            value: '12'
        }
    ];
    $scope.select_year = {
        name: 'year',
        value: 'year'
    }
    $scope.select_month = {
        name: 'month',
        value: 'month'
    }
    $scope.done = function(){
        $scope.modal = false;
    };
    $scope.submit = function(){
        $scope.submitted = true;
        if($scope.form.$valid){
            //Done
            $scope.modal = true;
        }
    };
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

//My Info Controller

angular.module("app")
.controller("platEmployeeMyInfoCtrl",function($scope, DataService, $rootScope){
    $rootScope.modal = false;
    $scope.password = "123456";
    $scope.clonepassword = "123456";
    $scope.cancelPassword = function(){
        $scope.password = $scope.clonepassword;
        $scope.newpassword = $scope.confirmpassword = "";
        $scope.switchPassword = false;
    };
    $scope.savePassword = function(){
        $scope.submitted = true;
        if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
            $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
            $scope.switchPassword = false;
        }
    };
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
.controller("postCardsCtrl",function($scope,DataService,$rootScope){
    $rootScope.modal = false;
    //Get History
    //$rootScope.role = 'Founder';
    var promise = DataService.query("postCard");
    promise.then(function(data){
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
        $scope.save = function(){
            if($scope.form.$valid){
                $scope.saveModal = $scope.modal = true;
            }
        }
        //Done
        $scope.done = function(){
            $scope.saveModal = $scope.modal = false;
        }
        //Post
        $scope.postNow = function(){
            if($scope.form.$valid){
                $scope.postModal = $scope.modal = true;
            }
        }
        //Close Modal
        $scope.closeModal = function(){
            $scope.postModal = $scope.saveModal = $scope.modal = false;
        }
    },function(data){});
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

//Provide Feedback
angular.module("app")
.controller("provideFeedbackCtrl",function($scope,$rootScope){
    $rootScope.modal = false;
    $scope.myOptions = [
        {
            name: 'Question',
            value: 'Question'
        },
        {
            name: 'Problem',
            value: 'Problem'
        },
        {
            name: 'Other',
            value: 'Other'
        }
    ];
    $scope.feedback_type = {
        name: 'Question',
        value: 'Question'
    };
    $scope.submit = function(){
        $scope.submitted = true;
    };
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

//Report Abuse Controller
angular.module("app")
.controller("reportAbuseCtrl",function($scope,$rootScope){
    $rootScope.modal = false;
    //$rootScope.role = 'Founder';
    $scope.submitQuery = function(){
        $scope.submitted = true;
        if($scope.abuseForm.$valid){
            $scope.reportModal = $rootScope.modal = true;
        }
    }
    $scope.submit = $scope.submitQuery;
    //Close Modal
    $scope.done = function(){
        $scope.submitted = $scope.reportModal = $rootScope.modal = false;
    }
    $scope.closeModal = function(){
        $scope.submitted = $scope.reportModal = $rootScope.modal = false;
    }
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

//Shopping Cart Controller
angular.module("app")
.controller("shoppingCartCtrl",function($scope,DataService,$rootScope, $location, localStorageService){
    $rootScope.modal = false;
    //Get Shopping Cart
    var promise = DataService.query("cart");

    promise.then(function(data){
        $scope.cartList = data.carts;
        $scope.price = [];
        $scope.total = 0;
        for(var i=0;i<$scope.cartList.length;i++){
            $scope.price.push(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100);
            $scope.total += Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100;
        }
        $scope.reflash = function(){
            $scope.total = 0;
            $scope.price = [];
            $scope.validate = [];
            for(var i=0;i<$scope.cartList.length;i++){
                //Validate
                if(Number($scope.cartList[i].value.replace('$','')) <= $scope.cartList[i].available){
                    $scope.validate.push(false);
                    if(!isNaN(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100)){
                        $scope.price.push((Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)).toFixed(2));
                    }else{
                        $scope.price.push('0');
                    }
                    $scope.total += $scope.price[i];
                    $scope.total = Math.round($scope.total*100)/100;
                }else{
                    $scope.price.push('0');
                    $scope.total += $scope.price[i];
                    $scope.total = Math.round($scope.total*100)/100;
                    $scope.validate.push(true);
                }
            }
        }
        //Pay
        $scope.pay = function(){
            var role = localStorageService.get("role");
            console.log(role);
            if(!role){
                $rootScope.modal = $scope.unLoginModal = true;
            }else{
                $location.path("/Payment");
            }
        }
        //Close
        $scope.cancel = function(){
            $rootScope.modal = $scope.unLoginModal = false;
        }
        //Delete
        $scope.delete = function(id){
            for(var i=0;i<$scope.cartList.length;i++){
                $scope.cartList.splice(i,1);
            }
            $scope.reflash();
        }
        $scope.closeModal = function(){
            $rootScope.modal = $scope.unLoginModal = false;
        }
    },function(data){});
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
.controller("verifyAccountCtrl",function($scope,$rootScope){
    $rootScope.modal = false;
});
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Register Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("registerCtrl", ['$scope', '$rootScope', '$log', '$location', 'LookupService', 'UserService', 'base64', function ($scope, $rootScope, $log, $location, LookupService, UserService, base64) {
        $rootScope.modal = true;
        $scope.accept = false;
        $scope.userImage = undefined;
        $scope.businessImage = undefined;
        $scope.showError = false;
        $scope.errorMessage = '';
        //Set Dropdown
        $scope.accountTypes = [
            {
                name: 'CHAMPION',
                value: 'Champion'
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

        var registerHelper = function (registration) {
            UserService.register(registration, $scope.userImage, $scope.businessImage).then(function () {
                $log.info('registration success');
                $location.path('/');
            }, function (reason) {
                $log.error('Error registering user. HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
                $scope.showError = true;
                $scope.errorMessage = reason.data.error;
            });
        };

        $scope.register = function (user) {
            if ($scope.accept) {
                $scope.submitted = true;
            }
            if ($scope.form.$valid && $scope.accept) {
                var registration;
                if ($scope.accountType.name === 'CHAMPION') {
                    registration = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.confirm_password,
                        accountType: $scope.accountType.name,
                        email: user.email
                    };
                } else if ($scope.accountType.name === 'FOUNDER') {
                    registration = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.confirm_password,
                        accountType: $scope.accountType.name,
                        email: user.email,
                        business: {
                            name: user.businessName,
                            type: $scope.businessType.name
                        }
                    };
                }
                registerHelper(registration);
            }
        };
        $scope.registerWithSocialNetwork = function (socialNetwork) {
            if (socialNetwork === $scope.socialNetworks.facebook) {
                FB.getLoginStatus(function (response) {
                    if (response.status === $scope.facebookLoginResponse.connected) {
                        var registration = {
                            linkedSocialNetwork: socialNetwork,
                            linkedSocialNetworkAccessToken: response.authResponse.accessToken,
                            accountType: $scope.accountType.name
                        };
                        registerHelper(registration);
                    } else {
                        FB.login(function (response) {
                            if (response.authResponse) {
                                var registration = {
                                    linkedSocialNetwork: socialNetwork,
                                    linkedSocialNetworkAccessToken: response.authResponse.accessToken,
                                    accountType: $scope.accountType.name
                                };
                                registerHelper(registration);
                            }
                        }, {scope: 'email'});
                    }
                });
            } else if (socialNetwork === $scope.socialNetworks.linkedin) {
                IN.User.authorize(function () {
                    // get the oauth_token from ENV
                    var oauthToken = IN.ENV.auth.oauth_token;
                    var registration = {
                        linkedSocialNetwork: socialNetwork,
                        linkedSocialNetworkAccessToken: oauthToken,
                        accountType: $scope.accountType.name
                    };
                    registerHelper(registration);
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
            $rootScope.modal = false;
        }
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Reset Password Controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller("resetPasswordCtrl", ['$scope', '$location', 'SecurityService', function ($scope, $location, SecurityService) {
        // get reset password token from query string
        var params = $location.search();
        var resetPasswordToken = params.token;
        $scope.submit = function () {
            // call backend API to reset the password
            SecurityService.resetForgottenPassword(resetPasswordToken, $scope.confirm_password).then(function (data) {
                $location.url($location.path('/'));
            }, function (reason) {
                $log.error('Error resetting forgotten password HTTP STATUS CODE [ ' + reason.status + ' ] Error [ ' + angular.toJson(reason.data) + ' ]');
            });
        }
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application directives.
 *
 * @version 1.0
 * @author TCSASSEMBLER
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
app.directive('maxNumber', function () {
    return {
        require: 'ngModel',
        scope: {
            max: '=maxNumber',
            model: '=ngModel'
        },
        link: function (scope, element, attrs, modelCtrl) {
            element.on('keyup', function () {
                scope.$apply(function () {
                    if (scope.model > scope.max) {
                        scope.model = scope.max;
                    }
                    scope.model = Number(scope.model);
                });
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
                var date = moment(viewValue, "D/M/YYYY", true);
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
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application filters.
 *
 * @version 1.0
 * @author TCSASSEMBLER
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
    return function (input) {
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
        var hours = Math.floor(totalHours % 24)
        var ret = "";
        if (days) {
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
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * @version 1.0
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
                localStorage.setItem('momandpop.auth.profile', profile);
            }
        };

        /**
         * Get current user allowed actions stored in sessionStorage or localStorage
         */
        service.getAllowedActions = function () {
            var actions = sessionStorage.getItem('momandpop.auth.actions');
            if (!actions) {
                actions = localStorage.getItem('momandpop.auth.actions');
            }
            return angular.fromJson(actions);
        };

        /**
         * Store the allowed actions in sessionStorage
         * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
         */
        service.storeAllowedActions = function (actions, flag) {
            actions = angular.toJson(actions);
            sessionStorage.setItem('momandpop.auth.actions', actions);
            if (flag) {
                localStorage.setItem('momandpop.auth.actions', actions);
            }
        };

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');

            localStorage.removeItem('momandpop.auth.token');
            localStorage.removeItem('momandpop.auth.actions');
            localStorage.removeItem('momandpop.auth.profile');
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application utility service
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

angular.module("app")
    .factory('util', ['$log', 'SecurityService', 'UserService', 'storage', function ($log, SecurityService, UserService, storage) {
        var service = {};

        /**
         * This function is called in interval to refresh the session token
         */
        service.refreshToken = function () {
            $log.info('Refreshing sessionToken');
            var token = localStorage.getItem('momandpop.auth.token');
            if (token) {
                SecurityService.refreshToken(token).then(function (loginResult) {
                    storage.storeSessionToken(loginResult.sessionToken, true);
                    // get user profile
                    UserService.getMyUserProfile().then(function (user) {
                        storage.storeCurrentUserProfile(user, true);
                        // get allowed actions
                        SecurityService.getAllowedActions().then(function (actions) {
                            storage.storeAllowedActions(actions, true);
                        }, function (actionReason) {
                            $log.error('Error fetching current user actions ' + actionReason);
                        });
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
            var actions = storage.getAllowedActions();
            var sessionToken = storage.getSessionToken();
            return !!(profile && actions && sessionToken);
            
        };

        return service;
    }]);

/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This file loads the javascript sdk's for various social networks
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

// facebook sdk
window.fbAsyncInit = function () {
    FB.init({
        appId: GlobalConfig.FACEBOOK_APP_ID,
        xfbml: true,
        version: 'v2.2'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function () {
    // initialize linkedin library
    $.getScript("http://platform.linkedin.com/in.js?async=true", function success() {
        IN.init({
            api_key: GlobalConfig.LINKEDIN_APP_ID,
            authorize: true
        });
    });
    // initialize oath.io library
    OAuth.initialize(GlobalConfig.OAUTH_PUBLIC_KEY);
});
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Business service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('BusinessService', ['config', '$http', '$q', 'storage', function (config, $http, $q, storage) {
        var service = {};

        service.getBusiness = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getMyBusiness = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.verify = function (firstName, lastName, creditCard) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/verify',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    creditCard: creditCard
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.getBusinessEmployees = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.addBusinessEmployees = function (employee) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: employee
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.deleteBusinessEmployee = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'DELETE',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        service.updateBusinessEmployee = function (id, employee) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var req = {
                method: 'PUT',
                url: config.REST_SERVICE_BASE_URL + '/businesses/me/employees/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: employee
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
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('GiftCardOfferService', ['config', '$rootScope', '$http', '$log', '$q', 'storage', function (config, $rootScope, $http, $log, $q, storage) {
        return {
            /**
             * Search for gift card offers
             * @param pageNumber the page number
             * @param pageSize the page size
             * @param businessName the business name
             */
            getAllGiftCardOffers: function (pageNumber, pageSize, businessName) {
                var deferred = $q.defer();
                var filter = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize;
                if (businessName && businessName.length > 0) {
                    filter += '&businessName=' + businessName;
                }

                $http({
                    method: 'GET',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers?' + filter,
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            /**
             * Get a gift card offer
             * @param offerId the gift card offer id
             */
            getGiftCardOffer: function (offerId) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers/' + offerId
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            /**
             * Get comments of a gift card offer
             * @param giftCardOfferId the gift card offer id
             */
            getGiftCardOfferComments: function (giftCardOfferId) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers/' + giftCardOfferId + '/comments',
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            /**
             * Create a comment for a gift card
             * @param giftCardOfferId the gift card offer id
             * @param comment the comment text
             */
            createGiftCardOfferComment: function (giftCardOfferId, comment) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers/' + giftCardOfferId + '/comments',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        "comment": comment,
                        "giftCardOfferId": giftCardOfferId
                    }
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            /**
             * Create a gift card
             * @param giftCardOffer the gift card
             * @returns {promise} the promise
             */
            createGiftCard: function (giftCardOffer) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: giftCardOffer
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            /**
             * Update a gift card
             * @param giftCardOffer the gift card
             */
            updateGiftCard: function (giftCardOffer) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'PUT',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers/' + giftCardOffer.id,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: giftCardOffer
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            /**
             * Cancel a gift card
             * @param id the gift card id
             */
            cancelGiftCard: function (id) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/giftCardOffers/' + id + "/cancel",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    }
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
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
 * Gift Card Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('GiftCardService', ['config', '$http', '$q', 'storage', function (config, $http, $q, storage) {
        var service = {};
        /**
         * Search gift cards
         */
        service.search = function (criteria) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var url = config.REST_SERVICE_BASE_URL + '/users/me/giftCards?';
            for (var key in criteria) {
                if (criteria.hasOwnProperty(key)) {
                    url = url + key + '=' + criteria[key] + '&';
                }
            }
            // drop the last & sign
            url = url.substring(0, url.lastIndexOf('&') !== -1 ? url.lastIndexOf('&') : url.length);
            // prepare request object
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Get gift card by id
         */
        service.get = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Resell gift card
         */
        service.resell = function (id, quantityToSell, description) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id + '/resell?quantityToSell=' + quantityToSell,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Prepare a gift card for redeem
         */
        service.prepareForRedeem = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/users/me/giftCards/' + id + '/prepareForRedeem',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Redeem a gift card
         */
        service.redeem = function (qrCode, amount) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/giftCards/redeem?qrCode=' + qrCode + '&amount=' + amount,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
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
 * Lookup Service.
 *
 * @version 1.0
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

        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

angular.module("app")
    .factory('NotificationService', ['config', '$rootScope', '$http', '$log', '$q', "storage", function (config, $rootScope, $http, $log, $q, storage) {
        return {
            /**
             * Send an invitation email to a friend
             * @param friendInvitation the friend invitation
             */
            invitations: function (friendInvitation) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/invitations/',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        "friendEmail": friendInvitation.friendEmail,
                        "message": friendInvitation.message
                    }
                })
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        $log.error(data, status);
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
 * Security Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('SecurityService', ['config', 'base64', 'storage', '$http', '$q', '$log', function (config, base64, storage, $http, $q, $log) {
        var service = {};
        /**
         * Authenticate the user using password type.
         */
        service.authenticate = function (email, password) {
            var deferred = $q.defer();
            var credentials = base64.encode(email + ':' + password);
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/login?type=password',
                headers: {
                    'Authorization': 'Basic ' + credentials
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };
        /**
         * Authenticate the user based on the given social network and accessToken for that socialNetwork
         */
        service.authenticateWithSocialNetwork = function (socialNetwork, accessToken) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/login?type=' + socialNetwork,
                headers: {
                    'Authorization': 'Basic ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Refresh the current sessionToken.
         * This service method internally sets the localStorage and session storage to new sessionToken
         */
        service.refreshToken = function (sessionToken) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/refreshToken',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get allowed actions for current user
         */
        service.getAllowedActions = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me/actions',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Recover the forgotten password
         */
        service.recoverPassword = function (email) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/forgotPassword?email=' + email
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Reset forgotten password. Reset password token is mandatory
         */
        service.resetForgottenPassword = function (token, password) {
            var deferred = $q.defer();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/resetForgottenPassword?token=' + token + '&newPassword=' + password
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Revoke the current session token
         */
        service.revokeSessionToken = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'POST',
                url: config.REST_SERVICE_BASE_URL + '/revokeToken',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Reset the current user password.
         * It is simply updating the current user password
         */
        service.resetPassword = function (oldPassword, newPassword) {
            var deferred = $q.defer();
            return deferred.promise;
        };
        return service;
    }]);
/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * User Service.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */


angular.module("app")
    .factory('UserService', ['config', 'storage', '$http', '$q', '$log', function (config, storage, $http, $q, $log) {
        var service = {};

        /**
         * Register the user on mom and pop platform
         * registration is registration entity object which would be converted to json string
         * userProfile and businessProfile are optional
         */
        service.register = function (registration, userImage, businessImage) {
            var deferred = $q.defer();
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
                url: config.REST_SERVICE_BASE_URL + '/register',
                headers: {
                    'Content-Type': undefined
                },
                data: data
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get user profile uniquely identified by id
         */
        service.getUserProfile = function (id) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/' + id,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get all user profiles identified by each individual id in ids array
         */
        service.getUserProfiles = function (ids) {
            var deferred = $q.defer();
            var url = config.REST_SERVICE_BASE_URL + '/users/multiple?';
            var accessToken = storage.getSessionToken();
            angular.forEach(ids, function (id) {
                url = url + 'id[]=' + id;
            });
            // prepare request object
            var req = {
                url: url,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Get my user profile
         */
        service.getMyUserProfile = function () {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare http request object
            var req = {
                method: 'GET',
                url: config.REST_SERVICE_BASE_URL + '/users/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Update current user profile
         */
        service.updateMyUserProfile = function (user, userImage) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            var data = new FormData();
            data.append('user', angular.toJson(user));
            if (userImage) {
                data.append('profileImage', userImage);
            }
            // prepare request object
            var req = {
                method: 'PUT',
                url: config.REST_SERVICE_BASE_URL + '/users/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': undefined
                },
                data: data
            };
            $http(req).then(function (payload) {
                deferred.resolve(payload.data);
            }, function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        /**
         * Search users based on the given userSearchCriteria
         * Each key/value pairs in userSearchCriteria is passed as an query string parameter
         */
        service.search = function (criteria) {
            var deferred = $q.defer();
            var accessToken = storage.getSessionToken();
            // prepare request object
            var url = config.REST_SERVICE_BASE_URL + '/users?';
            url = url + 'businessId=' + criteria.businessId + '&pageSize=' + criteria.pageSize + '&pageNumber=' +
            criteria.pageNumber + '&sortBy=' + criteria.sortBy + '&sortOrder=' + criteria.sortOrder;
            // add roles
            angular.forEach(criteria.roles, function (role) {
                url = url + '&roles[]=' + role;
            });
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
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