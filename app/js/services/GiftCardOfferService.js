/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Gift Card Offer Service.
 *
 * Changes in version 1.1:
 *  - Added purchase() method.
 *
 * @version 1.1
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
             * Purchase.
             *
             * @param giftCardOffer the gift card offer entity.
             */
            purchase: function (giftCardOffer) {
                var deferred = $q.defer();
                var accessToken = storage.getSessionToken();
                $http({
                    method: 'POST',
                    url: config.REST_SERVICE_BASE_URL + '/giftCards',
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