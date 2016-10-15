/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * Changes in 1.1:
 *  - Added new configurations for list pages
 * @author veshu
 * @version 1.1
 */
(function () {
    'use strict';
    var ownerUserRoleName = 'Owner';
    var buFunctionalApproverRoleName = 'BUFunctionalApprover';
    var buRiskManagementApproverRoleName = 'BURiskManagementApprover';
    var divisionalRiskManagementApproverRoleName = 'DivisionalRiskManagementApprover';
    var adminRoleName = 'Admin';

    var config = {
        // The base URL of the rest services
        REST_SERVICE_BASE_URL: 'http://localhost:8097',
        DATE_FORMAT: 'dd-MM-yyyy',
        ROLES: {
            OWNER_ROLE_NAME: ownerUserRoleName,
            BU_FUNCTIONAL_APPROVER_ROLE_NAME: buFunctionalApproverRoleName,
            BU_RISK_MANAGEMENT_APPROVER_ROLE_NAME: buRiskManagementApproverRoleName,
            DIVISIONAL_RISK_MANAGEMENT_APPROVER_ROLE_NAME: divisionalRiskManagementApproverRoleName,
            ADMIN_ROLE_NAME: adminRoleName
        },
        KPISLA_ASSESSMENT_CATEGORY_ID: 1,
        FUNCTIONAL_ASSESSMENT_CATEGORY_ID: 2,
        CORP_DIV_TRAINING_ASSESSMENT_CATEGORY_ID: 3,
        USER_DEFINED_KEY_CONTROLS_MATURITY_ID: 3,
        USER_DEFINED_KEY_LIKELIHOOD_OF_OCCURRENCE_ID:7,
        USER_DEFINED_TESTING_FREQUENCY_ID: 17,
        DEFAULT_PAGE_SIZE: 8,
        MAXIMUM_ALLOWED_FUNCTION_CHANGES: 20,
        // holds the mapping of actions and roles
        PERMISSIONS: [
            {
                action: 'addAssessment',
                roles: [ownerUserRoleName]
            }
        ],
        MENUS: {
            HOME: 'home',
            ADD_ASSESSMENT: 'addAssessment',
            DRAFT_ASSESSMENT: 'draftAssessment',
            AWAITING_ASSESSMENT: 'awaitingAssessment',
            APPROVED_ASSESSMENT: 'approvedAssessment',
            REJECTED_ASSESSMENT: 'rejectedAssessment'
        },
        ASSESSMENT_STATUS: {
            DRAFT: 'draft',
            AWAITING: 'awaiting',
            APPROVED: 'approved',
            REJECTED: 'rejected'
        },
        EXPORT_FORMAT: {
            EXCEL: 'excel'
        },
        SORT_DIR: {
            ASC: 'Ascending',
            DESC: 'Descending'
        },
        APPROVAL_STATUS: {
            DRAFT: {value: 'Draft', displayName: 'Draft'},
            APPROVED: {value: 'Approved', displayName: 'Approved'},
            REJECTED: {value: 'Rejected', displayName: 'Rejected'},
            AWAITING_BU_FUNCTIONAL_APPROVAL: {
                value: 'AwaitingBUFunctionalApproval',
                displayName: 'Awaiting Functional Modifications Approval'
            },
            AWAITING_BU_RISK_MANAGEMENT_APPROVAL: {
                value: 'AwaitingBURiskManagementApproval',
                displayName: 'Awaiting BU Risk Management Approval'
            },
            AWAITING_DIVISIONAL_RISK_MANAGEMENT_APPROVAL: {
                value: 'AwaitingDivisionalRiskManagementApproval',
                displayName: 'Awaiting the Divisional Risk Management Approval'
            }
        }
    };
    window.APP_CONFIG = config;
    angular
        .module('app')
        .constant("config", window.APP_CONFIG);
})();

