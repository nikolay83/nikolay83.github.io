(function () {
  'use strict';

  angular.module('app.gifting')
    .config(setGiftingRoute);

  setGiftingRoute.$inject = ['$stateProvider'];
  function setGiftingRoute($stateProvider) {
    $stateProvider
      .state('gifting', {
        url: '/gifting/:id',
        templateUrl: 'app/gifting/gifting.html',
        controller: 'giftingController',
        controllerAs: 'vm'
      });
  }
})();