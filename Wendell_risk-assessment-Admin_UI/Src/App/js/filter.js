/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application filters.
 *
 * Changes 1.1:
 * - added new filters
 * 
 * @author veshu
 * @version 1.1
 */
(function () {
    'use strict';

    var app = angular.module("app");

    // if dropdown value is not selected then return select word
    app.filter('isSelected', function () {
        return function (value) {
            if (!value || value.length <= 0) {
                return '-';
            } else {
                return value;
            }
        };
    });

    // display yes/no or comment if available when not tested
    app.filter('testComment', function () {
        return function (input) {
            if (!input) {
                return null;
            } else if (input.tested == 'true' || input.tested == true) {
                return 'Yes';
            } else if (input.tested == 'false' || input.tested == false) {
                if (input.testedComment) {
                    return input.testedComment;
                } else {
                    return 'No';
                }
            }
            else {
                return null;
            }
        };
    });

    // filter to join array of lookup by comma
    app.filter('joinByComma', function () {
        return function (input) {
            return (_.pluck(input, 'name')).join(', ');
        };
    });

    // filter to display yes/no
    app.filter('yesNo', function () {
        return function (input) {
            if (input === 'true') {
                return 'Yes';
            } else if (input === 'false') {
                return 'No';
            } else {
                return null;
            }
        };
    });

    // process risk category
    app.filter('processCategories', ['config', function (config) {
        return function (categories) {
            var result = [];
            angular.forEach(categories, function (category) {
                if (category && category.id !== config.KPISLA_ASSESSMENT_CATEGORY_ID
                    && category.id != config.FUNCTIONAL_ASSESSMENT_CATEGORY_ID) {
                    result.push(category);
                }
            });
            return result;
        };
    }]);

    // gets the approver name from latest approver/rejecter of the assessment
    app.filter('approverName', function () {
        return function (assessment) {
            if (!assessment) {
                return '';
            }
            var approver;
            if (assessment.rejecter) {
                approver = assessment.rejecter;
            } else if (assessment.divisionalRiskManagementApprover) {
                approver = assessment.divisionalRiskManagementApprover;
            } else if (assessment.buRiskManagementApprover) {
                approver = assessment.buRiskManagementApprover;
            } else if (assessment.buFunctionalApprover) {
                approver = assessment.buFunctionalApprover;
            }

            if (approver) {
                return approver.firstName + " " + approver.lastName;
            }
        };
    });

    // returns display name of approval status
    app.filter('approvalStatus', ['config', function (config) {
        return function (status) {
            var map = _.findWhere(config.APPROVAL_STATUS, {value: status});
            if (map) {
                return map.displayName;
            } else {
                return status;
            }
        };
    }]);

    // returns display name of user
    app.filter('fullName', function () {
        return function (user) {
            if (user) {
                return user.firstName + " " + user.lastName;
            } else {
                return '';
            }
        };
    });

    // returns the count of control assessments selected
    app.filter('controlAssessmentCount', function () {
        return function (controlAssessments) {
            if (controlAssessments && controlAssessments.length > 0) {
                if (controlAssessments.length === 1) {
                    return '1 Control';
                } else {
                    return controlAssessments.length + ' Controls';
                }
            } else {
                return null;
            }
        };
    });

    /**
     * Shows the key control maturity in edit page
     */
    app.filter('keyControlMaturity', ['config', function (config) {
        return function (controlAssessment) {
            if (controlAssessment && controlAssessment.keyControlsMaturity && controlAssessment.keyControlsMaturity[0]) {
                if (controlAssessment.keyControlsMaturity[0].id == config.USER_DEFINED_KEY_CONTROLS_MATURITY_ID) {
                    return controlAssessment.otherKeyControlMaturity || controlAssessment.keyControlsMaturity[0].name;
                } else {
                    return controlAssessment.keyControlsMaturity[0].name;
                }
            } else {
                return null;
            }
        };
    }]);

    /**
     * Shows the key control maturity in detail page
     */
    app.filter('keyControlMaturityDetail', ['config', function (config) {
        return function (controlAssessment) {
            if (controlAssessment && controlAssessment.keyControlsMaturity) {
                if (controlAssessment.keyControlsMaturity.id == config.USER_DEFINED_KEY_CONTROLS_MATURITY_ID) {
                    return controlAssessment.otherKeyControlMaturity || controlAssessment.keyControlsMaturity.name;
                } else {
                    return controlAssessment.keyControlsMaturity.name;
                }
            } else {
                return null;
            }
        };
    }]);

    /**
     * Shows the testing frequencies
     */
    app.filter('testingFrequencies', ['config', function (config) {
        return function (controlAssessment) {
            if (controlAssessment && controlAssessment.testingFrequencies) {
                var names = _.pluck(controlAssessment.testingFrequencies, 'name');
                var notTestingFrequency = _.findWhere(controlAssessment.testingFrequencies, {id: config.USER_DEFINED_TESTING_FREQUENCY_ID});
                if (notTestingFrequency && controlAssessment.otherTestingFrequency) {
                    //remove not testing name and add user defined frequency
                    names = _.without(names, notTestingFrequency.name);
                    names.push(controlAssessment.otherTestingFrequency);
                }
                if (names.length > 0) {
                    return names.join(', ');
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
    }]);


    /**
     * Shows the likelihood of occurrence in edit page
     */
    app.filter('likelihoodOfOccurrence', ['config', function (config) {
        return function (assessment) {
            if (assessment && assessment.likelihoodOfOccurrence && assessment.likelihoodOfOccurrence[0]) {
                if (assessment.likelihoodOfOccurrence[0].id == config.USER_DEFINED_KEY_LIKELIHOOD_OF_OCCURRENCE_ID) {
                    return assessment.otherLikelihoodOfOccurrence || assessment.likelihoodOfOccurrence[0].name;
                } else {
                    return assessment.likelihoodOfOccurrence[0].name;
                }
            } else {
                return null;
            }
        };
    }]);

    /**
     * Shows the likelihood of occurrence in detail page
     */
    app.filter('likelihoodOfOccurrenceDetail', ['config', function (config) {
        return function (assessment) {
            if (assessment && assessment.likelihoodOfOccurrence) {
                if (assessment.likelihoodOfOccurrence.id == config.USER_DEFINED_KEY_LIKELIHOOD_OF_OCCURRENCE_ID) {
                    return assessment.otherLikelihoodOfOccurrence || assessment.likelihoodOfOccurrence.name;
                } else {
                    return assessment.likelihoodOfOccurrence.name;
                }
            } else {
                return null;
            }
        };
    }]);
})();
