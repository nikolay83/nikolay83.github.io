/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Payment controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("paymentCtrl",['$scope', '$routeParams', 'GiftCardOfferService', 'storage', '$rootScope', 'BusinessService', function($scope, $routeParams, GiftCardOfferService, storage, $rootScope, BusinessService){

        var purpose = $routeParams.purpose;

        var currentYear = new Date().getFullYear();
        $scope.number = '';
        $scope.verification = '';
        $scope.years = [];
        for (var i = currentYear; i< currentYear+15; i++) {
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
        };
        $scope.select_month = {
            name: 'month',
            value: 'month'
        };
        $scope.closeModal = function(){
            $scope.modal = false;
        };


        /**
         * Pay the payment.
         */
        $scope.pay = function() {
            $scope.submitted = false;
            if ($scope.number.length !== 15 && $scope.number.length !== 16) {
                $scope.submitted = true;
                return;

            }

            if ($scope.verification.length !== 3 && $scope.verification.length !== 4) {
                $scope.submitted = true;
                return;
            }

            if ($scope.select_month.name === 'month' || $scope.select_year.name === 'year') {
                $scope.submitted = true;
                return;
            }




            if (purpose == 'business') {
                // verify business
                var profile = storage.getCurrentUserProfile();
                BusinessService.verify(profile.firstName, profile.lastName, {creditCardNumber: $scope.number,
                    verificationCode: $scope.verification,
                    expirationMonth: $scope.select_month.name + '',
                    expirationYear: $scope.select_year.name + '',
                    cardHolderName: profile.firstName + ' ' + profile.lastName
                }).then(function (data) {
                        $scope.modal = true;
                    }, function (reason) {
                        console.log(reason);
                        alert("Failed to verify: "+reason.error);
                    });
            } else if (purpose === 'shoppingcart') {
                // purchase shopping cart
                var tmp = storage.getItemFromCart();
                for (var i=0; i<tmp.length; i++) {
                    tmp[i].giftCardOfferId = tmp[i].id;
                    if ($rootScope.prices && $rootScope.prices.length > 0) {
                        tmp[i].quantity = $rootScope.prices[i];
                    } else {
                        tmp[i].quantity = 0;
                    }
                }

                var creditCard = {creditCardNumber: $scope.number,
                    verificationCode: $scope.verification,
                    expirationMonth: $scope.select_month.name,
                    expirationYear: $scope.select_year.name

                };
                GiftCardOfferService.purchase({items: tmp, creditCard: creditCard}).then(function (data) {
                    $scope.modal = true;
                }, function (reason) {
                    console.log(reason);
                    alert("Failed to bill: "+reason.error);
                });

            }
        };
    }]);