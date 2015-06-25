(function () {
  'use strict';

  angular.module('app.gifting')
    .controller('giftingController', giftingController);

  giftingController.$inject = ['$stateParams', '$scope', '$modal', '$state'];
  function giftingController($stateParams, $scope, $modal, $state) {
    var giftCardId = $stateParams.id;
    $scope.giftNow = giftNow;

    function giftNow(){
      var modalInstance = $modal.open({
        templateUrl: 'app/partials/shareModal.html',
        controller: 'shareModalController'
      });
      modalInstance.result.then(function(){
        $state.go('my_founder_shares');
      });
    }
  }
})();