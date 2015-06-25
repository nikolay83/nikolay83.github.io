(function () {
  'use strict';

  angular.module('app.how_it_works')
    .config(setHowItWorksRoute);

  setHowItWorksRoute.$inject = ['$stateProvider'];
  function setHowItWorksRoute($stateProvider) {
    $stateProvider
      .state('how_it_works', {
        url: '/how_it_works',
        templateUrl: 'app/how_it_works/how_it_works.html',
        controller: 'howItWorksController',
        controllerAs: 'vm'
      });
  }
})();