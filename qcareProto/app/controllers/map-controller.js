(function (angular) {
  'use strict';
  
  angular.module('heritage').controller('MapCtrl', MapCtrl);
  
  angular.module('heritage')
    .config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
      GoogleMapApi.configure({
        //key: 'your api key',
        v: '3.17',
        libraries: 'places' //required for SearchBox
      });
    }]);
  
  MapCtrl.$inject = ['$scope', '$log', 'geolocation'];
  function MapCtrl($scope, $log, geolocation) {
    var mapCtrl = this;
    
    mapCtrl.noLocation = function () {
        $scope.loc.request = false;
        $scope.loc.refresh = true;
        mapCtrl.markers = [
        {
          latitude: 40.743415,
          longitude: -74.003147,
          title: 'Care Center Name',
          addr: 'Lorem Ipsum st. 123 building. State',
          phone: '555-123-456',
          id: 1,
          icon: 'i/marker.png',
          show: false
        },
        {
          latitude: 40.744770,
          longitude: -74.007996,
          title: 'Care Center Name',
          addr: 'Lorem Ipsum st. 123 building. State',
          phone: '555-123-456',
          id: 2,
          icon: 'i/marker.png',
          show: false
        },
        {
          latitude: 40.743740,
          longitude: -73.999547,
          title: 'Care Center Name',
          addr: 'Lorem Ipsum st. 123 building. State',
          phone: '555-123-456',
          id: 3,
          icon: 'i/marker.png',
          show: false
        },
        {
          latitude: 40.741072,
          longitude: -74.003484,
          title: 'Care Center Name',
          addr: 'Lorem Ipsum st. 123 building. State',
          phone: '555-123-456',
          id: 4,
          icon: 'i/marker.png',
          show: false
        }
        ];
        angular.forEach(mapCtrl.markers, function(marker) {
          marker.onClick = function() {
            marker.show = !marker.show;
          };
        });
        mapCtrl.map.center = {latitude: 40.742905, longitude: -74.002257 };
      };
    
      mapCtrl.getLocation = function () {
        geolocation.getLocation().then(function (data) {
          //mapCtrl.coords = {lat: data.coords.latitude, long : data.coords.longitude};
          //$log.info(mapCtrl.coords);
          $scope.loc.request = false;
          mapCtrl.marker.show = true;
          mapCtrl.marker.coords = data.coords;
          mapCtrl.markers = [];
          mapCtrl.markers = [
            {
              latitude:  data.coords.latitude + 0.0005,
              longitude: data.coords.longitude,
              title: 'Care Center Name',
              addr: 'Lorem Ipsum st. 123 building. State',
              phone: '555-123-456',
              id: 1,
              icon: 'i/marker.png',
              show: false
            },
            {
              latitude: data.coords.latitude - 0.0007,
              longitude: data.coords.longitude - 0.0006,
              title: 'Care Center Name',
              addr: 'Lorem Ipsum st. 123 building. State',
              phone: '555-123-456',
              id: 2,
              icon: 'i/marker.png',
              show: false
            },
            {
              latitude: data.coords.latitude - 0.0008,
              longitude: data.coords.longitude - 0.0007,
              title: 'Care Center Name',
              addr: 'Lorem Ipsum st. 123 building. State',
              phone: '555-123-456',
              id: 3,
              icon: 'i/marker.png',
              show: false
            },
            {
              latitude: data.coords.latitude + 0.0008,
              longitude: data.coords.longitude - 0.0004,
              title: 'Care Center Name',
              addr: 'Lorem Ipsum st. 123 building. State',
              phone: '555-123-456',
              id: 4,
              icon: 'i/marker.png',
              show: false
            }
          ];
          angular.forEach(mapCtrl.markers, function(marker) {
            marker.onClick = function() {
              marker.show = !marker.show;
            };
          });
          mapCtrl.map.center = data.coords;
          $scope.loc.refresh = true;
        });
      };
    
      $scope.$on('error', function (evt, data) {
        $scope.loc.request = false;
        mapCtrl.marker.show = false;
      });
    
      mapCtrl.windowOptions = {
          visible: false
      };

      mapCtrl.onClick = function() {
          //mapCtrl.windowOptions.visible = !mapCtrl.windowOptions.visible;
      };

      mapCtrl.closeClick = function() {
          //mapCtrl.windowOptions.visible = false;
      };

      
      mapCtrl.map = {center: {latitude: 40.742905, longitude: -74.002257 }, zoom: 16 };
      mapCtrl.options = {scrollwheel: false, panControl: false, streetViewControl: false, scaleControl: false, overviewMapControl: false, zoomControl: false, mapTypeControl: false};
      mapCtrl.searchbox = { template: 'searchbox.tpl.html', position : 'top-left'};
    
      mapCtrl.marker = {
        id: 0,
        coords: {
          latitude: 40.742905,
          longitude: -74.002257
        },
        options: { draggable: false },
        icon: 'i/home.png',
        show: false
      };
      mapCtrl.markers = [];
  }
  
}(window.angular));