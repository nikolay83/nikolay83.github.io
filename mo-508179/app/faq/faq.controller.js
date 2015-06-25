(function () {
  'use strict';

  angular.module('app.faq')
    .controller('fAQController', fAQController);

  fAQController.$inject = ['$state'];
  function fAQController($state) {
    var vm = this;

    vm.filepath = $state.current.templateUrl;
  }
})();