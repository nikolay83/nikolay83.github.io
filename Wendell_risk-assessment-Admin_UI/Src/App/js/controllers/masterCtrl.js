/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is controller for the common element, it handles the header and footer.
 *
 * Changes in 1.1:
 *  -Added new functions 'isApproverUser', 'goBackByLastMenu'
 * @author veshu
 * @version 1.1
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('masterCtrl', ['$rootScope', '$scope', '$location', 'storage', 'util', 'config', 'SecurityService',
            'LookupService', 'AssessmentService',
            function ($rootScope, $scope, $location, storage, util, config, SecurityService, LookupService, AssessmentService) {

                $scope.draftCount = 0;  // The count of draft assessments. It's only available for owners.
                $scope.awaitingApprovalCount = 0;  // The count of awaiting approval assessment
                $scope.approvedCount = 0;  // The count of approved assessments.
                $scope.rejectedCount = 0;  // The count of rejected assessments. It's only available for owners.

                /**
                 * Gets the count of assessments in different status
                 */
                $scope.getCounts = function () {
                    // call if user is logged in only
                    if (util.isLoggedIn()) {

                        // Get count of awaiting approval assessment
                        AssessmentService.getAwaitingApprovalCount().then(function (result) {
                            $scope.awaitingApprovalCount = result;
                        }, util.handleHttpError);

                        // Get count of approved assessments
                        AssessmentService.getApprovedCount().then(function (result) {
                            $scope.approvedCount = result;
                        }, util.handleHttpError);

                        if (util.isUserInRole(config.ROLES.OWNER_ROLE_NAME)) {
                            // Get the count of rejected assessments. It's only available for owners.
                            AssessmentService.getRejectedCount().then(function (result) {
                                $scope.rejectedCount = result;
                            }, util.handleHttpError);

                            // Get count of draft assessments
                            AssessmentService.getDraftCount().then(function (result) {
                                $scope.draftCount = result;
                            }, util.handleHttpError);

                        }
                    }
                };
                $rootScope.getCounts = $scope.getCounts;
                /**
                 * Handles the logout request
                 */
                $scope.logout = function () {
                    SecurityService.revokeToken();
                    // don't wait to response either the method success or fail user should be
                    // logout
                    util.logout();
                };

                /**
                 * Checks the current user permission to given action
                 * @param {String} action the action to check
                 * @returns {Boolean} true if user has permission else false
                 */
                $scope.checkPermission = function (action) {
                    if (!$rootScope.user || !$rootScope.user.role) {
                        return false;
                    }
                    var permission = _.findWhere(config.PERMISSIONS, {action: action});
                    if (permission) {
                        return _.contains(permission.roles, $rootScope.user.role);
                    }
                    return false;
                };

                /**
                 * Gets current user's role name
                 * @returns {String} the role name
                 */
                $scope.getMyRole = function () {
                    if (util.isLoggedIn()) {
                        return $rootScope.user.role;
                    } else {
                        util.logout();
                    }
                };

                /**
                 * Sets the isApprover flag true if logged in user is approver
                 */
                $scope.isApproverUser = function () {
                    if ($rootScope.user && ($rootScope.user.role === config.ROLES.BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME ||
                        $rootScope.user.role === config.ROLES.BU_FUNCTIONAL_APPROVER_ROLE_NAME ||
                        $rootScope.user.role === config.ROLES.DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME)) {
                        $rootScope.isApprover = true;
                    } else {
                        $rootScope.isApprover = false;
                    }
                };
                $scope.isApproverUser();

                /**
                 * Redirect to last page
                 */
                $scope.goBackByLastMenu = function () {
                    var lastName = storage.getLastMenu();
                    var path = '/home';
                    switch (lastName) {
                        case config.MENUS.HOME:
                            path = '/home';
                            break;
                        case config.MENUS.ADD_ASSESSMENT:
                            path = '/addAssessment';
                            break;
                        case config.MENUS.DRAFT_ASSESSMENT:
                            path = '/assessments/' + config.ASSESSMENT_STATUS.DRAFT;
                            break;
                        case config.MENUS.AWAITING_ASSESSMENT:
                            path = '/assessments/' + config.ASSESSMENT_STATUS.AWAITING;
                            break;
                        case config.MENUS.APPROVED_ASSESSMENT:
                            path = '/assessments/' + config.ASSESSMENT_STATUS.APPROVED;
                            break;
                        case config.MENUS.REJECTED_ASSESSMENT:
                            path = '/assessments/' + config.ASSESSMENT_STATUS.REJECTED;
                            break;
                    }
                    $location.path(path);
                };
            }
        ]);
})();