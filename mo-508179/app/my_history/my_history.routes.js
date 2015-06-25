(function () {
  'use strict';

  angular.module('app.my_history')
    .config(setMyHistoryRoute);

  setMyHistoryRoute.$inject = ['$stateProvider'];
  function setMyHistoryRoute($stateProvider) {
    $stateProvider
      .state('my_history', {
        url: '/my_history',
        templateUrl: 'app/my_history/my_history.html',
        controller: 'myHistoryController',
        controllerAs: 'vm'
      });
  }
})();