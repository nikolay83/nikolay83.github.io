(function () {
  'use strict';

  angular.module('app.my_cart')
    .controller('myCartController', myCartController);

  myCartController.$inject = ['$http', '$scope', '$state'];
  function myCartController($http, $scope, $state) {
    $scope.payNow = payNow;
    $http.get('/data/GiftCard.json')
      .success(function(data){
        $scope.giftCard = data[0];
        $scope.giftCard.activationDateTime = Date.now();
        $scope.giftCard.total = $scope.giftCard.quantity;
        $scope.giftCard.price = $scope.giftCard.total * $scope.giftCard.discount / 100;
      });

    function payNow(){
      $state.go('payment');
    }
  }
})();