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
directives.directive('fileInput', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                scope.Myinfo.photo = element[0].files[0].name;
                scope.$apply();
            })
        }
    }
});

// set position for modal
directives.directive('initModal', function ($window) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var w = angular.element($window);
            console.log(w.height());
            // console.log(w.width());
            // console.log(element.height());
            var mt = (w.height()-element.height())/2;
            element.css({'margin-top': mt})
        }
    }
});

//Only Number
directives.directive('numbersOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				if(inputValue === undefined) return '';
				var transformedInput = inputValue.replace(/[^0-9+]/g, ''); 
				if(transformedInput!=inputValue){
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;         
			});
		}
	};
});

//Only Dollar
directives.directive('dollarOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				if(inputValue === undefined) return '' 
				var transformedInput = inputValue.replace(/[^0-9.$+]/g, ''); 
				if(transformedInput!=inputValue){
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;         
			});
		}
	};
});

directives.directive('pwCheck', [function () {
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