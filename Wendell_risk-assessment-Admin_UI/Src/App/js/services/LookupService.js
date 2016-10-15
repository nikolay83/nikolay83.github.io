/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is lookup service. This is wrapper for the corresponding back end REST API.
 *
 * @author veshu
 * @version 1.0
 */
(function () {
    'use strict';
    angular.module("app")
        .factory('LookupService', ['common', function (common) {
            var service = {};

            /**
             * Gets all assessment status
             * @returns {promise} the promise with result
             */
            service.getAllAssessmentStatuses = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessmentStatuses'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all change types
             * @returns {promise} the promise with result
             */
            service.getAllChangeTypes = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/changeTypes'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all sites
             * @returns {promise} the promise with result
             */
            service.getAllSites = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/sites'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all business units
             * @returns {promise} the promise with result
             */
            service.getAllBusinessUnits = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/businessUnits'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all department heads
             * @params {Number} businessUnitId the business unit id
             * @returns {promise} the promise with result
             */
            service.getAllDepartmentHeads = function (businessUnitId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/departmentHeads',
                    params: {
                        businessUnitId: businessUnitId
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all Products
             * @params {Number} businessUnitId the business unit id
             * @returns {promise} the promise with result
             */
            service.getAllProducts = function (businessUnitId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/products',
                    params: {
                        businessUnitId: businessUnitId
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all departments
             * @params {Number} businessUnitId the business unit id
             * @returns {promise} the promise with result
             */
            service.getAllDepartments = function (businessUnitId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/departments',
                    params: {
                        businessUnitId: businessUnitId
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all assessment types
             * @returns {promise} the promise with result
             */
            service.getAllAssessmentTypes = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/assessmentTypes'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all risk exposures
             * @returns {promise} the promise with result
             */
            service.getAllRiskExposures = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/riskExposures'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all categories
             * @returns {promise} the promise with result
             */
            service.getAllCategories = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/categories'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all likelihood of occurrences
             * @returns {promise} the promise with result
             */
            service.getAllLikelihoodOfOccurrences = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/likelihoodOfOccurrences'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all risk impacts
             * @returns {promise} the promise with result
             */
            service.getAllRiskImpacts = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/riskImpacts'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all KPI Categories
             * @returns {promise} the promise with result
             */
            service.getKPICategories = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/KPICategories'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all process risks
             * @returns {promise} the promise with result
             */
            service.getAllProcessRisks = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/processRisks'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all control frequencies
             * @returns {promise} the promise with result
             */
            service.getAllControlFrequencies = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/controlFrequencies'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all control triggers
             * @returns {promise} the promise with result
             */
            service.getAllControlTriggers = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/controlTriggers'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all key controls maturities
             * @returns {promise} the promise with result
             */
            service.getAllKeyControlsMaturities = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/keyControlsMaturities'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all control designs
             * @returns {promise} the promise with result
             */
            service.getAllControlDesigns = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/controlDesigns'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all testing frequencies
             * @returns {promise} the promise with result
             */
            service.getAllTestingFrequencies = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/testingFrequencies'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets all percentages
             * @returns {promise} the promise with result
             */
            service.getAllPercentages = function () {
                var req = {
                    method: 'GET',
                    url: '/api/v1/percentages'
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the functional area owners by business unit id
             * @params {Number} businessUnitId the business unit id
             * @returns {promise} the promise with result
             */
            service.getFunctionalAreaOwners = function (businessUnitId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/functionalAreaOwners',
                    params: {
                        businessUnitId: businessUnitId
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the functional areas by business unit id
             * @params {Number} businessUnitId the business unit id
             * @returns {promise} the promise with result
             */
            service.getFunctionalAreas = function (businessUnitId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/functionalAreas',
                    params: {
                        businessUnitId: businessUnitId
                    }
                };
                return common.makeRequest(req);
            };

            /**
             * Gets the core processes by functional area id
             * @params {Number} functionalAreaId the functional area id
             * @returns {promise} the promise with result
             */
            service.getCoreProcesses = function (functionalAreaId) {
                var req = {
                    method: 'GET',
                    url: '/api/v1/coreProcesses',
                    params: {
                        functionalAreaId: functionalAreaId
                    }
                };
                return common.makeRequest(req);
            };

            return service;
        }]);
})();