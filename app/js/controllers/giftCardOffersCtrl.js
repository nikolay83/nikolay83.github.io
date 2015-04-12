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