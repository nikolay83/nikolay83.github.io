/* Routes */
(function() {
    'use strict';

    angular
        .module('app.admin')
        .config(config);

    //config
    function config($stateProvider, $urlRouterProvider) {
        // admin
        $stateProvider
            .state('admin', {
                url: '/admin',
                abstract: true,
                views: {
                    "default": {
                        templateUrl: "app/admin/shell.html"
                    }
                }
            })
            .state('admin.home', {
                url: '/home',
                views: {
                    "view": {
                        templateUrl: "app/admin/home.admin.html"
                    }
                }
            })
            .state('admin.add', {
                url: '/add',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-business-unit-info.html"
                    }
                }
            })
            .state('admin.addFnModifications', {
                url: '/add/function',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-function.html"
                    }
                }
            })
            .state('admin.addProcesses', {
                url: '/add/processes',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes.html"
                    }
                }
            })
            .state('admin.addProcessesFunctionalArea', {
                url: '/add/processes/functionalArea',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-functional.html"
                    }
                }
            })
            .state('admin.addProcessesCorporate', {
                url: '/add/processes/corporate',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-corporate.html"
                    }
                }
            })
            .state('admin.addProcessesBusiness', {
                url: '/add/processes/business',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-business.html"
                    }
                }
            })
            .state('admin.addProcessesRecords', {
                url: '/add/processes/records',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-records.html"
                    }
                }
            })
            .state('admin.addProcessesInformation', {
                url: '/add/processes/information',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-information.html"
                    }
                }
            })
            .state('admin.addProcessesData', {
                url: '/add/processes/data',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-processes-data.html"
                    }
                }
            })
            .state('admin.overall', {
                url: '/add/overall',
                views: {
                    "view": {
                        templateUrl: "app/admin/add-assessment-overall.html"
                    }
                }
            })
            .state('admin.draft', {
                url: '/draft',
                views: {
                    "view": {
                        templateUrl: "app/admin/draft-assessment.html"
                    }
                }
            })
            .state('admin.awaiting', {
                url: '/awaiting',
                views: {
                    "view": {
                        templateUrl: "app/admin/awaiting-assessment.html"
                    }
                }
            })
            .state('admin.awaitingDetails', {
                url: '/awaiting/details',
                views: {
                    "view": {
                        templateUrl: "app/admin/awaiting-assessment-detail.html"
                    }
                }
            })
            .state('admin.approved', {
                url: '/approved',
                views: {
                    "view": {
                        templateUrl: "app/admin/approved-assessment.html"
                    }
                }
            })
            .state('admin.approvedDetails', {
                url: '/approved/details',
                views: {
                    "view": {
                        templateUrl: "app/admin/approved-assessment-detail.html"
                    }
                }
            })
            .state('admin.rejected', {
                url: '/rejected',
                views: {
                    "view": {
                        templateUrl: "app/admin/rejected-assessment.html"
                    }
                }
            })
            .state('admin.rejectedDetails', {
                url: '/rejected/details',
                views: {
                    "view": {
                        templateUrl: "app/admin/rejected-assessment-detail.html"
                    }
                }
            })


        //edit
        .state('admin.edit', {
            url: '/edit',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-bu-info.html"
                }
            }
        })

        .state('admin.editFunction', {
            url: '/edit/function',
            views: {
                "view": {
                    templateUrl: "app/admin/function-edit.html"
                }
            }
        })

        .state('admin.editProcesses', {
            url: '/edit/processes',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes.html"
                }
            }
        })

        .state('admin.editProfunctionalArea', {
            url: '/edit/processes/functionalArea',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-fn-area.html"
                }
            }
        })

        .state('admin.editProCorporate', {
            url: '/edit/processes/corporate',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-corporate-divisional.html"
                }
            }
        })
        

        .state('admin.editProbusiness', {
            url: '/edit/processes/business',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-business.html"
                }
            }
        })

        .state('admin.editProrecords', {
            url: '/edit/processes/records',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-records.html"
                }
            }
        })

        .state('admin.editProinformation', {
            url: '/edit/processes/information',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-information.html"
                }
            }
        })

        .state('admin.editProPrivacy', {
            url: '/edit/processes/data',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-assessment-processes-data.html"
                }
            }
        })

        .state('admin.bulkData', {
            url: '/add/bulkdata',
            views: {
                "view": {
                    templateUrl: "app/admin/bulk-data.html"
                }
            }
        })

        .state('admin.dataMapping', {
            url: '/add/bulkdataMapping',
            views: {
                "view": {
                    templateUrl: "app/admin/bulk-data-mapping.html"
                }
            }
        })
        
        //Update Code
        .state('admin.editAddon', {
            url: '/edit/addon',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-addon.html"
                }
            }
        })

        .state('admin.editBulkData', {
            url: '/edit/bulkdata',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-bulk-data.html"
                }
            }
        })

        .state('admin.editGlobalFields', {
            url: '/edit/globalFields',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-global-fields.html"
                }
            }
        })

        .state('admin.editRiskCalculation', {
            url: '/edit/riskCalculation',
            views: {
                "view": {
                    templateUrl: "app/admin/edit-risk-calculation.html"
                }
            }
        })

        //end Update;
    }

})();
