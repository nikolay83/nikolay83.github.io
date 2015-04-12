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
