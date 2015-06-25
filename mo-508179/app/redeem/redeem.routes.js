(function () {
  'use strict';

  angular.module('app.redeem')
    .config(setRedeemRoute);

  setRedeemRoute.$inject = ['$stateProvider'];
  function setRedeemRoute($stateProvider) {
    $stateProvider
      .state('redeem', {
        url: '/redeem/:id',
        templateUrl: 'app/redeem/redeem.html',
        controller: 'redeemController',
        controllerAs: 'vm'
      });
  }
})();