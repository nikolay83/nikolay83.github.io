/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Wordpress controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("wordpressCtrl", ['$scope', 'config', '$sce', function($scope, config, $sce){

        /**
         * Get the url for how it works.
         * @returns the url
         */
        $scope.howItWorksUrl = function() {
            return $sce.trustAsResourceUrl(config.HOW_IT_WORKS_URL);
        };
        /**
         * Get the url for terms and conditions.
         * @returns the url
         */
        $scope.termsAndConditionsUrl = function() {
            return $sce.trustAsResourceUrl(config.TERMS_AND_CONDITIONS_URL);
        };
        /**
         * Get the url for about page.
         * @returns the url
         */
        $scope.aboutUrl = function() {
            return $sce.trustAsResourceUrl(config.ABOUT_URL);
        };
        /**
         * Get the url for forums.
         * @returns the url
         */
        $scope.forumsUrl = function() {
            return $sce.trustAsResourceUrl(config.FORUMS_URL);
        };
        /**
         * Get the url for blog.
         * @returns the url
         */
        $scope.blogUrl = function() {
            return $sce.trustAsResourceUrl(config.BLOG_URL);
        };
        /**
         * Get the url for FAQ.
         * @returns the url
         */
        $scope.faqUrl = function() {
            return $sce.trustAsResourceUrl(config.FAQ_URL);
        };
        /**
         * Get the url for copyright.
         * @returns the url
         */
        $scope.copyrightUrl = function() {
            return $sce.trustAsResourceUrl(config.COPYRIGHT_URL);
        };
        /**
         * Get the url for privacy policy.
         * @returns the url
         */
        $scope.privacyPolicyUrl = function() {
            return $sce.trustAsResourceUrl(config.PRIVACY_POLICY_URL);
        };
    }]);