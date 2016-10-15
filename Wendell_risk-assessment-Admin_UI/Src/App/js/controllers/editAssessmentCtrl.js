/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is controller for edit assessment page.
 *
 * @author veshu
 * @version 1.0
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('editAssessmentCtrl', ['$rootScope', '$window', '$scope', '$location', 'storage', '$filter', '$routeParams', 'config', 'util',
            'AssessmentService', 'LookupService',
            function ($rootScope, $window, $scope, $location, storage, $filter, $routeParams, config, util, AssessmentService, LookupService) {
                $rootScope.currentMenu = storage.getLastMenu();
                $scope.currentTab = { id: $rootScope.editingTab || 1 };
                $scope.assessmentToUpdate = {};
                $scope.overallRiskRatingReport = {};
                $scope.lookups = {
                    coreProcesses: [],
                    lastSelectedFunctionalAreaId: 0,
                    additionalProcessRisksControlTypes: {}
                };
                $scope.isLoaded = false;
                $scope.showIncompleted = { Error: false }; // true if any validation error during submit
                $scope.permission = {
                    approverUpdate: false
                };
                // hide prior changes by default
                $scope.functionChanges = {
                    isPriorChanges: false,
                    isFutureChanges: false,
                    priorChanges: [],
                    futureChanges: []
                };
                $scope.pca = {};

                $scope.assessments = {
                    kPISLAAssessments: [], // holds assessments[]
                    functionalAssessments: [],
                    processRiskAssessments: [] // holds <key, assessment[]>
                };

                if ($scope.lookups.coreProcesses.length <= 0) {
                    $scope.lookups.coreProcesses = [{
                        controlTypes: [{
                            id: 'other-1',
                            name: 'Other'
                        }]
                    }];
                }

                $scope.additional = {
                    kPISLAAssessments: [{
                        KPICategory: { id: 'other-0', name: '' },
                        KPIs: [{}],
                        additionalKPI: '',
                        additionalSLA: '',
                        category: { id: config.KPISLA_ASSESSMENT_CATEGORY_ID }
                    }],
                    functionalAssessments: [{
                        subProcessRisks: [{
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: angular.copy($scope.lookups.coreProcesses[$scope.lookups.coreProcesses.length - 1].controlTypes)
                        }],
                        coreProcess: { id: 'other-0', name: '' },
                        additionalCoreProcess: '',
                        additionalSubProcess: '',
                        additionalRisk: '',
                        category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID },
                        inputs: []
                    }],
                    processRiskAssessments: [] // holds <key, assessment[]>
                };
                $scope.lookups.additionalControlTypes = [];
                $scope.totalPercentageSum = 0;
                $scope.validation = { failed: 0 };
                $scope.isProcessing = false;

                /**
                 * Moves to the next tab
                 */
                $rootScope.nextTab = function () {
                    $scope.currentTab.id = $scope.currentTab.id + 1;
                    if ($scope.currentTab.id === 4) {
                        $scope.getOverallRiskRatingReport();
                    }
                };

                /**
                 * Handles the save as draft request
                 */
                $scope.update = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToUpdate);
                    if (!assessment.functionalArea || !assessment.functionalArea.id || assessment.functionalArea.id < 1) {
                        $scope.currentTab.id = 1;
                        util.showError("Please select functional area.");
                    } else {
                        $scope.isProcessing = true;
                        AssessmentService.update($routeParams.id, assessment).then(function () {
                            $scope.isProcessing = false;
                            util.showInfo("The assessment has been updated successfully.");
                            if ($scope.permission.approverUpdate) {
                                $location.path("/assessmentDetails/" + $routeParams.id);
                            } else {
                                $scope.goBackByLastMenu();
                            }
                        }, function (error) {
                            $scope.isProcessing = false;
                            util.handleHttpError(error);
                        });
                    }
                };

                /**
                 * Handles the save as submit request
                 */
                $scope.submit = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToUpdate);
                    if (util.validateFailed(assessment, $scope)) {
                        $scope.showIncompleted.Error = true;
                        angular.element("body").animate({ scrollTop: angular.element("body").offset().top }, "slow");
                    } else {
                        $scope.isProcessing = true;
                        $scope.showIncompleted.Error = false;
                        AssessmentService.submit(assessment).then(function () {
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
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToUpdate);
                    AssessmentService.exportAssessment(assessment, config.EXPORT_FORMAT.EXCEL);
                };

                /**
                 * Gets the overall risk rating report
                 */
                $scope.getOverallRiskRatingReport = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToUpdate);
                    AssessmentService.getOverallRiskRatingReport(assessment).then(function (result) {
                        $scope.overallRiskRatingReport = result;
                        var riskReports = ['likelihoodOfOccurrenceReport', 'riskExposureReport', 'keyControlsMaturityReport'];
                        _.each(riskReports, function (riskReport) {
                            util.updateOrRenderRiskChart($scope, riskReport);
                        });

                        util.updateOrRenderResidualChart($scope);
                    }, util.handleHttpError);

                };

                /**
                 * Resolves the lookup dependent to business unit
                 */
                $scope.resolveBusinessUnitRelatedLookup = function () {
                    if ($scope.assessmentToUpdate.businessUnit) {
                        var selectedBU = util.getSingleSelectValue($scope.assessmentToUpdate.businessUnit);
                        if (selectedBU) {
                            LookupService.getFunctionalAreaOwners(selectedBU.id).then(function (result) {
                                $scope.lookups.functionalAreaOwners = result;
                            }, util.handleHttpError);

                            LookupService.getFunctionalAreas(selectedBU.id).then(function (result) {
                                $scope.lookups.functionalAreas = result;
                            }, util.handleHttpError);

                            LookupService.getAllDepartmentHeads(selectedBU.id).then(function (result) {
                                $scope.lookups.departmentHeads = result;
                            }, util.handleHttpError);

                            LookupService.getAllProducts(selectedBU.id).then(function (result) {
                                $scope.lookups.products = result;
                            }, util.handleHttpError);

                            LookupService.getAllDepartments(selectedBU.id).then(function (result) {
                                $scope.lookups.departments = result;
                            }, util.handleHttpError);
                        }
                    }
                };

                /**
                 * Resolves the lookup dependent to functional area
                 */
                $scope.resolveFunctionalAreaRelatedLookup = function () {
                    if ($scope.assessmentToUpdate.functionalArea) {
                        var selectedValue = util.getSingleSelectValue($scope.assessmentToUpdate.functionalArea);
                        if (selectedValue) {
                            LookupService.getCoreProcesses(selectedValue.id).then(function (result) {
                                $scope.lookups.coreProcesses = util.removeAdditional(result);
                                $scope.lookups.additionalFunctionalControlTypes = util.prepareAdditionalFunctionalControlTypes(result);
                                if (selectedValue.id === $scope.assessmentDetail.functionalArea.id) {
                                    if ($scope.lookups.lastSelectedFunctionalAreaId != 0) {
                                        _prepareFunctionalAreaProcessAssessmentViewModel($scope.assessmentDetail);
                                    }
                                    _attachFunctionalAreaControlTypes();
                                } else {
                                    _resetFunctionalAreaProcessAssessments();
                                }
                                $scope.lookups.lastSelectedFunctionalAreaId = selectedValue.id;
                            }, util.handleHttpError);
                        }
                    }
                };

                /**
                 * Adds the function change placeholder
                 * @param {Boolean] isPrior whether the function change is prior or not
                 */
                $scope.addFunctionChange = function (isPrior) {
                    var maxAllowedMsg = "Maximum allowed(" + config.MAXIMUM_ALLOWED_FUNCTION_CHANGES + ") function changes are reached.";
                    if (isPrior) {
                        if ($scope.functionChanges.priorChanges.length >= config.MAXIMUM_ALLOWED_FUNCTION_CHANGES) {
                            $window.alert(maxAllowedMsg);
                        } else {
                            $scope.functionChanges.priorChanges.push({});
                        }
                    } else {
                        if ($scope.functionChanges.futureChanges.length >= config.MAXIMUM_ALLOWED_FUNCTION_CHANGES) {
                            $window.alert(maxAllowedMsg);
                        } else {
                            $scope.functionChanges.futureChanges.push({});
                        }
                    }
                };
/**
                 * Adds the new additional kpi sla assessment placeholder
                 */
                $scope.addAdditionalKPI = function (index) {
                    if (index + 1 === $scope.additional.kPISLAAssessments.length) {
                        $scope.additional.kPISLAAssessments.push({
                            category: {id: config.KPISLA_ASSESSMENT_CATEGORY_ID},
                            KPICategory: {id: 'other-' + (index + 1), name: ''},
                            KPIs: [{SLAs: angular.copy($scope.lookups.additionalKpiSlas)}],
                            SLAs: angular.copy($scope.lookups.additionalKpiSlas)
                        });
                    }
                };

                /**
                 * Adds additional kpi category row in additional assessment placeholder
                 * @param index
                 * @param kpiCategoryId
                 */
                $scope.addAdditionalSubKPIAssessment = function (index, kpiCategoryId) {
                    var kpiAssessment = $filter('filter')($scope.additional.kPISLAAssessments, {KPICategory: {id: kpiCategoryId}});
                    if (index + 1 === kpiAssessment[0].KPIs.length) {
                        kpiAssessment[0].KPIs.push({
                            id: 0,
                            name: '',
                            SLAs: angular.copy($scope.lookups.additionalKpiSlas)
                        });
                    }
                };

                /**
                 * Adds the new additional kpi sla assessment placeholder for a category
                 */
                $scope.addAdditionalKPICategoryAssessment = function (index, kpiCategoryId) {
                    var kpiAssessment = $filter('filter')($scope.assessments.kPISLAAssessments, {KPICategory: {id: kpiCategoryId}});
                    if (index + 1 === kpiAssessment[0].KPIs.length) {
                        var kpis = [{id: 0, name: ''}];
                        _addKPITypes(kpis, kpiAssessment[0].KPICategory.slAs);
                        kpiAssessment[0].KPIs.push(kpis[0]);
                    }
                };

                /**
                 * Adds the new additional functional area assessment placeholder for a core process
                 */
                $scope.addAdditionalCoreProcessAssessment = function (index, coreProcessId) {
                    var fas = $filter('filter')($scope.assessments.functionalAssessments, { coreProcess: { id: coreProcessId } });
                    if (index + 1 === fas[0].subProcessRisks.length) {
                        var assessmentIndex = $scope.assessments.functionalAssessments.findIndex(function (item) {
                            return item.coreProcess.id === coreProcessId;
                        });
                        fas[0].subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: angular.copy(fas[0].coreProcess.controlTypes)
                        });

                        _applyControlTypeWatcher('assessments.functionalAssessments[' + assessmentIndex + '].subProcessRisks[' + (index + 1) + ']',
                            $scope.assessments.functionalAssessments[assessmentIndex].subProcessRisks[index + 1]);
                    }
                };

                /**
                 * Adds the new additional functional area sub process assessment placeholder for a core process
                 */
                $scope.addAdditionalFunctionalAreaSubProcessAssessment = function (index, coreProcessId) {
                    if (!$scope.lookups.coreProcesses) {
                        $scope.lookups.coreProcesses = [{ controlTypes: [{ id: 'other-1', name: 'Other' }] }];
                    }
                    var controlTypes = angular.copy($scope.lookups.additionalFunctionalControlTypes);
                    var fas = $filter('filter')($scope.additional.functionalAssessments, { coreProcess: { id: coreProcessId } });
                    if (index + 1 === fas[0].subProcessRisks.length) {
                        var assessmentIndex = $scope.additional.functionalAssessments.findIndex(function (item) {
                            return item.coreProcess.id === coreProcessId;
                        });
                        fas[0].subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: controlTypes
                        });
                        _applyControlTypeWatcher('additional.functionalAssessments[' + assessmentIndex + '].subProcessRisks[' + (index + 1) + ']',
                            $scope.additional.functionalAssessments[assessmentIndex].subProcessRisks[index + 1]);
                    }
                };

                /**
                 * Adds the new additional functional area assessment placeholder
                 */
                $scope.addAdditionalFunctionalAreaProcessAssessment = function (index) {
                    if (!$scope.lookups.coreProcesses) {
                        $scope.lookups.coreProcesses = [{ controlTypes: [{ id: 'other-1', name: 'Other' }] }];
                    }
                    var controlTypes = angular.copy($scope.lookups.additionalFunctionalControlTypes);
                    if (index + 1 === $scope.additional.functionalAssessments.length) {
                        $scope.additional.functionalAssessments.push({
                            category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID },
                            coreProcess: { id: 'other-' + (index + 1), name: '', controlTypes: controlTypes },
                            subProcessRisks: [{
                                id: 0,
                                name: '',
                                controlTypes: [],
                                selectableControlTypes: controlTypes,
                                inputs: []
                            }]
                        });
                        _applyControlTypeWatcher('additional.functionalAssessments[' + (index + 1) + '].subProcessRisks[0]',
                            $scope.additional.functionalAssessments[index + 1].subProcessRisks[0]);
                    }
                };

                /**
                 * Returns the number rows to span based on sub processes
                 * @param assessment
                 * @returns {Number}
                 */
                $scope.getCoreProcessRowSpanValue = function (assessment, removeAdditionalEmpty) {
                    var subRisks = angular.copy(assessment.subProcessRisks);
                    if (removeAdditionalEmpty) {
                        subRisks = _.filter(assessment.subProcessRisks, function (item) {
                            return (item.additionalSubProcess && item.additionalSubProcess.length > 0) || (item.name && item.name.length > 0)
                        });
                    }
                    var rows = subRisks.length;
                    _.each(subRisks, function (item) {
                        rows += item.controlTypes.length;
                    });
                    return rows;
                };

                /**
                 * Adds the new additional kpi sla assessment placeholder
                 * @param index the index
                 * @param categoryId the category id
                 */
                $scope.addAdditionalRiskAssessment = function (index, categoryId) {
                    if (index + 1 === $scope.additional.processRiskAssessments[categoryId].assessments.length) {
                        var assessments = [{
                            category: { id: categoryId },
                            inputs: [],
                            selectableControlTypes: []
                        }];
                        _addControlTypes(assessments, $scope.lookups.additionalProcessRisksControlTypes[categoryId]);
                        $scope.additional.processRiskAssessments[categoryId].assessments.push(assessments[0]);
                        _applyControlTypeWatcher('additional.processRiskAssessments[' + categoryId + '].assessments[' + (index + 1) + ']',
                            $scope.additional.processRiskAssessments[categoryId].assessments[(index + 1)]);
                    }
                };

                /**
                 * Calculates the total site percentage selected
                 */
                $scope.updatesSitePercentage = function () {
                    $scope.totalPercentageSum = 0;
                    _.each($scope.assessmentToUpdate.selectedSites, function (item) {
                        if (item.percentage) {
                            $scope.totalPercentageSum += item.percentage.value || 0;
                        }
                    });
                };

                if ($routeParams.id > 0) {
                    $scope.isProcessing = true;
                    AssessmentService.get($routeParams.id).then(function (result) {
                        if (!_checkEditPermission(result)) {
                            storage.storeLastMenu(config.MENUS.HOME);
                            $window.alert("You cannot edit the this assessment.");
                            $location.path("/assessmentDetails/" + $routeParams.id);
                        } else {
                            _setViewModel(result);
                            $scope.isProcessing = false;
                            $scope.isSearched = true;
                        }
                    }, function (error) {
                        $scope.isProcessing = false;
                        $scope.isSearched = true;
                        util.handleHttpError(error);
                        $scope.goBackByLastMenu();
                    });
                    util.getLookupValues($scope, LookupService);
                } else {
                    util.showError("The assessment id is not valid.");
                    $scope.goBackByLastMenu();
                }

                /**
                 * filters the kpis assessment with KPI defined only
                 */
                $scope.onlyWithKPI = function (input) {
                    if ((input.additionalKPI && input.additionalKPI.length > 0) || (input.name && input.name.length > 0)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters additional kpi assessments with additionalKPI
                 */
                $scope.onlyWithAdditionalKPI = function (input) {
                    if (input.additionalKPI && input.additionalKPI.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters additional kpi assessments with additionalKPI category
                 */
                $scope.onlyWithAdditionalKPICategory = function (input) {
                    if (input.KPIs[0].additionalKPICategory && input.KPIs[0].additionalKPICategory.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters the assessments with core processes and additionalSubProcess
                 */
                $scope.onlyWithSubProcess = function (input) {
                    if ((input.additionalSubProcess && input.additionalSubProcess.length > 0) || (input.name && input.name.length > 0)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters additional functional area process assessments with additionalSubProcess
                 */
                $scope.onlyWithAdditionalSubProcess = function (input) {
                    if (input.additionalSubProcess && input.additionalSubProcess.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters additional functional area process assessments with coreProcess.name
                 */
                $scope.onlyWithAdditionalCoreProcess = function (input) {
                    if (input.subProcessRisks[0].additionalCoreProcess
                        && input.subProcessRisks[0].additionalCoreProcess.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * filters additional process risk assessments with additionalProcess
                 */
                $scope.onlyWithAdditionalProcess = function (input) {
                    if (input.additionalProcess && input.additionalProcess.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
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
                 * Shows the comment box
                 */
                $scope.showComment = function (categoryId, rowItemId, index, suffix, prefix) {
                    var id = 'comment-popup-' + categoryId + '-' + rowItemId + '-' + index;
                    if (suffix) {
                        id = id + '-' + suffix;
                    }
                    if (prefix) {
                        id = prefix + '-' + id;
                    }
                    $('#' + id).dialog({
                        resizable: false,
                        height: 300,
                        modal: true,
                        dialogClass: "no-close"
                    });
                    $('#' + id).show();
                };

                /**
                 * Hides the comment box
                 */
                $scope.closeCommentBox = function (categoryId, rowItemId, index, suffix, prefix) {
                    var id = 'comment-popup-' + categoryId + '-' + rowItemId + '-' + index;
                    if (suffix) {
                        id = id + '-' + suffix;
                    }
                    if (prefix) {
                        id = prefix + '-' + id;
                    }
                    $('#' + id).dialog('close');
                };

                /**
                 * Shows the comment box to ask for custom likelihood of occurrence if selected id is equal to configured id
                 */
                $scope.askUserDefinedLikelihoodOfOccurrence = function (model, categoryId, rowItemId, index, suffix, prefix) {
                    if (model.likelihoodOfOccurrence[0].id == config.USER_DEFINED_KEY_LIKELIHOOD_OF_OCCURRENCE_ID) {
                        $scope.showComment(categoryId, rowItemId, index, suffix, prefix);
                    }
                };

                /**
                 * Shows the comment box to ask for testing frequency if selected id is equal to configured id
                 */
                $scope.askUserDefinedTestingFrequency = function (model, categoryId, rowItemId, index, suffix, prefix) {
                    if (_.findWhere(model.testingFrequencies, { id: config.USER_DEFINED_TESTING_FREQUENCY_ID })
                        && !_.findWhere(model.oldTestingFrequencies, { id: config.USER_DEFINED_TESTING_FREQUENCY_ID })) {
                        $scope.showComment(categoryId, rowItemId, index, suffix, prefix);
                    }
                    model.oldTestingFrequencies = angular.copy(model.testingFrequencies);
                };

                /**
                 * Shows the comment box to ask for key control maturity if selected id is equal to configured id
                 */
                $scope.askUserDefinedKeyControlsMaturity = function (model, categoryId, rowItemId, index, suffix, prefix) {
                    if (model.keyControlsMaturity[0].id == config.USER_DEFINED_KEY_CONTROLS_MATURITY_ID) {
                        $scope.showComment(categoryId, rowItemId, index, suffix, prefix);
                    }
                };

                /**
                 * Sets scope variables from assessment
                 * @param assessmentDetail the assessment detail
                 * @private
                 */
                function _setViewModel(assessmentDetail) {
                    $scope.assessmentDetail = angular.copy(assessmentDetail);
                    $scope.assessmentToUpdate = {};
                    $scope.assessmentToUpdate.id = $routeParams.id;
                    $scope.assessmentToUpdate.title = assessmentDetail.title;
                    $scope.assessmentToUpdate.businessUnit = util.convertToArray(assessmentDetail.businessUnit);
                    $scope.assessmentToUpdate.product = util.convertToArray(assessmentDetail.product);
                    $scope.assessmentToUpdate.department = util.convertToArray(assessmentDetail.department);
                    $scope.assessmentToUpdate.departmentHead = util.convertToArray(assessmentDetail.departmentHead);
                    $scope.assessmentToUpdate.functionalAreaOwner = util.convertToArray(assessmentDetail.functionalAreaOwner);
                    $scope.assessmentToUpdate.functionalArea = util.convertToArray(assessmentDetail.functionalArea);
                    $scope.assessmentToUpdate.functionalAreaDescription = assessmentDetail.functionalAreaDescription;

                    // set function performed sites
                    $scope.assessmentToUpdate.selectedSites = [];
                    _.each(assessmentDetail.functionPerformedSites, function (item) {
                        $scope.assessmentToUpdate.selectedSites.push({
                            id: item.site.id,
                            name: item.site.name,
                            percentage: item.percentage
                        });
                    });
                    $scope.updatesSitePercentage();
                    $scope.assessmentToUpdate.assessmentType = util.convertToArray(assessmentDetail.assessmentType);
                    $scope.assessmentToUpdate.assessmentStatus = util.convertToArray(assessmentDetail.assessmentStatus);
                    if (assessmentDetail.assessmentDueDate) {
                        $scope.assessmentToUpdate.dueDate = util.convertDate(assessmentDetail.assessmentDueDate);
                    }

                    $scope.resolveBusinessUnitRelatedLookup();
                    $scope.resolveFunctionalAreaRelatedLookup();

                    // second tab
                    if (assessmentDetail.priorFunctionChanges.length > 0) {
                        $scope.functionChanges.isPriorChanges = true;
                    }
                    _.each(assessmentDetail.priorFunctionChanges, function (change) {
                        var changeItem = {
                            changeType: util.convertToArray(change.changeType),
                            changeTime: util.convertDate(change.changeTime),
                            changeDescription: change.changeDescription
                        };
                        $scope.functionChanges.priorChanges.push(changeItem);
                    });
                    if (assessmentDetail.futureFunctionChanges.length > 0) {
                        $scope.functionChanges.isFutureChanges = true;
                    }
                    _.each(assessmentDetail.futureFunctionChanges, function (change) {
                        var changeItem = {
                            changeType: util.convertToArray(change.changeType),
                            changeTime: util.convertDate(change.changeTime),
                            changeDescription: change.changeDescription
                        };
                        $scope.functionChanges.futureChanges.push(changeItem);
                    });

                    _prepareKPISlaAssessmentViewModel(assessmentDetail);
                    _prepareFunctionalAreaProcessAssessmentViewModel(assessmentDetail);

                    var categories = [];
                    _.each(assessmentDetail.processRiskAssessments, function (item) {
                        if (!$scope.assessments.processRiskAssessments[item.category.id]) {
                            $scope.assessments.processRiskAssessments[item.category.id] = {
                                categoryType: item.category,
                                assessments: []
                            };
                            categories.push(item.category);
                        }
                        if (!$scope.additional.processRiskAssessments[item.category.id]) {
                            $scope.additional.processRiskAssessments[item.category.id] = {
                                categoryType: item.category,
                                assessments: []
                            };
                        }
                        var riskAssessment = _getProcessControlAssessment(item);
                        riskAssessment.categoryType = item.category;
                        if (item.processRisk) {
                            riskAssessment.processRisk = item.processRisk;
                            $scope.assessments.processRiskAssessments[item.category.id].assessments.push(riskAssessment);
                        } else {
                            riskAssessment.additionalProcess = item.additionalProcess;
                            riskAssessment.additionalRisk = item.additionalRisk;
                            $scope.additional.processRiskAssessments[item.category.id].assessments.push(riskAssessment);
                        }
                    });
                    _.each(categories, function (item) {
                        // foreach category create empty placeholder
                        if (item.id !== config.KPISLA_ASSESSMENT_CATEGORY_ID && item.id !== config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID) {
                            $scope.additional.processRiskAssessments[item.id].assessments.push({
                                categoryType: item,
                                assessments: '',
                                additionalRisk: ''
                            });
                        }
                    });
                    $scope.assessmentToUpdate.overallRiskRatingCommentary = assessmentDetail.overallRiskRatingCommentary;

                    _getAllProcessRisk();
                }

                /**
                 * Prepares the KPI & SLA's assessments view model.
                 * @param assessmentDetail
                 * @private
                 */
                function _prepareKPISlaAssessmentViewModel(assessmentDetail) {
                    // third tab
                    $scope.assessments.kPISLAAssessments = [];
                    $scope.additional.kPISLAAssessments = [];
                    // transform to view model
                    _.each(assessmentDetail.kpislaAssessments, function (item) {
                        if (item.selectedSLA) {
                            item.selectedSLA = util.convertToArray(item.selectedSLA);
                        }
                        if (item.kpiCategory && item.kpiCategory.id > 0) {
                            var existingKpiAssessmentGroup = $filter('filter')($scope.assessments.kPISLAAssessments, { KPICategory: { id: item.kpiCategory.id } });
                            var kpiDetail = {
                                id: 0,
                                name: '',
                                selectedSLA: item.selectedSLA,
                                additionalKPI: item.additionalKPI,
                                additionalSLA: item.additionalSLA
                            };
                            if (item.kpi) {
                                kpiDetail.id = item.kpi.id;
                                kpiDetail.name = item.kpi.name;
                            }
                            if (item.additionalSLA) {
                                kpiDetail.selectedSLA = [{ id: 'other', Name: 'Other' }];
                            }
                            if (existingKpiAssessmentGroup.length > 0) {
                                existingKpiAssessmentGroup[0].KPIs.push(kpiDetail);
                            } else {
                                $scope.assessments.kPISLAAssessments.push({
                                    KPICategory: item.kpiCategory,
                                    KPIs: [kpiDetail],
                                    SLAs: item.kpiCategory.slAs,
                                    category: { id: config.KPISLA_ASSESSMENT_CATEGORY_ID }
                                });
                            }
                        } else {
                            var existingAdditional = $filter('filter')($scope.additional.kPISLAAssessments, { KPICategory: { name: item.additionalKPICategory } });
                            var kpiDetail = {
                                id: 0,
                                name: '',
                                selectedSLA: item.selectedSLA,
                                additionalKPI: item.additionalKPI,
                                additionalSLA: item.additionalSLA,
                                additionalKPICategory: item.additionalKPICategory,
                            };
                            if (item.additionalSLA) {
                                kpiDetail.selectedSLA = [{ id: 'other', Name: 'Other' }];
                            }
                            if (existingAdditional.length > 0) {
                                existingAdditional[0].KPIs.push(kpiDetail);
                            } else {
                                $scope.additional.kPISLAAssessments.push({
                                    KPICategory: {
                                        id: 'other-' + $scope.additional.kPISLAAssessments.length,
                                        name: item.additionalKPICategory
                                    },
                                    SLAs: [],
                                    KPIs: [kpiDetail],
                                    category: { id: config.KPISLA_ASSESSMENT_CATEGORY_ID }
                                });
                            }
                        }
                    });

                    // extra row for kpi
                    _.each($scope.assessments.kPISLAAssessments, function (kpislaAssessment) {
                        kpislaAssessment.KPIs.push({
                            id: 0,
                            name: ''
                        });
                    });
                    _.each($scope.additional.kPISLAAssessments, function (kpislaAssessment) {
                        kpislaAssessment.KPIs.push({ id: 0, name: '' });
                    });

                    // add new row for additional category
                    $scope.additional.kPISLAAssessments.push({
                        SLAs: [],
                        KPIs: [{}],
                        KPICategory: { id: 'other-' + $scope.additional.kPISLAAssessments.length, name: '' },
                        additionalKPI: '',
                        additionalSLA: '',
                        category: { id: config.KPISLA_ASSESSMENT_CATEGORY_ID }
                    });
                    _attachKPICategoryAndSlas();
                }

                /**
                 * Prepares the functional area process assessments view model.
                 * @param assessmentDetail
                 * @private
                 */
                function _prepareFunctionalAreaProcessAssessmentViewModel(assessmentDetail) {
                    $scope.assessments.functionalAssessments = [];
                    $scope.additional.functionalAssessments = [];
                    // transform to view model
                    _.each(assessmentDetail.functionalAreaProcessAssessments, function (item) {
                        var fas = _getFunctionalAreaProcessControlAssessment(item);
                        fas.id = 0;
                        fas.name = '';
                        fas.additionalSubProcess = item.additionalSubProcess;
                        fas.additionalRisk = item.additionalRisk;
                        fas.selectableControlTypes = [];
                        if (item.coreProcess && item.coreProcess.id > 0) {
                            var existingAssessmentGroup = $filter('filter')($scope.assessments.functionalAssessments, { coreProcess: { id: item.coreProcess.id } });
                            if (item.subProcessRisk) {
                                fas.id = item.subProcessRisk.id;
                                fas.name = item.subProcessRisk.name;
                                fas.risk = item.subProcessRisk.risk;
                            }
                            if (existingAssessmentGroup.length > 0) {
                                existingAssessmentGroup[0].subProcessRisks.push(fas);
                            } else {
                                $scope.assessments.functionalAssessments.push({
                                    coreProcess: item.coreProcess,
                                    subProcessRisks: [fas],
                                    category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID }
                                });
                            }
                        } else {
                            var existingAdditional = $filter('filter')($scope.additional.functionalAssessments, { coreProcess: { name: item.additionalCoreProcess } });
                            fas.additionalCoreProcess = item.additionalCoreProcess;
                            if (existingAdditional.length > 0) {
                                existingAdditional[0].subProcessRisks.push(fas);
                            } else {
                                $scope.additional.functionalAssessments.push({
                                    coreProcess: {
                                        id: 'other-' + $scope.additional.functionalAssessments.length,
                                        name: item.additionalCoreProcess
                                    },
                                    subProcessRisks: [fas],
                                    category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID }
                                });
                            }
                        }
                    });

                    // extra row for sub processes
                    _.each($scope.assessments.functionalAssessments, function (fas) {
                        fas.subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: []
                        });
                    });
                    _.each($scope.additional.functionalAssessments, function (fas) {
                        fas.subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: []
                        });
                    });

                    // add new row for additional category
                    $scope.additional.functionalAssessments.push({
                        id: 0,
                        name: '',
                        controlTypes: [],
                        selectableControlTypes: [],
                        subProcessRisks: [{
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: []
                        }],
                        coreProcess: {
                            id: 'other-' + $scope.additional.functionalAssessments.length,
                            name: ''
                        },
                        additionalSubProcess: '',
                        additionalRisk: '',
                        category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID }
                    });
                }

                function _getFunctionalAreaProcessControlAssessment(assesssment) {
                    var pca = {};
                    pca.likelihoodOfOccurrence = util.convertToArray(assesssment.likelihoodOfOccurrence);
                    if (assesssment.likelihoodOfOccurrence && assesssment.likelihoodOfOccurrence.id == config.USER_DEFINED_KEY_LIKELIHOOD_OF_OCCURRENCE_ID) {
                        pca.otherLikelihoodOfOccurrence = assesssment.otherLikelihoodOfOccurrence;
                    }
                    pca.riskImpacts = assesssment.riskImpacts;
                    if (assesssment.riskExposure) {
                        angular.forEach($scope.lookups.riskExposures, function (item) {
                            if (item.id === assesssment.riskExposure.id) {
                                pca.riskExposure = item;
                            }
                        });
                    }
                    if (assesssment.controlAssessments) {
                        pca.controlTypes = [];
                        pca.inputs = [];
                        pca.otherNames = {};
                        var otherCount = 0;
                        _.each(assesssment.controlAssessments, function (controlAssessment, index) {
                            var controlType = controlAssessment.controlType;
                            if (!controlAssessment.controlType) {
                                otherCount++;
                                pca.otherNames['other-' + otherCount] = controlAssessment.otherControlType;
                                controlType = {
                                    id: 'other-' + otherCount
                                };
                            }
                            pca.inputs[index] = {};
                            pca.inputs[index].controlObjective = controlAssessment.controlObjective;
                            pca.inputs[index].controlFrequency = util.convertToArray(controlAssessment.controlFrequency);
                            pca.inputs[index].controlDesigns = controlAssessment.controlDesigns;
                            pca.inputs[index].testingFrequencies = controlAssessment.testingFrequencies;
                            pca.inputs[index].controlTriggers = controlAssessment.controlTriggers;
                            pca.inputs[index].keyControlsMaturity = util.convertToArray(controlAssessment.keyControlsMaturity);
                            if (_.findWhere(controlAssessment.testingFrequencies, { id: config.USER_DEFINED_TESTING_FREQUENCY_ID })) {
                                pca.inputs[index].otherTestingFrequency = controlAssessment.otherTestingFrequency;
                            }
                            if (controlAssessment.keyControlsMaturity && controlAssessment.keyControlsMaturity.id == config.USER_DEFINED_KEY_CONTROLS_MATURITY_ID) {
                                pca.inputs[index].otherKeyControlMaturity = controlAssessment.otherKeyControlMaturity;
                            }
                            pca.inputs[index].oldTestingFrequencies = angular.copy(pca.inputs[index].testingFrequencies);
                            pca.controlTypes.push(controlType);
                        });
                    }
                    return pca;
                }

                function _getProcessControlAssessment(assesssment) {
                    var pca = {};
                    if (assesssment.riskExposure) {
                        angular.forEach($scope.lookups.riskExposures, function (item) {
                            if (item.id === assesssment.riskExposure.id) {
                                pca.riskExposure = item;
                            }
                        });
                    }
                    if (assesssment.controlAssessments) {
                        pca.controlTypes = [];
                        pca.inputs = [];
                        pca.otherNames = {};
                        var otherCount = 0;
                        _.each(assesssment.controlAssessments, function (controlAssessment, index) {
                            var controlType = controlAssessment.controlType;
                            if (!controlAssessment.controlType) {
                                otherCount++;
                                pca.otherNames['other-' + otherCount] = controlAssessment.otherControlType;
                                controlType = {
                                    id: 'other-' + otherCount
                                };
                            }
                            pca.inputs[index] = {};
                            pca.inputs[index].controlFrequency = util.convertToArray(controlAssessment.controlFrequency);
                            pca.inputs[index].controlDesigns = controlAssessment.controlDesigns;
                            pca.inputs[index].testingFrequencies = controlAssessment.testingFrequencies;
                            pca.inputs[index].keyControlsMaturity = util.convertToArray(controlAssessment.keyControlsMaturity);
                            if (_.findWhere(controlAssessment.testingFrequencies, { id: config.USER_DEFINED_TESTING_FREQUENCY_ID })) {
                                pca.inputs[index].otherTestingFrequency = controlAssessment.otherTestingFrequency;
                            }
                            if (controlAssessment.keyControlsMaturity && controlAssessment.keyControlsMaturity.id == config.USER_DEFINED_KEY_CONTROLS_MATURITY_ID) {
                                pca.inputs[index].otherKeyControlMaturity = controlAssessment.otherKeyControlMaturity;
                            }
                            pca.inputs[index].oldTestingFrequencies = angular.copy(pca.inputs[index].testingFrequencies);
                            pca.controlTypes.push(controlType);
                        });
                    }
                    return pca;
                }

                function _applyControlTypeWatcher(value, assessment) {
                    $scope.$watch(value + '.controlTypes', function (controlTypes) {

                        var others = _.filter(assessment.selectableControlTypes, function (item) {
                            return typeof item.id === 'string' && item.id.indexOf('other') !== -1;
                        }).length;
                        if (_.filter(controlTypes, function (item) {
                            return item.id === 'other-' + (others);
                        }).length) {
                            assessment.selectableControlTypes.push({
                                id: 'other-' + (others + 1),
                                name: 'Other'
                            });
                        }
                    });
                }

                $scope.checkControlTypeId = function (id) {
                    return typeof id !== 'string';
                };

                function _attachKPICategoryAndSlas() {
                    LookupService.getKPICategories().then(function (result) {
                        $scope.lookups.KPICategories = result;
                        $scope.lookups.additionalKpiSlas = util.prepareAdditionalSLAsAssessments(result);
                        _.each($scope.assessments.kPISLAAssessments, function (kpislaAssessment) {
                            var slAs = _.findWhere(result, { id: kpislaAssessment.KPICategory.id }).slAs;
                             _addKPITypes(kpislaAssessment.KPIs, slAs);
                        });
                        _.each($scope.additional.kPISLAAssessments, function (kpislaAssessment) {
                            var slAs = angular.copy($scope.lookups.additionalKpiSlas);
                             _addKPITypes(kpislaAssessment.KPIs, slAs);
                        });
                    }, util.handleHttpError);
                }

                /**
                 * Resets the Functional area process assessment based on selected core processes
                 * @private
                 */
                function _resetFunctionalAreaProcessAssessments() {
                    function _addTypes(subProcessRisks, types) {
                        if (subProcessRisks) {
                            _.each(subProcessRisks, function (subProcessRisk) {
                                var controlTypes = angular.copy(types);
                                subProcessRisk.controlTypes = [];
                                subProcessRisk.selectableControlTypes = controlTypes;
                            });
                        }
                    }
                    $scope.assessments.functionalAssessments = [];
                    $scope.additional.functionalAssessments = [];
                    _.each($scope.lookups.coreProcesses, function (coreProcess) {
                        coreProcess.subProcessRisks.push({ id: 0, name: '' });
                        coreProcess.controlTypes.push({
                            id: 'other-1',
                            name: 'Other'
                        });
                        _addTypes(coreProcess.subProcessRisks, coreProcess.controlTypes);
                        $scope.assessments.functionalAssessments.push({
                            coreProcess: coreProcess,
                            subProcessRisks: coreProcess.subProcessRisks,
                            additionalSubProcess: '',
                            additionalRisk: '',
                            category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID }
                        });
                    });
                    if ($scope.lookups.coreProcesses.length <= 0) {
                        $scope.lookups.coreProcesses = [{
                            controlTypes: [{
                                id: 'other-1',
                                name: 'Other'
                            }]
                        }];
                    }
                    var additionalControlTypes = angular.copy($scope.lookups.additionalFunctionalControlTypes);
                    additionalControlTypes.push({ id: 'other-1', name: 'Other' });
                    $scope.additional.functionalAssessments[0] = {
                        subProcessRisks: [{
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: additionalControlTypes
                        }],
                        coreProcess: {
                            id: 'other-0',
                            name: '',
                            controlTypes: angular.copy($scope.lookups.coreProcesses[$scope.lookups.coreProcesses.length - 1].controlTypes)
                        },
                        additionalCoreProcess: '',
                        additionalSubProcess: '',
                        additionalRisk: '',
                        category: { id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID }
                    };
                    _.each($scope.assessments.functionalAssessments, function (assessment, i) {
                        _.each(assessment.subProcessRisks, function (subProcess, j) {
                            _applyControlTypeWatcher('assessments.functionalAssessments[' + i + '].subProcessRisks[' + j + ']', subProcess);
                        });
                    });
                    _.each($scope.additional.functionalAssessments, function (assessment, i) {
                        _.each(assessment.subProcessRisks, function (subProcess, j) {
                            _applyControlTypeWatcher('additional.functionalAssessments[' + i + '].subProcessRisks[' + j + ']', subProcess);
                        });
                    });
                }

                function _attachFunctionalAreaControlTypes() {
                    _.each($scope.assessments.functionalAssessments, function (fas, i) {
                        var controlsTypes = angular.copy(fas.coreProcess.controlTypes);
                        _addControlTypes(fas.subProcessRisks, controlsTypes);
                        _.each(fas.subProcessRisks, function (subProcess, j) {
                            _applyControlTypeWatcher('assessments.functionalAssessments[' + i + '].subProcessRisks[' + j + ']', subProcess);
                        });
                    });

                    _.each($scope.additional.functionalAssessments, function (fas, i) {
                        _addControlTypes(fas.subProcessRisks, $scope.lookups.additionalFunctionalControlTypes);
                        _.each(fas.subProcessRisks, function (subProcess, j) {
                            _applyControlTypeWatcher('additional.functionalAssessments[' + i + '].subProcessRisks[' + j + ']', subProcess);
                        });
                    });
                }

                /**
                 * Gets all process risks
                 * @private
                 */
                function _getAllProcessRisk() {
                    LookupService.getAllProcessRisks().then(function (result) {
                        $scope.lookups.processRisks = result;
                        _attachProcessRisksControlTypes();
                    }, util.handleHttpError);
                }

                function _attachProcessRisksControlTypes() {
                    for (var key in $scope.assessments.processRiskAssessments) {
                        var processRisksAssessments = $scope.assessments.processRiskAssessments[key];
                        _addControlTypes(processRisksAssessments.assessments, processRisksAssessments.assessments[0].processRisk.controlTypes);
                        _.each(processRisksAssessments.assessments, function (assessment, i) {
                            _applyControlTypeWatcher('assessments.processRiskAssessments[' + key + '].assessments[' + i + ']', assessment);
                        });

                        $scope.lookups.additionalProcessRisksControlTypes[key] = util.prepareAdditionalProcessRiskControlTypes($scope.lookups.processRisks, key);
                        _addControlTypes($scope.additional.processRiskAssessments[key].assessments, $scope.lookups.additionalProcessRisksControlTypes[key]);
                        _.each($scope.additional.processRiskAssessments[key].assessments, function (assessment, i) {
                            _applyControlTypeWatcher('additional.processRiskAssessments[' + key + '].assessments[' + i + ']', assessment);
                        });
                    }
                }

                function _addControlTypes(assessments, types) {
                    if (assessments) {
                        _.each(assessments, function (assessment) {
                            var controlTypes = angular.copy(types);
                            assessment.selectableControlTypes = controlTypes || [];
                            var otherCount = 0;
                            _.each(assessment.controlTypes, function (controlType) {
                                if (typeof controlType.id === 'string') {
                                    otherCount++;
                                    assessment.selectableControlTypes.push({
                                        id: 'other-' + otherCount,
                                        name: 'Other'
                                    });
                                }
                            });
                            assessment.selectableControlTypes.push({
                                id: 'other-' + (otherCount + 1),
                                name: 'Other'
                            });
                        });
                    }
                }

                $scope.isLoaded = true;

                function _addKPITypes(kpis, types) {
                    if (kpis) {
                        _.each(kpis, function (kpi) {
                            var slAs = angular.copy(types);
                            slAs.push({
                                id: 'other',
                                name: 'Other'
                            });
                            kpi.SLAs = slAs;
                        });
                    }
                }

                function _checkEditPermission(assessment) {
                    var result = false;
                    if ((assessment.approvalStatus === config.APPROVAL_STATUS.AWAITING_BU_FUNCTIONAL_APPROVAL.value && $rootScope.user.role === config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME) ||
                        (assessment.approvalStatus === config.APPROVAL_STATUS.AWAITING_BU_RISK_MANAGEMENT_APPROVAL.value && $rootScope.user.role === config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME) ||
                        (assessment.approvalStatus === config.APPROVAL_STATUS.AWAITING_DIVISIONAL_RISK_MANAGEMENT_APPROVAL.value && $rootScope.user.role === config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME)) {
                        result = true;
                        $scope.permission.approverUpdate = true;
                    } else {

                        if ((assessment.approvalStatus === config.APPROVAL_STATUS.DRAFT.value || assessment.approvalStatus === config.APPROVAL_STATUS.REJECTED.value) &&
                            $rootScope.user.role === config.ROLES.OWNER_ROLE_NAME) {
                            result = true;
                        }
                    }
                    return result;
                }
            }
        ]);
})();
