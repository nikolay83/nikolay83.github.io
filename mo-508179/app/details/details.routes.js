(function () {
  'use strict';

  angular.module('app.details')
    .config(setDetailsRoute);

  setDetailsRoute.$inject = ['$stateProvider'];
  function setDetailsRoute($stateProvider) {
    $stateProvider
      .state('details', {
        url: '/details/:id',
        templateUrl: 'app/details/details.html',
        controller: 'detailsController',
        controllerAs: 'vm'
      });
  }
})();