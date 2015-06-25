(function () {
  'use strict';

  angular.module('app.details')
    .controller('detailsController', detailsController)
    .controller('sharePopupController', sharePopupController)
    .controller('addToCartModalController', addToCartModalController);

  detailsController.$inject = ['$http', '$scope', '$stateParams', '$state', '$modal'];
  function detailsController($http, $scope, $stateParams, $state, $modal) {
    $scope.openShareModal = openShareModal;
    $scope.openLoginNowModal = openLoginNowModal;

    if($stateParams.id === ''){
      $state.go('gift_card_offers');
      return;
    }
    getGiftCardDetail($stateParams.id);

    // functions declaration
    function openShareModal(){
      var modalInstance = $modal.open({
        animation: false,
        size: 'lg',
        templateUrl: 'shareModal.html',
        controller: 'sharePopupController',
        windowClass: 'nav-popup'
      });
    }

    function openLoginNowModal(){
      var modalInstance = $modal.open({
        templateUrl: 'loginNowModal.html',
        controller: 'addToCartModalController'
      });
    }

    function getGiftCardDetail(giftCardId) {
      $http.get('/data/GiftCard.json')
        .success(function(data){
          var giftCardData = data.filter(function(item){
            return item._id === giftCardId;
          });
          giftCardData = giftCardData[0];
          $scope.giftCard = giftCardData;

          $http.get('/data/Business.json')
            .success(function(data){
              var businessData = data.filter(function(item){
                return item._id === giftCardData.businessId;
              });
              businessData = businessData[0];

              $scope.business = businessData;

              if(businessData.businessHours){
                $scope.businessHours = businessData.businessHours;
              } else {
                $scope.businessHours = '00:00 - 00:00';
              }

              initMaps();
            });
        });
    }

    function initMaps() {
      // Check google maps api already loaded
      if ($('#google-maps-script').length) {
        loadMap();
        return;
      }

      // Map api load callback
      window.initializeGoogleMaps = function () {
        delete window.initializeGoogleMaps;
        loadMap();
      };

      // Load google maps api
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'google-maps-script';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
      document.body.appendChild(script);
    }

    function loadMap() {
      var lat = 0,
        lng = 0;

      if ($scope.business && $scope.business.coordinates) {
        lat = $scope.business.coordinates[0];
        lng = $scope.business.coordinates[1];
      }

      var mapPosition = new google.maps.LatLng(lat, lng);
      var mapCanvas = $('.map-canvas').get(0);
      var mapOptions = {
        center: mapPosition,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(mapCanvas, mapOptions);
      var marker = new google.maps.Marker({
        position: mapPosition,
        icon: 'assets/i/marker.png',
        map: map
      });
    }
  }

  sharePopupController.$inject = ['$scope', '$modalInstance', '$location'];
  function sharePopupController($scope, $modalInstance, $location){
    $scope.share = share;
    $scope.shareUrl = $location.absUrl();

    function share(){
      $modalInstance.close();
    }
  }

  addToCartModalController.$inject = ['$scope', '$modalInstance', '$state'];
  function addToCartModalController($scope, $modalInstance, $state){
    $scope.cancel = cancel;
    $scope.login = login;

    function cancel(){
      $modalInstance.dismiss();
    }

    function login(){
      $modalInstance.close();
      $state.go('login');
    }
  }
})();