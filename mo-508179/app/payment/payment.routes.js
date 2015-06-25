(function () {
  'use strict';

  angular.module('app.payment')
    .config(setPaymentRoute);

  setPaymentRoute.$inject = ['$stateProvider'];
  function setPaymentRoute($stateProvider) {
    $stateProvider
      .state('payment', {
        url: '/payment',
        templateUrl: 'app/payment/payment.html',
        controller: 'paymentController',
        controllerAs: 'vm'
      });
  }
})();