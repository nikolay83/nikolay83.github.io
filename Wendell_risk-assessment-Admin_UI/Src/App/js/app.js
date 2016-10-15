/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * The main application entry
 *
 * * Changes in 1.1:
 *  - added new dependency
 * @author veshu
 * @version 1.1
 */

(function () {
    'use strict';

    var app = angular.module('app', ['ngAnimate', 'ngRoute', 'ngSanitize', 'ngFileSaver',
        'angularMoment', 'ngMultiSelect.directive', 'angularUtils.directives.dirPagination']);

    // Initialize the main module
    app.run(['$rootScope', '$location', '$window', '$log', 'storage', 'config', 'util',
        function ($rootScope, $location, $window, $log, storage, config, util) {

            //keep temporary data between controllers
            $rootScope.tmp = {};
            $rootScope.location = $location;
            $rootScope.config = config;
            $rootScope.goto = function (path) {
                if (path === 'back') { // Allow a 'back' keyword to go to previous page
                    $window.history.back();
                } else { // Go to the specified path
                    $location.path(path);
                }
            };

            /**
             * Get homepage URL based on role
             * @return {String} the URL
             */
            $rootScope.getHome = function () {
                if (!util.isLoggedIn()) {
                    return "/login";
                }
                return '/home';
            };

            $rootScope.$on('$routeChangeStart', function (e, target) {
                var route = target.$$route;
                if (!route) {
                    return;
                }
                if (!$rootScope.tmp) {
                    $rootScope.tmp = {};
                }
                if (route.originalPath !== '/login') {
                    $rootScope.tmp.redirectUrl = route.originalPath;
                }

                if (route.originalPath === '/login' && util.isLoggedIn()) {
                    $location.path($rootScope.getHome());
                }
                if (route.isPublic) {
                    return;
                }

                if (!util.isLoggedIn()) {
                    $location.path('/login');
                    return;
                }

                if (!route.roles) {
                    return;
                }
                var hasAccess = _.any(route.roles, util.isUserInRole);
                if (!hasAccess) {
                    $rootScope.tmp.redirectUrl = null;
                    $location.path($rootScope.getHome());
                }
            });
            $rootScope.$on('$routeChangeSuccess',  function () {
                $rootScope.path = $location.path();
                $rootScope.bodyClass = $rootScope.path === '/login' ? 'login-page' : '';
                $rootScope.getCounts();
            });
            if (!util.isLoggedIn()) {
                storage.clear();
            } else {
                $rootScope.user = storage.getCurrentUserProfile();
            }
        }]);
    app.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|blob):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    });
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
            };
        });
    }]);
    app.config(["$routeProvider", 'config',
        function ($routeProvider, config) {
            var urlBase = "partials/";
            $routeProvider.when('/login', {
                templateUrl: urlBase + 'login.html',
                controller: 'loginCtrl',
                isPublic: true
            }).when('/home', {
                templateUrl: urlBase + 'home.html',
                controller: 'homeCtrl',
                roles: [config.ROLES.OWNER_ROLE_NAME, config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME,
                    config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME,
                    config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME]
            }).when('/addAssessment', {
                templateUrl: urlBase + 'addAssessment.html',
                controller: 'addAssessmentCtrl',
                roles: [config.ROLES.OWNER_ROLE_NAME]
            }).when('/editAssessment/:id', {
                templateUrl: urlBase + 'editAssessment.html',
                controller: 'editAssessmentCtrl',
                roles: [config.ROLES.OWNER_ROLE_NAME, config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME,
                    config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME,
                    config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME]
            }).when('/assessments/:type', {
                templateUrl: urlBase + 'assessments.html',
                controller: 'assessmentsCtrl',
                roles: [config.ROLES.OWNER_ROLE_NAME, config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME,
                    config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME,
                    config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME]
            }).when('/assessmentDetails/:id', {
                templateUrl: urlBase + 'assessmentDetail.html',
                controller: 'assessmentDetailsCtrl',
                roles: [config.ROLES.OWNER_ROLE_NAME, config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME,
                    config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME,
                    config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME]
            }).otherwise({
                redirectTo: '/login'
            });
        }]);
})();
