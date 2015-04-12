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