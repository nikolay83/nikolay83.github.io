
(function (angular) {
  'use strict';
  
  angular.module('heritage', ['ui.bootstrap', 'google-maps'.ns(), 'geolocation', 'ui.bootstrap.popover', 'ui.bootstrap.tooltip', 'ngCookies', 'ui.router', 'omr.directives']);
    
  angular.module('heritage')
    .controller('mainCtrl', function ($scope, $log, geolocation) {
      $scope.popTitle = "abcd";
      $scope.fontSize = 'normal';
      $scope.fontSizeOpen = false;
      $scope.notifOpen = false;
      $scope.loc = {
        request: true,
        refresh: false
      };

    });
  
  angular.module('heritage').config(RoutesConfig);
  angular.module('heritage').run(Init);
  
  RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function RoutesConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('home',  {
      url: '/',
      templateUrl: 'anonymous.tpl.html',
      data: {
        gradient: true,
        logo: true,
        hasHeader: false,
        hasFooter: true
      }
    });
    
    $stateProvider.state('home.splash',  {
      views: {
        'content': {
          templateUrl: 'splashScreen.tpl.html',
          controller: ['$timeout', '$state', function($timeout, $state) {
            $timeout(toLogin, 2000);
            function toLogin() {
              $state.go('home.login');
            }
          }]
        }
      }
    });
    
    $stateProvider.state('home.login', {
      views: {
        'content': {
          templateUrl: 'app/templates/login-form.tpl.html',
          controller: 'LoginCtrl',
          controllerAs: 'loginCtrl'
        }
      }
    });
    
    $stateProvider.state('home.map', {
      views: {
        'content': {
          templateUrl: 'app/templates/map.tpl.html',
          controller: 'MapCtrl',
          controllerAs: 'mapCtrl'
        }
      },
      data: {
        logo: false,
        showFooterLogo: true
      }
    });
    
    $stateProvider.state('home.loading', {
      views: {
        'content': {
          templateUrl: 'app/templates/loader.tpl.html',
          controller: 'LoadingCtrl',
          controllerAs: 'loadingCtrl'
        }
      }
    });
    
    $stateProvider.state('loggedIn', {
      abstract: true,
      templateUrl: 'loggedIn.tpl.html',
      views: {
        '': {
          templateUrl: 'app/templates/loggedIn.tpl.html',
        },
        'notifications@loggedIn': {
          templateUrl: 'app/templates/notifications.tpl.html',
          controller: 'NotificationCtrl',
          controllerAs: 'notifCtrl'
        }
      },
      data: {
        hasHeader: true,
        hasFooter: true
      }
    });
    
    $stateProvider.state('landing', {
      parent: 'loggedIn',
      url: '^/landing',
      views: {
        'content': {
          templateUrl: 'app/templates/landing.tpl.html'
        }
      },
      data: {
        showFooterLogo: true
      }
    });
    
    $stateProvider.state('ccm', {
      parent: 'loggedIn',
      url: '^/ccm',
      data: {
        title: 'Member Summary',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/ccm.tpl.html',
          controller: 'CCMCtrl',
          controllerAs: 'ccmCtrl'
        }
      }
    });
    $stateProvider.state('ccm.careplan', {
      parent: 'loggedIn',
      url: '^/ccm-care-plan',
      data: {
        title: 'Member Care Plan',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/ccm-care-plan.tpl.html',
          controller: 'CCMCtrl',
          controllerAs: 'ccmCtrl'
        }
      }
    });
    $stateProvider.state('ccm.dicease', {
      parent: 'loggedIn',
      url: '^/dicease-management',
      data: {
        title: 'Dicease Mgt',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/dicease-mngt.tpl.html',
          controller: 'CCMCtrl',
          controllerAs: 'ccmCtrl'
        }
      }
    });
    $stateProvider.state('med', {
      parent: 'loggedIn',
      url: '^/med',
      data: {
        title: 'Med Reconciliation',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/med.tpl.html',
          controller: 'CCMCtrl',
          controllerAs: 'ccmCtrl'
        }
      }
    });
    
    $stateProvider.state('medInteractions', {
      parent: 'loggedIn',
      url: '^/med-interactions/:medId',
      data: {
        title: 'Med Interactions',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/med-inter.tpl.html',
          controller: 'MedInterCtrl',
          controllerAs: 'medInterCtrl'
        }
      }
    });
    
    $stateProvider.state('editProfile', {
      parent: 'loggedIn',
      url: '^/edit-profile',
      data: {
        title: 'Edit Profile',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/edit-profile.tpl.html',
          controller: 'EditProfileCtrl',
          controllerAs: 'editProfileCtrl'
        }
      }
    });
    
    $stateProvider.state('mail', {
      parent: 'loggedIn',
      url: '^/mail/:to',
      data: {
        title: 'Send Email',
        hideFooter: true,
        hasFooter: false
      },
      views: {
        'content': {
          templateUrl: 'app/templates/mail.tpl.html',
          controller: 'MailCtrl',
          controllerAs: 'mailCtrl'
        }
      }
    });
    
  }
  
  Init.$inject = ['$rootScope', '$state'];
  function Init($rootScope, $state) {
    $rootScope.$state = $state;
    $rootScope.menu = {
      open: false
    };
    $rootScope.font = {
      size: 'normal'
    };
    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.menu.open = false;
    });
    $state.go('home.splash');
  }
  
}(window.angular));