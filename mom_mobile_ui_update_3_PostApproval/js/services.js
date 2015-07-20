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
