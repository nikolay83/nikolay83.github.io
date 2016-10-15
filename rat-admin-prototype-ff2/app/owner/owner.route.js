/* Routes */
(function() {
    'use strict';

    angular
        .module('app.owner')
        .config(config);

    //config
    function config($stateProvider, $urlRouterProvider) {
        // Owner
        $stateProvider
            .state('owner', {
                url: '/owner',
                abstract: true,
                views: {
                    "default": {
                        templateUrl: "app/owner/shell.html"
                    }
                }
            })
            .state('owner.home', {
                url: '/home',
                views: {
                    "view": {
                        templateUrl: "app/owner/home.owner.html"
                    }
                }
            })
            .state('owner.add', {
                url: '/add',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-business-unit-info.html"
                    }
                }
            })
            .state('owner.addFnModifications', {
                url: '/add/function',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-function.html"
                    }
                }
            })
            .state('owner.addProcesses', {
                url: '/add/processes',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes.html"
                    }
                }
            })
            .state('owner.addProcessesFunctionalArea', {
                url: '/add/processes/functionalArea',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-functional.html"
                    }
                }
            })
            .state('owner.addProcessesCorporate', {
                url: '/add/processes/corporate',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-corporate.html"
                    }
                }
            })
            .state('owner.addProcessesBusiness', {
                url: '/add/processes/business',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-business.html"
                    }
                }
            })
            .state('owner.addProcessesRecords', {
                url: '/add/processes/records',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-records.html"
                    }
                }
            })
            .state('owner.addProcessesInformation', {
                url: '/add/processes/information',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-information.html"
                    }
                }
            })
            .state('owner.addProcessesData', {
                url: '/add/processes/data',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-processes-data.html"
                    }
                }
            })
            .state('owner.overall', {
                url: '/add/overall',
                views: {
                    "view": {
                        templateUrl: "app/owner/add-assessment-overall.html"
                    }
                }
            })
            .state('owner.draft', {
                url: '/draft',
                views: {
                    "view": {
                        templateUrl: "app/owner/draft-assessment.html"
                    }
                }
            })
            .state('owner.awaiting', {
                url: '/awaiting',
                views: {
                    "view": {
                        templateUrl: "app/owner/awaiting-assessment.html"
                    }
                }
            })
            .state('owner.awaitingDetails', {
                url: '/awaiting/details',
                views: {
                    "view": {
                        templateUrl: "app/owner/awaiting-assessment-detail.html"
                    }
                }
            })
            .state('owner.approved', {
                url: '/approved',
                views: {
                    "view": {
                        templateUrl: "app/owner/approved-assessment.html"
                    }
                }
            })
            .state('owner.approvedDetails', {
                url: '/approved/details',
                views: {
                    "view": {
                        templateUrl: "app/owner/approved-assessment-detail.html"
                    }
                }
            })
            .state('owner.rejected', {
                url: '/rejected',
                views: {
                    "view": {
                        templateUrl: "app/owner/rejected-assessment.html"
                    }
                }
            })
            .state('owner.rejectedDetails', {
                url: '/rejected/details',
                views: {
                    "view": {
                        templateUrl: "app/owner/rejected-assessment-detail.html"
                    }
                }
            });
    }

})();
