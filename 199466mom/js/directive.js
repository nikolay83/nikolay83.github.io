'use strict';

/* App Module */
var directives = angular.module('directives', []);

// set navbar when scroll
directives.directive('sticky', [ function () {
    return {
        restrict: 'A',

        link: function ($scope, $elem, $attrs) {
            var offsetTop = 0,
                $window = angular.element(window),
                initialPositionStyle = $elem.css('position'),
                stickyLine,
                scrollTop;
                
            // Set the top offset
            $elem.css('top', '0');
            // $elem.css('left', '12%');
            $window.on('scroll', checkSticky);
            setInitial();

            function setInitial() {
                stickyLine = $elem[0].offsetTop;
                checkSticky();
            }

            function checkSticky() {
                scrollTop = window.pageYOffset;
                if (scrollTop >= stickyLine) {
                    $elem.css('position', 'fixed');
                    $elem.addClass('userSet');
                } else {
                    $elem.css('position', initialPositionStyle);
                    $elem.removeClass('userSet');
                }
            }
        }
    };
}]);

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


