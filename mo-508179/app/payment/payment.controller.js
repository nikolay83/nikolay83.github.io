(function () {
  'use strict';

  angular.module('app.payment')
    .controller('paymentController', paymentController)
    .controller('errorModalController', errorModalController);

  paymentController.$inject = ['$scope', '$modal', '$state'];
  function paymentController($scope, $modal, $state) {
    $scope.payNow = payNow;

    function payNow(){
      if(!$scope.cardNumber || !$scope.validDate || !$scope.cvv){
        var modalInstance = $modal.open({
          templateUrl: 'errorModal.html',
          controller: 'errorModalController'
        });
      } else {
        var modalInstance = $modal.open({
          templateUrl: 'app/partials/shareModal.html',
          controller: 'shareModalController'
        });
        modalInstance.result.then(function(){
          $state.go('gift_card_offers');
        });
      }
    }
  }

  errorModalController.$inject = ['$scope', '$modalInstance'];
  function errorModalController($scope, $modalInstance){
    $scope.cancel = cancel;
    $scope.contactSupport = contactSupport;

    function cancel(){
      $modalInstance.dismiss();
    }

    function contactSupport(){
      $modalInstance.close();
    }
  }
})();