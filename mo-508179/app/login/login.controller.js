(function () {
  'use strict';

  angular.module('app.login')
    .controller('loginController', loginController);

  loginController.$inject = ['$scope', '$state'];
  function loginController($scope, $state) {
    $scope.login = login;

    function login(){
       $state.go('my_cart');
    }
  }
})();