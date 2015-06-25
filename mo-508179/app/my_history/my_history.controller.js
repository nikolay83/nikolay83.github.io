(function () {
  'use strict';

  angular.module('app.my_history')
    .controller('myHistoryController', myHistoryController);

  myHistoryController.$inject = ['$scope', '$http'];
  function myHistoryController($scope, $http) {
    $scope.historyList = [];
    getData();

    function getData(){
      $http.get('/data/ActionRecord.json')
        .success(function(data){
          $scope.historyList = data;
        });
    }
  }
})();