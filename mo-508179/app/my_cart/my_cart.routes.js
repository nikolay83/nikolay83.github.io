(function () {
  'use strict';

  angular.module('app.my_cart')
    .config(setMyCartRoute);

  setMyCartRoute.$inject = ['$stateProvider'];
  function setMyCartRoute($stateProvider) {
    $stateProvider
      .state('my_cart', {
        url: '/my_cart',
        templateUrl: 'app/my_cart/my_cart.html',
        controller: 'myCartController',
        controllerAs: 'vm'
      });
  }
})();