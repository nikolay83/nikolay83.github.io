(function () {
  'use strict';

  angular.module('app.faq')
    .config(setFAQRoute);

  setFAQRoute.$inject = ['$stateProvider'];
  function setFAQRoute($stateProvider) {
    $stateProvider
      .state('faq', {
        url: '/faq',
        templateUrl: 'app/faq/faq.html',
        controller: 'fAQController',
        controllerAs: 'vm'
      });
  }
})();