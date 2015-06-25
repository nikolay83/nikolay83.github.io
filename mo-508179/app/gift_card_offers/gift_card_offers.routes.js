(function () {
  'use strict';

  angular.module('app.gift_card_offers')
    .config(setGiftCardOffersRoute);

  setGiftCardOffersRoute.$inject = ['$stateProvider'];
  function setGiftCardOffersRoute($stateProvider) {
    $stateProvider
      .state('gift_card_offers', {
        url: '/gift_card_offers',
        templateUrl: 'app/gift_card_offers/gift_card_offers.html',
        controller: 'giftCardOffersController',
        controllerAs: 'vm'
      });
  }
})();