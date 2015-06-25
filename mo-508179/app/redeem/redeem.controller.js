(function () {
  'use strict';

  angular.module('app.redeem')
    .controller('redeemController', redeemController);

  redeemController.$inject = ['$stateParams', '$http', '$scope', '$modal', '$state'];
  function redeemController($stateParams, $http, $scope, $modal, $state) {
    $scope.done = done;
    $http.get('/data/GiftCard.json')
      .success(function(data){
        var giftCardData = data.filter(function(item){
          return item._id === $stateParams.id;
        });
        giftCardData = giftCardData[0];

        $scope.giftCard = giftCardData;
        var qrcode = new QRCode("qrimage", {
          text: giftCardData.qrCode,
          width: 180,
          height: 180,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      });

    function done(){
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