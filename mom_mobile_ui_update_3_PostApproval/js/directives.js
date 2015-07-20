'use strict';

var appDirectives = angular.module('MomAndPop.directives', []);

// gauge
appDirectives.directive('ngcGauge', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/directive/gauge.svg',
        scope: {
            options: '=options',
            gstyle: '=gstyle'
        },
        controller: 'gaugeCtrl'
    }
})

// tab state
.directive('ngcTapstate', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            var _ = $(el)
                .on('touchstart mousedown', function() {
                    _.addClass('hover');
                })
                .on('touchend  mouseup', function() {
                    _.removeClass('hover');
                })
        }
    }
})

 //Only Number
 .directive('numbersOnly', function() {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function(scope, element, attrs, modelCtrl) {
             modelCtrl.$parsers.push(function(inputValue) {
                 if (inputValue === undefined) return ''
                 var transformedInput = inputValue.replace(/[^0-9.]/g, '');
                 if (transformedInput != inputValue) {
                     modelCtrl.$setViewValue(transformedInput);
                     modelCtrl.$render();
                 }
                 return transformedInput;
             });
         }
     };
 })

;
