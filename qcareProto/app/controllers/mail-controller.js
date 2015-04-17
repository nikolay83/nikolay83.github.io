(function (angular) {
  'use strict';
  angular.module('heritage').controller('MailCtrl', MailCtrl);
  
  MailCtrl.$inject = ['$state', 'CCMService'];
  function MailCtrl($state, CCMService) {
    var mailCtrl = this;
    
    mailCtrl.mail = {
      subject: 'Lorem Ipsum Report',
      text: undefined
    };
    
    mailCtrl.send = send;
    
    CCMService.getIDTMember($state.params.to).then(function(member) {
      mailCtrl.mail.to = member;
      mailCtrl.mail.subject = 'Hello ' + member.firstName;
    });
    
    
    function send() {
      $state.go('landing');
    }
    
  }
}(window.angular));