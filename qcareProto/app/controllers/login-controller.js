(function (angular) {
  'use strict';
  
  angular.module('heritage').controller('LoginCtrl', LoginCtrl);
  angular.module('heritage').controller('LoadingCtrl', LoadingCtrl);
  
  LoginCtrl.$inject = ['$rootScope', '$state', '$cookies'];
  function LoginCtrl($rootScope, $state, $cookies) {
    var loginCtrl = this;
    // Members
    $rootScope.user = undefined;
    loginCtrl.user = undefined;
    loginCtrl.password = undefined;
    loginCtrl.rememberMe = false;
    // Functions
    loginCtrl.doLogin = doLogin;
    
    //$state.go('home.loading');
    
    function doLogin(user, password) {
      // Dummy login function
      if (user === password) {
        $rootScope.user = user;
        if (loginCtrl.rememberMe) {
          $cookies.user = user;
        }
        $state.go('home.loading');
      }
    }
  }
  
  LoadingCtrl.$inject = ['$timeout', '$state'];
  function LoadingCtrl($timeout, $state) {
    var loadingCtrl = this;
    loadingCtrl.percent = 0;
    
    increase();
    
    function increase() {
      if (loadingCtrl.percent >= 100) {
        $state.go('landing');
      }
      else {
        loadingCtrl.percent += 5;
        $timeout(increase, 100);
      }
    }
  }
  
}(window.angular));