/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This is the controller for assessments detail page.
 *
 * @author veshu
 * @version 1.0
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('assessmentDetailsCtrl',
            ['$rootScope', '$scope', '$routeParams', '$location', '$filter', 'storage', 'config', 'util', 'AssessmentService', 'LookupService',
                function ($rootScope, $scope, $routeParams, $location, $filter, storage, config, util, AssessmentService, LookupService) {
                    //sets the navigation menu as active
                    $rootScope.currentMenu = storage.getLastMenu();

                    $rootScope.bodyClass = 'overall-page';
                    $scope.id = $routeParams.id;
                    $scope.pca = {};
                    $scope.isSearched = false;
                    $scope.panelContentClass = "white";
                    $scope.lookups = {};
                    $scope.transformed = {};
                    $scope.showIncompleted = {Error: false}; // true if any validation error during submit
                    if ($routeParams.id > 0) {
                        $scope.isProcessing = true;
                        AssessmentService.get($routeParams.id).then(function (result) {
                            $scope.assessmentDetail = result;
                            $scope.transformed.kpislaAssessments = _transformKpiSlaAssessments($scope.assessmentDetail.kpislaAssessments);
                            $scope.transformed.functionalAssessments=_transformFunctionalAreaAssessments($scope.assessmentDetail.functionalAreaProcessAssessments);
                            $scope.isProcessing = false;
                            _setPermission();
                            _setClassByStatus();
                            $scope.updatesSitePercentage();

                        }, function (error) {
                            $scope.isProcessing = false;
                            $scope.isSearched = true;
                            util.handleHttpError(error);
                            $rootScope.goto('back');
                        });

                        LookupService.getAllCategories().then(function (result) {
                            $scope.lookups.categories = result;
                            //set first tab as selected
                            $scope.pca.categoryType = result[0].id;

                            $scope.categoriesWithAll = angular.copy(result);
                            $scope.categoriesWithAll.unshift({id: -1, name: 'All Categories'});
                            $scope.reportCategories = {
                                likelihoodOfOccurrenceReport: [$scope.categoriesWithAll[0]],
                                riskExposureReport: [$scope.categoriesWithAll[0]],
                                keyControlsMaturityReport: [$scope.categoriesWithAll[0]],
                                residualRiskReport: [$scope.categoriesWithAll[0]]
                            };
                            $scope.legends = [];
                            _.each(result, function (category) {
                                $scope.legends.push(category.name);
                            });
                            _getOverallRiskReport($routeParams.id);
                        }, util.handleHttpError);

                    } else {
                        util.showError("The assessment id is not valid.");
                        $rootScope.goto('back');
                    }

                    /**
                     * Approves the assessment
                     */
                    $scope.approve = function () {
                        $scope.isProcessing = true;
                        AssessmentService.approve($routeParams.id).then(function () {
                            $scope.isProcessing = false;
                            util.showInfo("The assessment has been approved successfully.");
                            $scope.goBackByLastMenu();
                        }, function (error) {
                            $scope.isProcessing = false;
                            util.handleHttpError(error);
                        });
                    };

                    /**
                     * Rejects the assessment
                     */
                    $scope.reject = function () {
                        if ($scope.rejectReason && $scope.rejectReason.length > 0) {
                            angular.element("#disapprove-reason-popup").dialog('close').remove();
                            $scope.isProcessing = true;
                            AssessmentService.reject($routeParams.id, $scope.rejectReason).then(function () {
                                $scope.isProcessing = false;
                                util.showInfo("The assessment has been rejected successfully.");
                                $scope.goBackByLastMenu();
                            }, function (error) {
                                $scope.isProcessing = false;
                                util.handleHttpError(error);
                            });
                        } else {
                            $scope.rejectionError = true;
                        }
                    };

                    /**
                     * Handles the save as draft request which will update the assessment
                     */
                    $scope.update = function () {
                        $scope.isProcessing = true;
                        AssessmentService.update($routeParams.id, $scope.assessmentDetail).then(function () {
                            $scope.isProcessing = false;
                            util.showInfo("The assessment has been updated successfully");
                            $scope.goBackByLastMenu();
                        }, function (error) {
                            $scope.isProcessing = false;
                            util.handleHttpError(error);
                        });
                    };

                    /**
                     * Handles the save as submit request
                     */
                    $scope.submit = function () {
                        if (_validateAssessment($scope.assessmentDetail)) {
                            $scope.showIncompleted.Error = true;
                            angular.element("body").animate({scrollTop: angular.element("body").offset().top}, "slow");
                        } else {
                            $scope.isProcessing = true;
                            $scope.showIncompleted.Error = false;
                            AssessmentService.submit($scope.assessmentDetail).then(function () {
                                $scope.isProcessing = false;
                                util.showInfo("The assessment has been submitted for approval successfully.");
                                $scope.goBackByLastMenu();
                            }, function (error) {
                                $scope.isProcessing = false;
                                util.handleHttpError(error);
                            });
                        }
                    };

                    /**
                     * Handles the export request
                     */
                    $scope.export = function () {
                        AssessmentService.exportAssessmentById($routeParams.id, config.EXPORT_FORMAT.EXCEL);
                    };

                    $scope.edit = function (tabId) {
                        $rootScope.editingTab = tabId;
                        $location.path("/editAssessment/" + $routeParams.id);
                    };

                    /**
                     * Calculates the total site percentage selected
                     */
                    $scope.updatesSitePercentage = function () {
                        $scope.totalPercentageSum = 0;
                        _.each($scope.assessmentDetail.functionPerformedSites, function (item) {
                            if (item.percentage) {
                                $scope.totalPercentageSum += item.percentage.value || 0;
                            }
                        });
                    };

                    /**
                     * Updates or creates risk type
                     * @param riskReportType the risk report type
                     */
                    $scope.updateOrRenderRiskChart = function (riskReportType) {
                        util.updateOrRenderRiskChart($scope, riskReportType);
                    };

                    /**
                     * Updates or creates the residual chart
                     */
                    $scope.updateOrRenderResidualChart = function () {
                        util.updateOrRenderResidualChart($scope);
                    };

                    /**
                     * Returns the number rows to span based on sub processes
                     * @param assessment
                     * @returns {Number}
                     */
                    $scope.getCoreProcessRowSpanValue = function (assessment) {
                        var rows = assessment.subProcessRisks.length;
                        _.each(assessment.subProcessRisks, function (item) {
                            rows += item.controlAssessments.length;
                        });
                        return rows;
                    };

                    /**
                     * Gets the overall risk report
                     * @private
                     */
                    function _getOverallRiskReport(id) {
                        AssessmentService.getOverallRiskRatingReportById(id).then(function (result) {
                            $scope.closeRiskReport = false;
                            $scope.overallRiskRatingReport = result;
                            var riskReports = ['likelihoodOfOccurrenceReport', 'riskExposureReport', 'keyControlsMaturityReport'];
                            _.each(riskReports, function (riskReport) {
                                util.updateOrRenderRiskChart($scope, riskReport);
                            });

                            util.updateOrRenderResidualChart($scope);
                            $scope.closeRiskReport = true;
                        }, util.handleHttpError);
                    }

                    /**
                     * Sets the permission based on role and assessment status
                     * @private
                     */
                    function _setPermission() {
                        $scope.permission = {};
                        if (($scope.assessmentDetail.approvalStatus === config.APPROVAL_STATUS.AWAITING_BU_FUNCTIONAL_APPROVAL.value && $rootScope.user.role === config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME) ||
                            ($scope.assessmentDetail.approvalStatus === config.APPROVAL_STATUS.AWAITING_BU_RISK_MANAGEMENT_APPROVAL.value && $rootScope.user.role === config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME) ||
                            ($scope.assessmentDetail.approvalStatus === config.APPROVAL_STATUS.AWAITING_DIVISIONAL_RISK_MANAGEMENT_APPROVAL.value && $rootScope.user.role === config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME)) {
                            $scope.permission.toApprove = true;
                            $scope.permission.toReject = true;
                            $scope.permission.toSave = true;
                        } else {
                            $scope.permission.toExport = true;
                            $scope.permission.toPrint = true;
                            if (($scope.assessmentDetail.approvalStatus === config.APPROVAL_STATUS.DRAFT.value || $scope.assessmentDetail.approvalStatus === config.APPROVAL_STATUS.REJECTED.value ) &&
                                $rootScope.user.role === config.ROLES.OWNER_ROLE_NAME) {
                                $scope.permission.toSave = true;
                                $scope.permission.toSubmit = true;
                            }
                        }
                    }

                    /**
                     * Sets the class of assessment info section based on status of assessment
                     * @private
                     */
                    function _setClassByStatus() {
                        switch ($scope.assessmentDetail.approvalStatus) {
                            case config.APPROVAL_STATUS.DRAFT.value:
                                $scope.panelClass = '';
                                $scope.panelContentClass = '';
                                break;
                            case config.APPROVAL_STATUS.APPROVED.value:
                                $scope.panelContentClass = 'approved';
                                break;
                            case config.APPROVAL_STATUS.REJECTED.value:
                                $scope.panelContentClass = 'rejected';
                                break;
                            case config.APPROVAL_STATUS.AWAITING_BU_FUNCTIONAL_APPROVAL.value:
                            case config.APPROVAL_STATUS.AWAITING_BU_RISK_MANAGEMENT_APPROVAL.value:
                            case config.APPROVAL_STATUS.AWAITING_DIVISIONAL_RISK_MANAGEMENT_APPROVAL.value:
                                $scope.panelClass = $rootScope.isApprover ? 'awaiting-approver' : '';
                                $scope.panelContentClass = 'awaiting';
                                break;
                        }
                        $scope.isSearched = true;
                    }

                    /**
                     * Validates the assessment for submission for approval
                     * @param assessment the assessment to validate
                     * @returns {boolean}
                     * @private
                     */
                    function _validateAssessment(assessment) {
                        var failed = false;
                        if (!assessment.businessUnit) {
                            return true;
                        }
                        if (!assessment.product) {
                            return true;
                        }
                        if (!assessment.department) {
                            return true;
                        }
                        if (!assessment.departmentHead) {
                            return true;
                        }
                        if (!assessment.functionalAreaOwner) {
                            return true;
                        }
                        if (!assessment.functionalArea) {
                            return true;
                        }
                        if (!assessment.functionalAreaDescription) {
                            return true;
                        }
                        if ($scope.totalPercentageSum !== 100) {
                            return true;
                        }
                        if (!assessment.assessmentType) {
                            return true;
                        }
                        if (!assessment.assessmentStatus) {
                            return true;
                        }
                        if (!assessment.assessmentDueDate) {
                            return true;
                        }
                        // validate prior function change
                        if (assessment.priorFunctionChanges.length > 0) {
                            _.each(assessment.priorFunctionChanges, function (change) {
                                if (!change.changeType || !change.changeTime || !change.changeDescription) {
                                    failed = true;
                                }
                            });
                            if (failed) {
                                return failed;
                            }
                        }

                        // validate future function change
                        if (assessment.futureFunctionChanges.length > 0) {
                            _.each(assessment.futureFunctionChanges, function (change) {
                                if (!change.changeType || !change.changeTime || !change.changeDescription) {
                                    failed = true;
                                }
                            });
                            if (failed) {
                                return failed;
                            }
                        }

                        // validate KPI Assessments
                        if (assessment.kPISLAAssessments) {
                            var kpiError = false;
                            angular.forEach(assessment.kPISLAAssessments, function (kpislaAssessment) {
                                if (kpislaAssessment.KPICategory === null) {
                                    if (!kpislaAssessment.additionalKPICategory) {
                                        kpiError = true;
                                    }
                                }
                                if (kpislaAssessment.KPI == null) {
                                    if (!kpislaAssessment.additionalKPI) {
                                        kpiError = true;
                                    }
                                }
                                if (!kpislaAssessment.selectedSLA && !kpislaAssessment.additionalSLA) {
                                    kpiError = true;
                                }
                            });

                            if (kpiError) {
                                // to focus correct tab
                                $scope.pca.categoryType = config.KPISLA_ASSESSMENT_CATEGORY_ID;
                                return kpiError;
                            }
                        }
                        if (assessment.functionalAreaProcessAssessments) {
                            var functionalAreaError = false;
                            angular.forEach(assessment.functionalAreaProcessAssessments, function (functionalAssessment) {
                                if (!functionalAreaError) {
                                    if (functionalAssessment.coreProcess === null) {
                                        if (!functionalAssessment.additionalCoreProcess) {
                                            functionalAreaError = true;
                                        }
                                    }
                                    if (functionalAssessment.processRisk === null) {
                                        if (!functionalAssessment.additionalSubProcess || !functionalAssessment.additionalRisk) {
                                            functionalAreaError = true;
                                        }
                                    }
                                    if (!functionalAssessment.likelihoodOfOccurrence) {
                                        functionalAreaError = true;
                                    }
                                    if (!functionalAssessment.riskImpacts || !functionalAssessment.riskImpacts.length) {
                                        functionalAreaError = true;
                                    }
                                    if (!functionalAssessment.riskExposure) {
                                        functionalAreaError = true;
                                    }
                                    if (functionalAssessment.controlAssessments && functionalAreaError == false) {
                                        angular.forEach(functionalAssessment.controlAssessments, function (controlAssessment) {
                                            if (!controlAssessment.controlObjective) {
                                                functionalAreaError = true;
                                            }
                                            if (!controlAssessment.controlFrequency) {
                                                functionalAreaError = true;
                                            }
                                            if (!controlAssessment.controlDesigns || !controlAssessment.controlDesigns.length) {
                                                functionalAreaError = true;
                                            }
                                            if (!controlAssessment.testingFrequencies || !controlAssessment.testingFrequencies.length) {
                                                functionalAreaError = true;
                                            }
                                            if (!controlAssessment.controlTriggers || !controlAssessment.controlTriggers.length) {
                                                functionalAreaError = true;
                                            }
                                            if (!controlAssessment.keyControlsMaturity) {
                                                functionalAreaError = true;
                                            }
                                        });
                                    } else {
                                        // no control is selected
                                        functionalAreaError = true;
                                    }
                                }
                            });

                            if (functionalAreaError) {
                                // to focus correct tab
                                $scope.pca.categoryType = config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID;
                                return functionalAreaError;
                            }
                        }
                        if (assessment.processRiskAssessments) {
                            var processRiskError = false;
                            var currentCategory = 0;
                            angular.forEach($scope.lookups.categories, function (category) {
                                if (category.id !== config.KPISLA_ASSESSMENT_CATEGORY_ID
                                    && category.id !== config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID && !processRiskError) {
                                    currentCategory = category.id;
                                    var result = [];
                                    angular.forEach(assessment.processRiskAssessments, function (item) {
                                        if (item && item.category && item.category.id === category.id) {
                                            result.push(item);
                                        }
                                    });

                                    angular.forEach(result, function (processRiskAssessment) {
                                        if (processRiskAssessment.processRisk === null) {
                                            if (!processRiskAssessment.additionalProcess || !processRiskAssessment.additionalRisk) {
                                                processRiskError = true;
                                            }
                                        }
                                        if (!processRiskAssessment.riskExposure) {
                                            processRiskError = true;
                                        }

                                        if (processRiskAssessment.controlAssessments) {
                                            angular.forEach(processRiskAssessment.controlAssessments, function (controlAssessment) {
                                                if (!controlAssessment.controlFrequency) {
                                                    processRiskError = true;
                                                }
                                                if (!controlAssessment.controlDesigns || !controlAssessment.controlDesigns.length) {
                                                    processRiskError = true;
                                                }
                                                if (!controlAssessment.testingFrequencies || !controlAssessment.testingFrequencies.length) {
                                                    processRiskError = true;
                                                }
                                                if (!controlAssessment.keyControlsMaturity) {
                                                    processRiskError = true;
                                                }
                                            });
                                        } else {
                                            // no control is selected
                                            processRiskError = true;
                                        }
                                    });
                                }
                            });
                            if (processRiskError) {
                                // to focus correct tab
                                $scope.pca.categoryType = currentCategory;
                                return processRiskError;
                            }
                        }
                        return false;
                    }

                    /**
                     * Transforms the KPI & SLA's assessments to render with group
                     * @param assessments
                     * @private
                     */
                    function _transformKpiSlaAssessments(assessments) {
                        var result = [];
                        var additional = [];
                        _.each(assessments, function (item) {
                            if (item.kpiCategory && item.kpiCategory.id > 0) {
                                var existingKpiAssessmentGroup = $filter('filter')(result, {KPICategory: {id: item.kpiCategory.id}});
                                if (existingKpiAssessmentGroup.length > 0) {
                                    existingKpiAssessmentGroup[0].KPIs.push(item);
                                } else {
                                    result.push({
                                        KPICategory: item.kpiCategory,
                                        KPIs: [item]
                                    });
                                }
                            } else {
                                var existingAdditional = $filter('filter')(additional, {KPICategory: {name: item.additionalKPICategory}});
                                if (existingAdditional.length > 0) {
                                    existingAdditional[0].KPIs.push(item);
                                } else {
                                    additional.push({
                                        KPICategory: {
                                            id: 'other-' + additional.length,
                                            name: item.additionalKPICategory
                                        },
                                        KPIs: [item]
                                    });
                                }
                            }
                        });
                        return _.union(result, additional);
                    }

                    /**
                     * Transforms the functional area assessments to render with group
                     * @param assessments
                     * @private
                     */
                    function _transformFunctionalAreaAssessments(assessments) {
                        var result = [];
                        var additional = [];
                        _.each(assessments, function (item) {
                            if (item.coreProcess && item.coreProcess.id > 0) {
                                var existingAssessmentGroup = $filter('filter')(result, {coreProcess: {id: item.coreProcess.id}});
                                if (existingAssessmentGroup.length > 0) {
                                    existingAssessmentGroup[0].subProcessRisks.push(item);
                                } else {
                                    result.push({
                                        coreProcess: item.coreProcess,
                                        subProcessRisks: [item]
                                    });
                                }
                            } else {
                                var existingAdditional = $filter('filter')(additional, {coreProcess: {name: item.additionalCoreProcess}});
                                if (existingAdditional.length > 0) {
                                    existingAdditional[0].subProcessRisks.push(item);
                                } else {
                                    additional.push({
                                        coreProcess: {
                                            id: 'other-' + additional.length,
                                            name: item.additionalCoreProcess
                                        },
                                        subProcessRisks: [item]
                                    });
                                }
                            }
                        });
                        return _.union(result, additional);
                    }
                }
            ]
        );
})();