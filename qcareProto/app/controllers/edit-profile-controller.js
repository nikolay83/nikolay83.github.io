(function (angular) {
  'use strict';
  
  angular.module('heritage').controller('EditProfileCtrl', EditProfileCtrl);
  
  EditProfileCtrl.$inject = ['$state', '$rootScope', 'CCMService'];
  function EditProfileCtrl($state, $rootScope, CCMService) {
    var editProfileCtrl = this;
    var _member;
    editProfileCtrl.takePic = false;
    editProfileCtrl.accStatus = {};
    
    $rootScope.profile = {
      save: save
    };
    
    CCMService.getMember().then(function(member) {
      _member = member;
      editProfileCtrl.patient = angular.copy(member);
    });
    

    editProfileCtrl.handlePicture = handlePicture;
    
    
    function handlePicture(pictureData) {
      
      editProfileCtrl.takePic = false;
    }
    
    function save() {
      _member.firstName = editProfileCtrl.patient.firstName;
      _member.lastName = editProfileCtrl.patient.lastName;
      _member.gender = editProfileCtrl.patient.gender;
      _member.dob = editProfileCtrl.patient.dob;
      _member.address = angular.copy(editProfileCtrl.patient.address);
      _member.homePhone = editProfileCtrl.patient.homePhone;
      _member.mobilePhone = editProfileCtrl.patient.mobilePhone;
      _member.email = editProfileCtrl.patient.email;
      $state.go('landing');
    }
    
    
  }
  
}(window.angular));