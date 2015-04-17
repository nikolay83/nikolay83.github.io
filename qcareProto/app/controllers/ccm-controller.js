(function (angular) {
  'use strict';
  
  angular.module('heritage').controller('CCMCtrl', CCMCtrl);
  
  CCMCtrl.$inject = ['CCMService'];
  function CCMCtrl(CCMService) {
    var ccmCtrl = this;
    ccmCtrl.accStatus = {};
    ccmCtrl.member = undefined;
    ccmCtrl.user = undefined;
    ccmCtrl.showDetails = false;
    
    ccmCtrl.critValueOk = critValueOk;
    ccmCtrl.getPercent = getPercent;
    ccmCtrl.getPercentGoal = getPercentGoal;
    
    CCMService.getMember().then(function(member) {
      ccmCtrl.member = member;
    });
    CCMService.getUser().then(function(user) {
      ccmCtrl.user = user;
    });
    
    function critValueOk(crit) {
      switch(crit.goal.type) {
          case '=':
            return crit.value === crit.goal.value;
          case '<':
            return crit.value < crit.goal.value;
          case '>':
            return crit.value < crit.goal.value;
          case '=<':
          case '<=':
            return crit.value <= crit.goal.value;
          case '=>':
          case '>=':
            return crit.value >= crit.goal.value;
      }
    }
    
    function getPercent(crit) {
      return (((crit.value - crit.goal.min) / (crit.goal.max - crit.goal.min)) * 100) + '%';
    }
    function getPercentGoal(crit) {
      return (((crit.goal.value - crit.goal.min) / (crit.goal.max - crit.goal.min)) * 100) + '%';
    }
  }
  
}(window.angular));