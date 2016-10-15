/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is assessment service. This is wrapper for the corresponding back end REST API.
 *
 * Changes in 1.1:
 * - Added new methods
 * @author veshu
 * @version 1.1
 */

(function () {
    'use strict';

    angular
        .module("app")
        .factory('AssessmentService', ['common', function (common) {
            var service = {};

            /**
             * Creates the assessment as draft
             * @param {Object} entity the assessment detail
             * @returns {promise} the promise with result
             */
            service.createAsDraft = function (entity) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/draft',
                    data: entity
                };
                return common.makeRequest(req);
            };

            /**
             * Submits the assessment
             * @param {Object} entity the assessment detail
             * @returns {promise} the promise with result
             */
            service.submit = function (entity) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/submit',
                    data: entity
                };
                return common.makeRequest(req);
            };

            /**
             * Updates the assessment
             * @param {Number} id the assessment id to update
             * @param {Object} entity the assessment detail
             * @returns {promise} the promise with result
             */
            service.update = function (id, entity) {
                var req = {
                    method: 'PUT',
                    url: '/api/v1/assessment/' + id,
                    data: entity
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the assessment detail by id
             * @param {Number} id the assessment id
             * @returns {promise} the promise with result
             */
            service.get = function (id) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/' + id
                };
                return common.makeRequest(req);
            };

            /**
             * Searches the assessments
             * @param {Object} criteria the search criteria
             * @returns {promise} the promise with result
             */
            service.search = function (criteria) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments',
                    params: criteria
                };
                return common.makeRequest(req);
            };

            /**
             * Exports the assessment by id. Will prompt the file to save
             * @param {Number} id the assessment id to export
             * @param {String} format the export format
             */
            service.exportAssessmentById = function (id, format) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/' + id + '/export',
                    params: {
                        format: format
                    }
                };
                common.export(req);
            };

            /**
             * Exports the assessment by id. Will prompt the file to save
             * @param {Object} assessment the assessment to export
             * @param {String} format the export format
             */
            service.exportAssessment = function (assessment, format) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/export?format=' + format,
                    data: assessment
                };
                common.export(req);
            };
            /**
             * Approves the assessment.
             * @param {Object} assessmentId the assessment id
             * @returns {promise} the promise with result
             */
            service.approve = function (assessmentId) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/' + assessmentId + '/approve'
                };
                return common.makeRequest(req);
            };

            /**
             * Rejects the assessment.
             * @param {Object} assessmentId the assessment id
             * @param {String} rejectionReason the rejection reason
             * @returns {promise} the promise with result
             */
            service.reject = function (assessmentId, rejectionReason) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/' + assessmentId + '/reject',
                    data: JSON.stringify(rejectionReason)
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the overall risk rating report of an assessment.
             * @param {Object} assessment the assessment
             * @returns {promise} the promise with result
             */
            service.getOverallRiskRatingReport = function (assessment) {
                var req = {
                    method: 'POST',
                    url: '/api/v1/assessments/overallRiskRatingReport',
                    data: assessment
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the overall risk rating report of an assessment.
             * @param {Object} assessmentId the assessment id
             * @returns {promise} the promise with result
             */
            service.getOverallRiskRatingReportById = function (assessmentId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/' + assessmentId + '/overallRiskRatingReport'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the count of draft assessments.
             * @returns {promise} the promise with result
             */
            service.getDraftCount = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/draft/count'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the count of awaiting approval assessments.
             * @returns {promise} the promise with result
             */
            service.getAwaitingApprovalCount = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/awaitingApproval/count'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the count of approved assessments.
             * @returns {promise} the promise with result
             */
            service.getApprovedCount = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/approved/count'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the count of rejected assessments.
             * @returns {promise} the promise with result
             */
            service.getRejectedCount = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/rejected/count'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the draft assessments.
             * @params {Object} criteria the search criteria
             * @returns {promise} the promise with result
             */
            service.getDraftAssessments = function (criteria) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/draft',
                    params: criteria
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the awaiting approval assessments.
             * @params {Object} criteria the search criteria
             * @returns {promise} the promise with result
             */
            service.getAwaitingApprovalAssessments = function (criteria) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/awaitingApproval',
                    params: criteria
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the approved assessments.
             * @params {Object} criteria the search criteria
             * @returns {promise} the promise with result
             */
            service.getApprovedAssessments = function (criteria) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/approved',
                    params: criteria
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the rejected assessments.
             * @params {Object} criteria the search criteria
             * @returns {promise} the promise with result
             */
            service.getRejectedAssessments = function (criteria) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessments/rejected',
                    params: criteria
                };
                return common.makeRequest(req);
            };
            return service;
        }]);
})();