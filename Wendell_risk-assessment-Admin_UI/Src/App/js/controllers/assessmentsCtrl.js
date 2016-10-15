/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This is controller for assessments page.
 *
 * @author veshu
 * @version 1.0
 */

(function () {
    'use strict';
    angular
        .module('app')
        .controller('assessmentsCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'storage', 'config', 'util', 'AssessmentService',
            function ($rootScope, $scope, $routeParams, $location, storage, config, util, AssessmentService) {
                //sets the navigation menu as active
                $scope.type = $routeParams.type;
                $scope.isSearched = false;
                $scope.methodName = '';
                $scope.permissionToView = true;
                switch ($scope.type) {
                    case config.ASSESSMENT_STATUS.DRAFT:
                        if ($rootScope.isApprover) {
                            $scope.permissionToView = false;
                            $location.path("/home");
                        } else {
                            $rootScope.currentMenu = config.MENUS.DRAFT_ASSESSMENT;
                            $scope.methodName = 'getDraftAssessments';
                        }
                        break;
                    case config.ASSESSMENT_STATUS.AWAITING:
                        $rootScope.currentMenu = config.MENUS.AWAITING_ASSESSMENT;
                        $scope.methodName = 'getAwaitingApprovalAssessments';
                        break;
                    case config.ASSESSMENT_STATUS.APPROVED:
                        $rootScope.currentMenu = config.MENUS.APPROVED_ASSESSMENT;
                        $scope.methodName = 'getApprovedAssessments';
                        break;
                    case config.ASSESSMENT_STATUS.REJECTED:
                        if ($rootScope.isApprover) {
                            $scope.permissionToView = false;
                            $location.path("/home");
                        } else {
                            $rootScope.currentMenu = config.MENUS.REJECTED_ASSESSMENT;
                            $scope.methodName = 'getRejectedAssessments';
                        }
                        break;
                    default:
                        $location.path("/home");
                        break;
                }
                storage.storeLastMenu($rootScope.currentMenu);
                $scope.isSearching = false;
                $scope.criteria = {};

                // pagination parameters
                $scope.criteria.pageNumber = 1;
                $scope.criteria.pageSize = config.DEFAULT_PAGE_SIZE;
                $scope.criteria.sortBy = "Title";
                $scope.criteria.sortAscending = false;

                $scope.searchResult = {
                    totalRecords: 0
                };

                /**
                 * Handles the page changed event
                 * @param {Number} newPage the new page number
                 */
                $scope.pageChanged = function (newPage) {
                    $scope.criteria.pageNumber = newPage;
                    _search();
                };

                /**
                 * Handles the sorting event on column header
                 * @param {String} newSortingOrder the column name to sort by
                 */
                $scope.sort_by = function (newSortingOrder) {
                    if ($scope.criteria.sortBy === newSortingOrder) {
                        $scope.criteria.sortAscending = !$scope.criteria.sortAscending;
                    }
                    $scope.criteria.sortBy = newSortingOrder;
                    _search();
                };

                /**
                 * Performs the search
                 * @private
                 */
                function _search() {
                    if (_.isFunction(AssessmentService[$scope.methodName])) {
                        $scope.isSearching = true;
                        $scope.criteria.SortType=$scope.criteria.sortAscending ? config.SORT_DIR.ASC : config.SORT_DIR.DESC;
                        AssessmentService[$scope.methodName]($scope.criteria).then(function (result) {
                            $scope.searchResult = result;
                            $scope.isSearching = false;
                            $scope.isSearched = true;
                        }, function (error) {
                            $scope.isSearching = false;
                            util.handleHttpError(error);
                        });
                    }
                }

                if ($scope.permissionToView) {
                    _search();
                }
            }]);
})();