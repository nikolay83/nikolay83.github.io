'use strict';

/* Controller */

var controllers = angular.module("controllers", [ "ngRoute"]);

//Main Controller
controllers.controller("mainCtrl", function ($scope, $rootScope) {
    $rootScope.login = false;
    $rootScope.showMenu = false;

    // close right slide menu
    $rootScope.closeRightSlideMenu = function () {
        $rootScope.showMenu = false;
    };

    // show right slide menu
    $rootScope.showRightSlideMenu = function () {
        $rootScope.showMenu = true;
    }

});

//Login Controller
controllers.controller("loginCtrl", function ($scope, $location, $rootScope) {
    //Validate
    $rootScope.login = true;
    $scope.validate = function () {
        if (!$scope.username || !$scope.password) {
            $scope.validation = false;
        } else {

            if ($scope.username === 'admin' && $scope.password === '123456') {
                $scope.validation = true;
            } else {
                $scope.validation = false;
            }
        }
        if ($scope.validation) {
            $location.path('/individual-home');
        } else {
            $scope.showError = true;
        }
    };

    // clear validation error, while focus  in input boxes;
    $scope.clearValidateError = function () {
        $scope.showError = false;
    };

    $scope.toggleRememberMe = function () {
        if ($scope.isRememberMe) {
            $scope.isRememberMe = false;
        }
        else {
            $scope.isRememberMe = true;
        }
    }
});

//business home Controller
controllers.controller("businessHomeStepOneCtrl", function ($scope, $location) {
    $scope.modal = false;

    //Close Modal
    $scope.close = function () {
        $scope.modal = false;
    };

    // Show Modal
    $scope.showModal = function () {
        $scope.modal = true;
    };

    // continue
    $scope.continueToNext = function () {
        if ($scope.stepOneForm.redeemAmount.$invalid) {
            alert('The amount to be redeemed from the Founder$hare is invalid');
        }
        else {
            $location.path("/business-step-2");
        }
    }

});


/**
 * Add check confirm password function to $scope.
 * @param $scope  $scope have password and confirmPassword to be checked.
 */
function checkConfirmPassword($scope) {
    // check  confirm password matches password
    $scope.checkConfirmPassword = function () {
        return  $scope.password === $scope.confirmPassword &&
            ($scope.password !== undefined )
            && ($scope.confirmPassword !== undefined )
            && ( $scope.password.length > 0 && $scope.confirmPassword.length > 0 );
    };
}


// put common methods of signUpChampionCtrl and signUpFounderCtrl
function signUpUtil($scope) {
    var requiredFields = $scope.requiredFields;
    // toggle accept terms and conditions
    $scope.toggleAcceptTerms = function () {
        if($scope.isAcceptTerms) {
            $scope.isAcceptTerms = false;
        }
        else {
            $scope.isAcceptTerms = true;
        }
    };

    // set upload browser button and upload file text field.
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value;
        var path = this.value;
        // just show file name
        var fileName = path.replace(/.*\\/, '');
        fileName = fileName.replace(/.*\//, '');
        document.getElementById("uploadFile").value = fileName;
    };

    // return whether accept term is not checked.
    $scope.isAcceptTermUnCheck = function () {
        return !$scope.isAcceptTerms;
    };

    checkConfirmPassword($scope);

    $scope.validateErrorMsg = "";

    // tool function for validate form data
    $scope.validateUtil = function () {
        $scope.validateErrorMsg = "";

        var requiredFieldNotFilled = [];
        $.each(requiredFields, function (index, item) {
            if ($scope.signUpForm[ item.fieldName ] &&
                $scope.signUpForm[ item.fieldName ].$error.required) {
                requiredFieldNotFilled.push(item.describeName);
                $("input[name=" + item.fieldName + "]").addClass('invalid')
            }
        });

        if (requiredFieldNotFilled.length > 0) {
            for (var i = 0; i < requiredFieldNotFilled.length; i++) {
                $scope.validateErrorMsg += requiredFieldNotFilled[i];
                // last element
                if (i == requiredFieldNotFilled.length - 1) {
                    if (requiredFieldNotFilled.length == 1) {
                        $scope.validateErrorMsg += ' is required. ';
                    }
                    else {
                        $scope.validateErrorMsg += ' are required. ';
                    }
                }
                else {
                    $scope.validateErrorMsg += ', ';
                }
            }
        }
        if ($scope.signUpForm.$invalid) {
            $scope.showError = true;
        }

        // confirm password  not match
        if (!$scope.checkConfirmPassword()) {
            $scope.validateErrorMsg += 'Confirm password is not same as password.';
        }

        // confirm password  not match
        if ($scope.signUpForm.mail.$dirty && $scope.signUpForm.mail.$invalid) {
            $scope.validateErrorMsg += 'Email is invalid.';
        }
        $scope.afterClickRegister = true;

    };

    // focus input
    $scope.focusInput = function () {
        // if just right after click register, clear error message.
        if ($scope.afterClickRegister) {
            $scope.showError = false;
            $scope.validateErrorMsg = "";
            $scope.afterClickRegister = false;
            // clear all warning border
            $("input").removeClass('invalid')
        }
    };

    /**
     *
     * Tool function for signUpForm, when loose focus, validate input value
     * @param $event   jquery event
     */
    $scope.looseFocusUtil = function ($event) {
        $scope.showError = false;
        var fieldName = $($event.target).attr('name');
        // check required rule
        if ($scope.signUpForm[ fieldName ].$error.required) {
            $scope.showError = true;
            $scope.validateErrorMsg = requiredFields[fieldName].describeName + " is required";
            $("input[name=" + fieldName + "]").addClass('invalid');
        }
        else {
            // has input required field, remove error style.
            $("input[name=" + fieldName + "]").removeClass('invalid');

            // mail input have values but not correct.
            if ($scope.signUpForm.mail.$dirty && $scope.signUpForm.mail.$invalid) {
                $scope.showError = true;
                $scope.validateErrorMsg = "Email address is invalid";
                $("input[name='mail']").addClass('invalid')
            }
            // if mail has valid input value remove error style.
            else if ($scope.signUpForm.mail.$valid) {
                $("input[name='mail']").removeClass('invalid')
            }
        }
    };

    $scope.afterClickRegister = false;

    $scope.$watch('$scope.signUpForm.mail.$invalid', function () {
        // if mail change to valid, remove red border.
        if ($scope.signUpForm.mail.$valid) {
            $("input[name='mail']").removeClass('invalid');
        }
    })
}

//sign Up Champion Controller
controllers.controller("signUpChampionCtrl", function ($scope, $location, $rootScope) {
    $scope.requiredFields = {
        firstName: { fieldName: 'firstName',
            describeName: 'First Name'
        },
        lastName: { fieldName: 'lastName',
            describeName: 'Last Name'
        },
        mail: {  fieldName: 'mail',
            describeName: 'Mail Address'
        },
        password: {
            fieldName: 'password',
            describeName: 'Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };

    signUpUtil($scope, $location, $rootScope);
    $scope.validate = $scope.validateUtil;
    $scope.looseFocus = $scope.looseFocusUtil;

});

//sign up founder Controller
controllers.controller("signUpFounderCtrl", function ($scope, $location, $rootScope) {
    $scope.requiredFields = {
        bizName: { fieldName: 'bizName',
            describeName: 'Business Name'
        },
        bizFirstName: { fieldName: 'bizFirstName',
            describeName: 'Biz First Name'
        },
        bizLastName: { fieldName: 'bizLastName',
            describeName: 'Biz Last Name'
        },
        mail: {  fieldName: 'mail',
            describeName: 'Mail Address'
        },
        password: {
            fieldName: 'password',
            describeName: 'Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };

    signUpUtil($scope, $location, $rootScope);
    $scope.validate = $scope.validateUtil;
    $scope.looseFocus = $scope.looseFocusUtil;
});

// resetPasswordCtrl
controllers.controller("resetPasswordCtrl", function ($scope, $location) {
    $scope.validateErrorMsg = "";

    // tool function for validate form data
    $scope.validate = function () {
        // clear error message
        $scope.validateErrorMsg = "";
        if ($scope.resetPasswordForm[ "mail" ] && $scope.resetPasswordForm[ "mail" ].$error.required) {
            $(".form-group").addClass('invalid');
            $scope.validateErrorMsg += 'Email is required.';
        }


        if ($scope.resetPasswordForm.mail.$dirty && $scope.resetPasswordForm.mail.$invalid) {
            $(".form-group").addClass('invalid');
            $scope.validateErrorMsg += 'Email is invalid.';
        }
        // show error
        if ($scope.validateErrorMsg.length > 0) {
            $scope.showError = true;
        }
    };

    // validate before submit
    $scope.submitValidate = function () {
        $scope.validate();
        if ($scope.resetPasswordForm.$valid) {
            $location.path('/reset-password-step2')
        }
    };

    // focus input
    $scope.focusInput = function () {
        $scope.showError = false;
        $scope.validateErrorMsg = "";
        // clear all warning border
        $(".form-group").removeClass('invalid')
    };

    $scope.$watch('$scope.resetPasswordForm.mail.$invalid', function () {
        // if mail change to valid, remove red border.
        if ($scope.resetPasswordForm.mail.$valid) {
            $(".form-group").removeClass('invalid');
        }
    })
});


// reset password step two controller
controllers.controller("resetPasswordStepTwoCtrl", function ($scope, $location) {
    $scope.validateErrorMsg = "";

    var requiredFields = {
        password: {
            fieldName: 'password',
            describeName: 'New Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };

    // add check confirm password function to $scope.
    checkConfirmPassword($scope);

    // tool function for validate form data
    $scope.validate = function () {
        $scope.validateErrorMsg = "";

        var requiredFieldNotFilled = [];
        $.each(requiredFields, function (index, item) {
            if ($scope.resetPasswordForm[ item.fieldName ] &&
                $scope.resetPasswordForm[ item.fieldName ].$error.required) {
                requiredFieldNotFilled.push(item.describeName);
                $("input[name=" + item.fieldName + "]").closest('.form-group').addClass('invalid')
            }
        });

        if (requiredFieldNotFilled.length > 0) {
            for (var i = 0; i < requiredFieldNotFilled.length; i++) {
                $scope.validateErrorMsg += requiredFieldNotFilled[i];
                // last element
                if (i == requiredFieldNotFilled.length - 1) {
                    if (requiredFieldNotFilled.length == 1) {
                        $scope.validateErrorMsg += ' is required. ';
                    }
                    else {
                        $scope.validateErrorMsg += ' are required. ';
                    }
                }
                else {
                    $scope.validateErrorMsg += ', ';
                }
            }
        }

        // confirm password  not match
        if (!$scope.checkConfirmPassword()) {
            $scope.validateErrorMsg += 'Confirm password is not same as password.';
        }

        if ($scope.resetPasswordForm.$invalid) {
            $scope.showError = true;
        }
        else {
            $location.path('/');
        }

        $scope.afterClickSubmit = true;
    };

    // focus input
    $scope.focusInput = function () {
        // if just right after click "reset password", clear error message, when user focus in input.
        if ($scope.afterClickSubmit) {
            $scope.showError = false;
            $scope.validateErrorMsg = "";
            $scope.afterClickSubmit = false;
            // clear all warning border
            $(".form-group").removeClass('invalid')
        }
    };

    /**
     *
     * Function for resetPasswordForm, when loose focus, validate input value
     * @param $event   jquery event
     */
    $scope.looseFocus = function ($event) {
        $scope.showError = false;
        var fieldName = $($event.target).attr('name');
        // check required rule
        if ($scope.resetPasswordForm[ fieldName ].$error.required) {
            $scope.showError = true;
            $scope.validateErrorMsg = requiredFields[fieldName].describeName + " is required";
            $("input[name=" + fieldName + "]").closest('.form-group').addClass('invalid');
        }
        else {
            $("input[name=" + fieldName + "]").closest('.form-group').removeClass('invalid');
        }
    };

});