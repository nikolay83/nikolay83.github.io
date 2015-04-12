/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken storage and retrieval
 *
 * Changes in version 1.1:
 *  - Added shopping cart related functions.
 *
 * @version 1.1
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
         * Added shopping item to cart.
         * @param item the shopping item.
         */
        service.addItemToCart = function (item) {
            var storedItem = sessionStorage.getItem('momandpop.cart.item');
            if (!storedItem) {
                storedItem = [];
            } else {
                storedItem = angular.fromJson(storedItem);
            }

            var flag = true;
            for (var i=0; i<storedItem.length; i++) {
                if (storedItem[i].businessId === item.businessId) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                storedItem.push(item);
            }

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
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
            var key = -1;
            for (var i=0; i<storedItem.length; i++) {
                if (storedItem[i].businessId === id) {
                    key = i;
                }
            }

            if (key !== -1) {
                storedItem.splice(key, 1);
            }

            sessionStorage.setItem('momandpop.cart.item', angular.toJson(storedItem));
        };

        /**
         * Utility method to clear the sessionStorage
         */
        service.clear = function () {
            sessionStorage.removeItem('momandpop.auth.token');
            sessionStorage.removeItem('momandpop.auth.actions');
            sessionStorage.removeItem('momandpop.auth.profile');
            sessionStorage.removeItem('momandpop.cart.item');

            localStorage.removeItem('momandpop.auth.token');
            localStorage.removeItem('momandpop.auth.actions');
            localStorage.removeItem('momandpop.auth.profile');
        };
        return service;
    }]);