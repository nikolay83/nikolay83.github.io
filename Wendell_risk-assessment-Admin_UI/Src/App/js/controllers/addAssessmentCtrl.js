/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is controller for add assessment page.
 *
 * Changes in 1.1:
 * - Fixed issue of assigning process risk by category id
 * @author veshu
 * @version 1.1
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('addAssessmentCtrl', ['$rootScope', '$window', '$scope', '$location', '$filter', 'storage', 'config', 'util',
            'AssessmentService', 'LookupService',
            function ($rootScope, $window, $scope, $location, $filter, storage, config, util, AssessmentService, LookupService) {
                //sets the navigation menu as active
                $rootScope.currentMenu = config.MENUS.ADD_ASSESSMENT;
                storage.storeLastMenu(config.MENUS.ADD_ASSESSMENT);
                $scope.currentTab = {id: 1};
                $scope.assessmentToAdd = {};
                $scope.overallRiskRatingReport = {};
                $scope.lookups = {
                    coreProcesses: [],
                    additionalProcessRisksControlTypes: {},
                    additionalFunctionalControlTypes: []
                };
                $scope.isLoaded = false;
                $scope.showIncompleted = {Error: false}; // true if any validation error during submit

                // show prior changes by default
                $scope.functionChanges = {
                    isPriorChanges: true,
                    isFutureChanges: false,
                    priorChanges: [{}, {}, {}, {}],
                    futureChanges: [{}, {}, {}, {}]
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
                        KPICategory: {id: 'other-0', name: ''},
                        KPIs: [{}],
                        additionalKPI: '',
                        additionalSLA: '',
                        category: {id: config.KPISLA_ASSESSMENT_CATEGORY_ID}
                    }],
                    functionalAssessments: [{
                        subProcessRisks: [{
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: angular.copy($scope.lookups.coreProcesses[$scope.lookups.coreProcesses.length - 1].controlTypes)
                        }],
                        coreProcess: {id: 'other-0', name: ''},
                        additionalCoreProcess: '',
                        additionalSubProcess: '',
                        additionalRisk: '',
                        category: {id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID},
                        inputs: []
                    }],
                    processRiskAssessments: [] // holds <key, assessment[]>
                };
                _.each($scope.additional.functionalAssessments, function (assessment, i) {
                    _.each(assessment.subProcessRisks, function (subProcess, j) {
                        _applyControlTypeWatcher('additional.functionalAssessments[' + i + '].subProcessRisks[' + j + ']', subProcess);
                    });
                });

                $scope.lookups.additionalControlTypes = [];
                $scope.totalPercentageSum = 0;
                $scope.validation = {failed: 0};
                $scope.isProcessing = false;

                /**
                 * Moves to the next tab
                 */
                $rootScope.nextTab = function () {
                    if ($scope.currentTab.id === 3) {
                        $scope.getOverallRiskRatingReport();
                    }else{
                        $scope.currentTab.id = $scope.currentTab.id + 1;
                    }
                };

                /**
                 * Handles the save as draft request
                 */
                $scope.saveAsDraft = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToAdd);
                    if (!assessment.functionalArea || !assessment.functionalArea.id || assessment.functionalArea.id < 1) {
                        $scope.currentTab.id = 1;
                        util.showError("Please select functional area.");
                    } else {
                        $scope.isProcessing = true;
                        AssessmentService.createAsDraft(assessment).then(function () {
                            $scope.isProcessing = false;
                            util.showInfo("The assessment has been save successfully.");
                            _goToHome();
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
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToAdd);
                    if (util.validateFailed(assessment, $scope)) {
                        $scope.showIncompleted.Error = true;
                        angular.element("body").animate({scrollTop: angular.element("body").offset().top}, "slow");
                    } else {
                        $scope.isProcessing = true;
                        $scope.showIncompleted.Error = false;
                        AssessmentService.submit(assessment).then(function () {
                            $scope.isProcessing = false;
                            util.showInfo("The assessment has been submitted for approval successfully.");
                            _goToHome();
                        }, function (error) {
                            $scope.isProcessing = false;
                            util.handleHttpError(error);
                        });
                    }
                };

                /**
                 * Handles the save as export request
                 */
                $scope.export = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToAdd);
                    AssessmentService.exportAssessment(assessment, config.EXPORT_FORMAT.EXCEL);
                };

                /**
                 * Gets the overall risk rating report
                 */
                $scope.getOverallRiskRatingReport = function () {
                    var assessment = util.prepareAssessment($scope, $scope.assessmentToAdd);
                    if (!assessment.functionalAreaProcessAssessments) {
                        $scope.currentTab.id = 3;
                        $scope.pca.categoryType = config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID;
                        util.showError("Please add few functional area process assessments.");
                    } else {
                        $scope.currentTab.id = 4;
                        AssessmentService.getOverallRiskRatingReport(assessment).then(function (result) {
                            $scope.overallRiskRatingReport = result;
                            var riskReports = ['likelihoodOfOccurrenceReport', 'riskExposureReport', 'keyControlsMaturityReport'];
                            _.each(riskReports, function (riskReport) {
                                $scope.updateOrRenderRiskChart(riskReport);
                            });

                            $scope.updateOrRenderResidualChart();
                        }, util.handleHttpError);
                    }
                };

                /**
                 * Resolves the lookup dependent to business unit
                 */
                $scope.resolveBusinessUnitRelatedLookup = function () {
                    var selectedBU = _getSingleSelectValue($scope.assessmentToAdd.businessUnit);
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

                };

                /**
                 * Resolves the lookup dependent to functional area
                 */
                $scope.resolveFunctionalAreaRelatedLookup = function () {
                    var selectedValue = _getSingleSelectValue($scope.assessmentToAdd.functionalArea);
                    if (selectedValue) {
                        LookupService.getCoreProcesses(selectedValue.id).then(function (result) {
                            $scope.lookups.coreProcesses = util.removeAdditional(result);
                            $scope.lookups.additionalFunctionalControlTypes = util.prepareAdditionalFunctionalControlTypes(result);
                            _resetFunctionalAreaProcessAssessments();
                        }, util.handleHttpError);
                    } else {
                        $scope.lookups.coreProcesses = [];
                        $scope.lookups.additionalFunctionalControlTypes = util.prepareAdditionalFunctionalControlTypes([]);
                        _resetFunctionalAreaProcessAssessments();
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
                    var fas = $filter('filter')($scope.assessments.functionalAssessments, {coreProcess: {id: coreProcessId}});
                    if (index + 1 === fas[0].subProcessRisks.length) {
                        var assessmentIndex = $scope.assessments.functionalAssessments.findIndex(function (item) {
                            return item.coreProcess.id === coreProcessId;
                        });
                        fas[0].subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: angular.copy(fas[0].coreProcess.controlTypes),
                            inputs: []
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
                        $scope.lookups.coreProcesses = [{controlTypes: [{id: 'other-1', name: 'Other'}]}];
                    }
                    var controlTypes = angular.copy($scope.lookups.additionalFunctionalControlTypes);
                    var fas = $filter('filter')($scope.additional.functionalAssessments, {coreProcess: {id: coreProcessId}});
                    if (index + 1 === fas[0].subProcessRisks.length) {
                        var assessmentIndex = $scope.additional.functionalAssessments.findIndex(function (item) {
                            return item.coreProcess.id === coreProcessId;
                        });
                        fas[0].subProcessRisks.push({
                            id: 0,
                            name: '',
                            controlTypes: [],
                            selectableControlTypes: controlTypes,
                            inputs: []
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
                        $scope.lookups.coreProcesses = [{controlTypes: [{id: 'other-1', name: 'Other'}]}];
                    }
                    var controlTypes = angular.copy($scope.lookups.additionalFunctionalControlTypes);
                    if (index + 1 === $scope.additional.functionalAssessments.length) {
                        $scope.additional.functionalAssessments.push({
                            category: {id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID},
                            coreProcess: {id: 'other-' + (index + 1), name: '', controlTypes: controlTypes},
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
                            category: {id: categoryId},
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
                    _.each($scope.assessmentToAdd.selectedSites, function (item) {
                        if (item.percentage) {
                            $scope.totalPercentageSum += item.percentage.value || 0;
                        }
                    });
                };

                /**
                 * Gets the lookup values required
                 * @private
                 */
                function _getLookupValues() {
                    LookupService.getAllBusinessUnits().then(function (result) {
                        $scope.lookups.businessUnits = result;
                    }, util.handleHttpError);

                    LookupService.getAllPercentages().then(function (result) {
                        $scope.lookups.percentages = result;
                    }, util.handleHttpError);

                    LookupService.getAllAssessmentTypes().then(function (result) {
                        $scope.lookups.assessmentTypes = result;
                    }, util.handleHttpError);

                    LookupService.getAllAssessmentStatuses().then(function (result) {
                        $scope.lookups.assessmentStatuses = result;
                    }, util.handleHttpError);

                    LookupService.getAllChangeTypes().then(function (result) {
                        $scope.lookups.changeTypes = result;
                    }, util.handleHttpError);

                    LookupService.getAllSites().then(function (result) {
                        $scope.lookups.sites = result;
                    }, util.handleHttpError);

                    LookupService.getAllCategories().then(function (result) {
                        $scope.lookups.categories = result;
                        _.each(result, function (item) {
                            // foreach category create empty placeholder
                            if (item.id !== config.KPISLA_ASSESSMENT_CATEGORY_ID && item.id !== config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID) {
                                $scope.assessments.processRiskAssessments[item.id] = {
                                    categoryType: item,
                                    assessments: []
                                };
                                $scope.additional.processRiskAssessments[item.id] = {
                                    categoryType: item,
                                    assessments: [{}]
                                };
                            }
                        });
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
                        _.each($scope.lookups.categories, function (category) {
                            $scope.legends.push(category.name);
                        });
                        _getAllProcessRisk();
                    }, util.handleHttpError);

                    LookupService.getKPICategories().then(function (result) {
                        $scope.lookups.KPICategories = result;
                        _resetKPIAssessments();
                    }, util.handleHttpError);

                    LookupService.getAllLikelihoodOfOccurrences().then(function (result) {
                        $scope.lookups.likelihoodOfOccurrences = result;
                    }, util.handleHttpError);

                    LookupService.getAllRiskImpacts().then(function (result) {
                        $scope.lookups.riskImpacts = result;
                    }, util.handleHttpError);

                    LookupService.getAllRiskExposures().then(function (result) {
                        $scope.lookups.riskExposures = result;
                    }, util.handleHttpError);

                    LookupService.getAllControlFrequencies().then(function (result) {
                        $scope.lookups.controlFrequencys = result;
                    }, util.handleHttpError);
                    LookupService.getAllControlDesigns().then(function (result) {
                        $scope.lookups.controlDesigns = result;
                    }, util.handleHttpError);
                    LookupService.getAllTestingFrequencies().then(function (result) {
                        $scope.lookups.testingFrequencies = result;
                    }, util.handleHttpError);
                    LookupService.getAllControlTriggers().then(function (result) {
                        $scope.lookups.controlTriggers = result;
                    }, util.handleHttpError);
                    LookupService.getAllKeyControlsMaturities().then(function (result) {
                        $scope.lookups.keyControlsMaturities = result;
                    }, util.handleHttpError);
                }

                /**
                 * Gets all process risks
                 * @private
                 */
                function _getAllProcessRisk() {
                    LookupService.getAllProcessRisks().then(function (result) {
                        $scope.lookups.processRisks = result;
                        _.each(result, function (item) {
                            if (item.category.id !== config.KPISLA_ASSESSMENT_CATEGORY_ID
                                && item.category.id !== config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID) {
                                $scope.assessments.processRiskAssessments[item.category.id].assessments.push({
                                    processRisk: item,
                                    inputs: []
                                });
                            }
                        });
                        _attachProcessRisksControlTypes();
                    }, util.handleHttpError);
                }

                _getLookupValues();

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
                    if (_.findWhere(model.testingFrequencies, {id: config.USER_DEFINED_TESTING_FREQUENCY_ID})
                        && !_.findWhere(model.oldTestingFrequencies, {id: config.USER_DEFINED_TESTING_FREQUENCY_ID})) {
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

                $scope.checkControlTypeId = function (id) {
                    return typeof id !== 'string';
                };

                /**
                 * Redirects to home
                 * @private
                 */
                function _goToHome() {
                    $location.path("/");
                }

                /**
                 * Gets the selected value of single dropdown
                 * @param model the ng-model
                 * @returns {Object} the object with id
                 * @private
                 */
                function _getSingleSelectValue(model) {
                    if (model && model[0]) {
                        return model[0];
                    } else {
                        return null;
                    }
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

                function _addControlTypes(assessments, types) {
                    if (assessments) {
                        _.each(assessments, function (assessment) {
                            var controlTypes = angular.copy(types);
                            if (!controlTypes) {
                                controlTypes = [];
                            }
                            controlTypes.push({
                                id: 'other-1',
                                name: 'Other'
                            });
                            assessment.selectableControlTypes = controlTypes;
                        });
                    }
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
                        coreProcess.subProcessRisks.push({id: 0, name: ''});
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
                            category: {id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID}
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
                    additionalControlTypes.push({id: 'other-1', name: 'Other'});
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
                        category: {id: config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID}
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

                /**
                 * Resets the kpi & sla assessment
                 * @private
                 */
                function _resetKPIAssessments() {
                    _.each($scope.lookups.KPICategories, function (kpiCategory) {
                        kpiCategory.KPIs = kpiCategory.kpIs;
                        kpiCategory.KPIs.push({id: 0, name: ''});
                        _addKPITypes(kpiCategory.KPIs, kpiCategory.slAs);
                        $scope.assessments.kPISLAAssessments.push({
                            KPICategory: kpiCategory,
                            KPIs: kpiCategory.kpIs,
                            SLAs: kpiCategory.slAs,
                            additionalKPI: '',
                            additionalSLA: '',
                            category: {id: config.KPISLA_ASSESSMENT_CATEGORY_ID},
                        });
                    });
                    $scope.lookups.additionalKpiSlas = util.prepareAdditionalSLAsAssessments($scope.lookups.KPICategories);
                    $scope.additional.kPISLAAssessments[0] = {
                        SLAs: angular.copy($scope.lookups.additionalKpiSlas),
                        KPIs: [{
                            id: 0,
                            name: '',
                            SLAs: []
                        }],
                        KPICategory: {id: 'other-0', name: ''},
                        additionalKPI: '',
                        additionalSLA: '',
                        category: {id: config.KPISLA_ASSESSMENT_CATEGORY_ID}
                    };
                     _addKPITypes($scope.additional.kPISLAAssessments[0].KPIs, $scope.lookups.additionalKpiSlas);
                }

                function _attachProcessRisksControlTypes() {
                    for (var key in $scope.assessments.processRiskAssessments) {
                        var processRisksAssessments = $scope.assessments.processRiskAssessments[key];
                        _addControlTypes(processRisksAssessments.assessments, processRisksAssessments.assessments[0].processRisk.controlTypes);
                        _.each(processRisksAssessments.assessments, function (assessment, i) {
                            _applyControlTypeWatcher('assessments.processRiskAssessments[' + key + '].assessments[' + i + ']', assessment);
                        });

                        var additionalAssessments = $scope.additional.processRiskAssessments[key];
                        $scope.lookups.additionalProcessRisksControlTypes[key] = util.prepareAdditionalProcessRiskControlTypes($scope.lookups.processRisks, key);
                        _addControlTypes(additionalAssessments.assessments, $scope.lookups.additionalProcessRisksControlTypes[key]);
                        _.each(additionalAssessments.assessments, function (assessment, i) {
                            _applyControlTypeWatcher('additional.processRiskAssessments[' + key + '].assessments[' + i + ']', assessment);
                        });
                    }
                }

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

                $scope.isLoaded = true;
            }
        ]);
})();
