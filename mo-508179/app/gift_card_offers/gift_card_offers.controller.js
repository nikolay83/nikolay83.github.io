(function () {
  'use strict';

  angular.module('app.gift_card_offers')
    .controller('giftCardOffersController', giftCardOffersController);

  giftCardOffersController.$inject = ['$http','$scope'];
  function giftCardOffersController($http, $scope) {
    var vm = this;

    // setup parameters for search controller
    $scope.orderBy = 'id';
    $scope.orderRevers = false;
    $scope.search = {};
    $scope.setOrder = setOrder;

    // get data
    getData();

    // declaration
    function getData(){
      $http.get('/data/GiftCardOffer.json')
        .success(function(data){
          var giftCardOffers = data;

          $http.get('/data/GiftCard.json')
            .success(function(data){
              angular.forEach(data, function(giftCard){
                for(var i = giftCardOffers.length - 1; i >= 0; i--){
                  var giftCardOffer = giftCardOffers[i];
                  if(giftCardOffer.businessId === giftCard.businessId){
                    if(!giftCardOffer.giftCards){
                      giftCardOffer.giftCards = [];
                      giftCardOffer.total = 0;
                    }
                    giftCard.id = giftCard._id;
                    giftCardOffer.giftCards.push(giftCard);
                    giftCardOffer.total += giftCard.quantity;
                  }
                }
              });
              giftCardOffers = _.filter(giftCardOffers, function(offer){
                return offer.total;
              });
              vm.giftCardOffers = giftCardOffers;
            });
        });
    }

    function setOrder(order) {
      $scope.orderBy = 'id';
      $scope.orderRevers = false;

      if (order) {
        switch (order.type) {
          case 'name-asc':
            $scope.orderBy = 'businessName';
            break;
          case 'name-desc':
            $scope.orderBy = 'businessName';
            $scope.orderRevers = true;
            break;
          case 'amount':
            $scope.orderBy = 'total';
            $scope.orderRevers = true;
            break;
        }
      }
    }
  }
})();