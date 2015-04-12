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