/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This is controller for home page (owners and approvers).
 *
 * @author veshu
 * @version 1.0
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', ['$rootScope', '$scope', 'storage', 'config', 'util', 'AssessmentService',
            function ($rootScope, $scope, storage, config, util, AssessmentService) {
                //sets the navigation menu as active
                $rootScope.currentMenu = config.MENUS.HOME;
                storage.storeLastMenu(config.MENUS.HOME);
                $scope.criteria = {};    // criteria:AssessmentSearchCriteria

                // pagination parameters
                $scope.pageNumber = 1;
                $scope.pageSize = config.DEFAULT_PAGE_SIZE;
                $scope.sortBy = "Title";
                $scope.sortAscending = false;

                $scope.searchResult = {
                    totalRecords: 0
                };   // searchResult:SearchResult<Assessment>
                $scope.isSearched = false;
                $scope.isApproverUser();
                if ($scope.isApprover) {
                    $scope.sortBy = "SubmitTime";
                }
                /**
                 * Searches the assessments
                 */
                $scope.searchAssessments = function (resetPage) {
                    var criteria;
                    if (resetPage) {
                        $scope.pageNumber = 1;
                        $scope.isSearched = false;
                        criteria = _getCriteria();
                    }
                    else {
                        // if it is not new search then don't update other criteria, instead use last search criteria
                        criteria = util.applyBaseSearchCriteria($scope.lastSearchCriteria, $scope.pageNumber,
                            $scope.sortBy, $scope.sortAscending);
                    }
                    if (criteria) {
                        $scope.isSearching = true;
                        AssessmentService.search(criteria).then(function (searchResult) {
                            $scope.searchResult = searchResult;
                            $scope.isSearched = true;
                            $scope.isSearching = false;
                        }, function (error) {
                            $scope.isSearching = false;
                            $scope.isSearched = true;
                            util.handleHttpError(error);
                        });
                    }
                };

                /**
                 * Handles the page changed event
                 * @param {Number} newPage the new page number
                 */
                $scope.pageChanged = function (newPage) {
                    $scope.pageNumber = newPage;
                    $scope.searchAssessments(false);
                };

                /**
                 * Handles the sorting event on column header
                 * @param {String} newSortingOrder the column name to sort by
                 */
                $scope.sort_by = function (newSortingOrder) {
                    if ($scope.sortBy === newSortingOrder) {
                        $scope.sortAscending = !$scope.sortAscending;
                    }
                    $scope.sortBy = newSortingOrder;
                    $scope.searchAssessments(false);
                };

                /**
                 * Gets the search criteria
                 * @returns {Object} the search criteria
                 * @private
                 */
                function _getCriteria() {
                    var startDate = util.getNullWhenEmpty($scope.criteria.submitDateStart);
                    var endDate = util.getNullWhenEmpty($scope.criteria.submitDateEnd);
                    if (endDate && startDate && moment(startDate, "YYYY-MM-DD") > moment(endDate, "YYYY-MM-DD")) {
                        util.showError("To date should not be smaller than start date.");
                    } else {
                        if (endDate) {
                            endDate = endDate + " 23:59:59"; // 23:59:59 will ensure records changed today will present
                        }
                        var criteria = {
                            title: util.getNullWhenEmpty($scope.criteria.title),
                            submitDateStart: startDate,
                            submitDateEnd: endDate,
                            approverRealName: $scope.criteria.approverRealName,
                            submitterRealName: $scope.criteria.submitterRealName
                        };

                        if ($scope.criteria.approvalStatuses && $scope.criteria.approvalStatuses.length > 0) {
                            criteria.approvalStatuses = $scope.criteria.approvalStatuses;
                        }

                        criteria = util.applyBaseSearchCriteria(criteria, $scope.pageNumber, $scope.sortBy, $scope.sortAscending);

                        $scope.lastSearchCriteria = criteria;
                        return criteria;
                    }
                }
            }
        ]);
})();