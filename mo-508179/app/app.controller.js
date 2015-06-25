// App wide controller
(function () {
  'use strict';

  angular.module('MomMobileApp')
    .controller('search', searchController)
    .controller('shareModalController', shareModalController)
    .controller('errorShareModalController', errorShareModalController)
    .controller('successShareModalController', successShareModalController);

  searchController.$inject = ['$scope'];
  function searchController($scope){
    $scope.mode = 'order';
    $scope.orders = [
      {
        "type": "name-asc",
        "title": "A-Z"
      },
      {
        "type": "name-desc",
        "title": "Z-A"
      },
      {
        "type": "amount",
        "title": "Amount"
      }
    ];

    $scope.setMode = function (mode) {
      $scope.mode = mode;
      $scope.search.businessName = "";
      if (mode === 'searching') {
        setTimeout(function () {
          $('.search .input').focus();
        }, 0);
      } else if (mode === 'order') {
        $scope.setOrder($scope.order);
      }
    };

    $scope.checkEnter = function ($event) {
      if ($event.keyCode === 13) {
        $scope.doSearch();
      }
    };

    $scope.doSearch = function () {
      if ($scope.search) {
        $scope.doGiftCardSearch($scope.search);
      }
    };
  }

  shareModalController.$inject = ['$scope', '$modalInstance', '$modal'];
  function shareModalController($scope, $modalInstance, $modal){
    $scope.done = done;
    $scope.share = share;

    function done(){
      $modalInstance.close();
    }

    function share(socialMedia){
      if(socialMedia === 'facebook'){
        var modalInstance = $modal.open({
          templateUrl: 'app/partials/errorShareModal.html',
          controller: 'errorShareModalController'
        });
      } else {
        var modalInstance = $modal.open({
          templateUrl: 'app/partials/successShareModal.html',
          controller: 'successShareModalController'
        });
      }
    }
  }

  errorShareModalController.$inject = ['$scope', '$modalInstance'];
  function errorShareModalController($scope, $modalInstance){
    $scope.cancel = cancel;
    $scope.contactSupport = contactSupport;

    function cancel(){
      $modalInstance.dismiss();
    }

    function contactSupport(){
      $modalInstance.close();
    }
  }

  successShareModalController.$inject = ['$scope', '$modalInstance'];
  function successShareModalController($scope, $modalInstance){
    $scope.done = done;

    function done(){
      $modalInstance.close();
    }
  }
})();
