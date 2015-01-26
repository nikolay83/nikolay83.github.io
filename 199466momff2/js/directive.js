'use strict';

/* App Module */
var directives = angular.module('directives', []);


// set percent progress bar for gift card
directives.directive('progress', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var val = attrs['progress'].split(',');
            var progress = isNaN(Number(val[0])) ? 0 : Number(val[0]);
            var aProgress = isNaN(Number(val[1])) ? 0 : Number(val[1]);
            var percent = (progress/2500)*100;
            var rotageElement1 = element.find('.circle .mask.full');
            var rotageElement2 = element.find('.circle .fill');
            rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
        }
    }
});


// file input
directives.directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                scope.Myinfo.photo = element[0].files[0].name;
                scope.$apply();
            })
        }
    }
}]);