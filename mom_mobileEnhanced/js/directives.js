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

;
