/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application directives.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

var app = angular.module("app");

//Only Number
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

//Only Dollar
app.directive('dollarOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9.$+]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(Number(transformedInput));
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);


//Max Number
app.directive('maxNumber', function () {
    return {
        require: 'ngModel',
        scope: {
            max: '=maxNumber',
            model: '=ngModel'
        },
        link: function (scope, element, attrs, modelCtrl) {
            element.on('keyup', function () {
                scope.$apply(function () {
                    if (scope.model > scope.max) {
                        scope.model = scope.max;
                    }
                    scope.model = Number(scope.model);
                });
            });
        }
    };
});


// set percent progress bar for gift card
app.directive('progress', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var val = attrs['progress'].split(',');
            var progress = isNaN(Number(val[0])) ? 0 : Number(val[0]);
            var aProgress = isNaN(Number(val[1])) ? 0 : Number(val[1]);
            var percent = (progress / aProgress) * 100;
            var rotageElement1 = element.find('.circle .mask.full');
            var rotageElement2 = element.find('.circle .fill');
            rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
        }
    }
});

// set position for modal
app.directive('initModal', function ($window) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var w = angular.element($window);
            var mt = (w.height() - element.height()) / 2;
            element.css({'margin-top': mt})
        }
    }
});

// trigger submit on given form if element is clicked
app.directive('ngcSubmitForm', function ($window) {
    return {
        restrict: 'EA',
        scope: {
            form: "=ngcSubmitForm",
            onlyMark: "=onlyMark"
        },
        link: function (scope, element, attrs) {
            $(element).click(function () {
                $(scope.form).submit(function () {
                    return false;
                });
                setTimeout(function () {
                    var $form = $(scope.form);
                    $form.addClass("ngc-submitted");
                    if (!scope.onlyMark) {
                        $form.trigger("submit");
                    }
                });
            })
        }
    }
});

//validator for date in format e.g. 01/01/2015
app.directive('ngcDate', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.date = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "D/M/YYYY", true);
                return date.isValid();
            };
        }
    };
});

//validator for time in format e.g. 10:00 PM
app.directive('ngcTime', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.time = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }
                var date = moment(viewValue, "h:mm A");
                if (date.isValid()) {
                    //check if date ends with AM or PM
                    //moment allows A or P
                    viewValue = viewValue.trim();
                    return /AM$/i.test(viewValue) || /PM$/i.test(viewValue);
                }
                return false;
            };
        }
    };
});