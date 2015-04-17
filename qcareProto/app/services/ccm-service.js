(function (angular) {
  'use strict';
  
  angular.module('heritage').factory('CCMService', CCMService);
  
  CCMService.$inject = ['$http', '$q'];
  function CCMService($http, $q) {
    var ccmService = {
      getMember: getMember,
      getIDTMember: getIDTMember,
      getMedication: getMedication,
      getUser: getUser
    },
      dataProm = $q.defer(),
      initDone = false;
    
    function toDate(obj, field) {
      if(angular.isArray(obj)) {
        angular.forEach(obj, function(elt) {
          elt[field] = elt[field] ? new Date(elt[field]) : undefined;
        })
      } else {
        obj[field] = obj[field] ? new Date(obj[field]) : undefined;
      }
    }
    
    function init() {
      initDone = true;
      $http.get('./app/data/data.json').success(function getData(data) {
        toDate(data.member, 'dob');
        toDate(data.member.eligibily, 'from');
        toDate(data.member.eligibily, 'to');
        toDate(data.member.assignedTeamMembers, 'assignedDate');
        toDate(data.member.recommendedProgram, 'enrollDate');
        toDate(data.member.outstandingTasks, 'assignedDate');
        toDate(data.member.outstandingTasks, 'followUpDate');
        toDate(data.member.carePlan, 'ccmEnrolled');
        toDate(data.member.carePlan.clinicalProfile.recentCriticalEvent, 'date');
        toDate(data.member.carePlan.clinicalProfile.recentCriticalEvent, 'visitType');
        toDate(data.member.carePlan.clinicalProfile.recentCriticalEvent, 'visitDate');
        toDate(data.member.carePlan.clinicalProfile.reconciledMedications, 'startDate');
        toDate(data.member.carePlan.clinicalProfile.reconciledMedications, 'endDate');
        toDate(data.member.carePlan.signature, 'date');
        toDate(data.member.diceaseMngt.reconsiledMedication, 'verifiedDate');
        toDate(data.member.diceaseMngt.reconsiledMedication, 'createdDate');
        toDate(data.member.diceaseMngt.followUpPlans, 'date');
        toDate(data.member.diceaseMngt.openItems, 'date');
        toDate(data.member.diceaseMngt.history, 'date');
        toDate(data.user, 'date');

        dataProm.resolve(data);
        return dataProm.promise;
      });
    }
    
    function getData() {
      if (!initDone) {
        init();
      }
      return dataProm.promise;
    }
    
    function getMember() {
      return getData().then(function (data) {
        return data.member;
      });
    }
    
    function getIDTMember(memberId) {
      return getData().then(function (data) {
        return data.teamMembers[memberId];
      });
    }
    
    function getMedication(medId) {
      return getData().then(function (data) {
        return data.medications[medId];
      });
    }
    
    function getUser() {
      return getData().then(function (data) {
        return data.user;
      });
    }
    return ccmService;
  }

}(window.angular));