(function (angular){
  'use strict';
  
  angular.module('heritage').controller('MedInterCtrl', MedInterCtrl);
  
  MedInterCtrl.$inject = ['$state', 'CCMService'];
  function MedInterCtrl($state, CCMService) {
    var medInterCtrl = this;
    medInterCtrl.med = undefined;
    
    
    CCMService.getMedication($state.params.medId).then(function (med) {
      medInterCtrl.med = med;
    });
  }
  
}(window.angular));