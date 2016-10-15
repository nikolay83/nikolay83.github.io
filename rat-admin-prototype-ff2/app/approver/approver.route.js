/* Routes */
(function() {
    'use strict';

    angular
        .module('app.approver')
        .config(config);

    //config
    function config($stateProvider, $urlRouterProvider) {
        // Approver
        $stateProvider
            .state('approver', {
                url: '/approver',
                abstract: true,
                views: {
                    "default": {
                        templateUrl: "app/approver/shell.html"
                    }
                }
            })
            .state('approver.home', {
                url: '/home',
                views: {
                    "view": {
                        templateUrl: "app/approver/home.approver.html"
                    }
                }
            })            
            .state('approver.awaiting', {
                url: '/awaiting',
                views: {
                    "view": {
                        templateUrl: "app/approver/awaiting-assessment-approver.html"
                    }
                }
            })
            .state('approver.awaitingDetails', {
                url: '/awaiting/details',
                views: {
                    "view": {
                        templateUrl: "app/approver/awaiting-assessment-detail-approver.html"
                    }
                }
            })
            .state('approver.approved', {
                url: '/approved',
                views: {
                    "view": {
                        templateUrl: "app/approver/approved-assessment-approver.html"
                    }
                }
            });
    }

})();
