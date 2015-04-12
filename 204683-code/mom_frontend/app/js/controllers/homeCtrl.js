/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Home Controller
 * Changes in version 1.1:
 *  - Added the addToCard() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */

angular.module("app")
    .controller('homeCtrl', ['$scope', '$location', '$routeParams', 'DataService', 'GiftCardOfferService', 'BusinessService', '$timeout', 'NotificationService', "util", "storage",
        function ($scope, $location, $routeParams, DataService, GiftCardOfferService, BusinessService, $timeout, NotificationService, util, storage) {
            $scope.pause = false;
            $scope.check = false;
            $scope.Home = {};
            function initMaps() {
                // Check google maps api already loaded
                if ($('#google-maps-script').length) {
                    loadMap();
                    return;
                }

                // Map api load callback
                window.initializeGoogleMaps = function () {
                    delete window.initializeGoogleMaps;
                    loadMap();
                };

                // Load google maps api
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = 'google-maps-script';
                script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
                document.body.appendChild(script);
            }

            function loadMap() {
                var lat = 0,
                    lng = 0;

                if ($scope.detailGiftCardOffer && $scope.detailGiftCardOffer.coordinates) {
                    lat = $scope.detailGiftCardOffer.coordinates[0];
                    lng = $scope.detailGiftCardOffer.coordinates[1];
                }

                var mapPosition = new google.maps.LatLng(lat, lng);
                var mapCanvas = $('#map-canvas').get(0);
                var mapOptions = {
                    center: mapPosition,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map(mapCanvas, mapOptions);
                var marker = new google.maps.Marker({
                    position: mapPosition,
                    map: map
                });
            }

            // display view details
            var GetBusinessPromise = BusinessService.getBusiness;
            var GetGiftCardOfferCommentsPromise = GiftCardOfferService.getGiftCardOfferComments;
            $scope.display = false;
            $scope.showInfo = function (item) {
                $scope.detailGiftCardOffer = item;
                $scope.display = true;

                GetBusinessPromise(item.businessId).then(function (data) {
                    delete data.id;
                    angular.extend($scope.detailGiftCardOffer, data);

                    initMaps();

                    GetGiftCardOfferCommentsPromise(item.id).then(function (comments) {
                        $scope.detailGiftCardOffer.comments = comments;

                    }, function (comments) {
                    });

                }, function (data) {
                });
            };

            /**
             * Add the item to cart.
             * @param detailGiftCardOffer the given item to add
             */
            $scope.addToCard = function (detailGiftCardOffer) {
                storage.addItemToCart(detailGiftCardOffer);
                if (util.isLoggedIn()) {
                    $location.path('/ShoppingCart');
                } else {
                    $location.path('/Login');
                }
            };

            // close view details
            $scope.closeInfo = function () {
                $scope.display = false;
            };

            // add comment
            $scope.checkComment = function () {
                $scope.check = true;
            };

            var GiftCardOfferPromise = GiftCardOfferService.getAllGiftCardOffers;
            GiftCardOfferPromise(1, 12, $scope.search.name).then(function (data) {

                $scope.totalRecords = data.totalRecords;
                $scope.giftCardOffers = data.items;

                if (window.location.hash.indexOf('search') !== -1) {
                    $scope.Home.title = "Search Results";
                }
            }, function (data) {
            });

            var currentPageNum = 4;

            // infinite scroll
            $scope.loadMore = function () {

                if ($scope.giftCardOffers && $scope.giftCardOffers.length < $scope.totalRecords && !$scope.pause) {
                    $scope.pause = true;
                    $timeout(function () {
                        GiftCardOfferPromise(currentPageNum, 4, $scope.search.name).then(function (data) {
                            for (var i = 0; i < data.items.length; i++) {
                                $scope.giftCardOffers.push(data.items[i]);
                            }
                        }, function (data) {
                        });

                        currentPageNum += 1;
                        $scope.pause = false;
                    }, 800);
                }
            };

            var CreateGiftCardOfferCommentPromise = GiftCardOfferService.createGiftCardOfferComment;

            $scope.checkEnter = function ($event, comment) {
                if ($event.keyCode === 13) {
                    if (util.isLoggedIn()) {
                        var giftCardOfferId = $scope.detailGiftCardOffer.id;
                        var comment = $.trim($("#commentToAdd").val());
                        $("#commentToAdd").val("");
                        CreateGiftCardOfferCommentPromise(giftCardOfferId, comment).then(function (data) {
                            GetGiftCardOfferCommentsPromise(giftCardOfferId).then(function (comments) {
                                $scope.detailGiftCardOffer.comments = comments;

                            }, function (comments) {
                            });
                        }, function (data) {
                        });
                    } else {
                        $location.path('/Login');
                    }

                }
            };

            $scope.emailError = false;

            $scope.emailToFriend = function (friendEmail, offerId, offerTitle) {
                if (friendEmail && friendEmail.indexOf('@') > 1) {
                    if (util.isLoggedIn()) {
                        $scope.emailError = false;
                        var url = window.encodeURIComponent($location.absUrl()) + '?offerId=' + offerId;
                        var friendInvitation = {
                            "friendEmail": friendEmail,
                            "message": 'Come to this cool site: <a href="' + url + '">' + offerTitle + '</a>!'
                        };
                        NotificationService.invitations(friendInvitation).then(function (data) {
                            alert("Email has sent to " + friendEmail + " successfully!");
                        }, function (data) {
                            console.log(data);
                        });
                    } else {
                        $location.path('/Login');
                    }
                } else {
                    $scope.emailError = true;
                }
            };


            // Show giftCardOffer Detail if router params contains offerId
            if ($routeParams.offerId && $routeParams.offerId.length > 0) {

                GiftCardOfferService.getGiftCardOffer($routeParams.offerId).then(function (data) {

                    $scope.showInfo(data);

                }, function (data) {
                });
            }
        }
    ]);