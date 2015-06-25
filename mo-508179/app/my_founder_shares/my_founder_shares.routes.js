(function () {
  'use strict';

  angular.module('app.my_founder_shares')
    .config(setMyFounderSharesRoute);

  setMyFounderSharesRoute.$inject = ['$stateProvider'];
  function setMyFounderSharesRoute($stateProvider) {
    $stateProvider
      .state('my_founder_shares', {
        url: '/my_founder_shares',
        templateUrl: 'app/my_founder_shares/my_founder_shares.html',
        controller: 'myFounderSharesController',
        controllerAs: 'vm'
      });
  }
})();