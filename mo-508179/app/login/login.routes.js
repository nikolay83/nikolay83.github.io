(function () {
  'use strict';

  angular.module('app.login')
    .config(setLoginRoute);

  setLoginRoute.$inject = ['$stateProvider'];
  function setLoginRoute($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
      });
  }
})();