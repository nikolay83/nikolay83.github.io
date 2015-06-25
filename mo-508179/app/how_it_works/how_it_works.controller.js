(function () {
  'use strict';

  angular.module('app.how_it_works')
    .controller('howItWorksController', howItWorksController);

  howItWorksController.$inject = ['$state'];
  function howItWorksController($state) {
    var vm = this;

    vm.filepath = $state.current.templateUrl;
  }
})();