'use strict';

var directive = angular.module("directive", []);

//Only Number
directive.directive('numbersOnly', function(){
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
directive.directive('dollarOnly', function(){
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

directive.directive('pwCheck', [function () {
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

//business info card
directive.directive('businessInfo', [function () {
    return {
        restrict: 'E',
        scope: {
            business: '='
        },
        templateUrl: '/partials/directives/business-info.html'
    }
}]);

//business info header
directive.directive('businessInfoHeader', [function () {
    return {
        restrict: 'E',
        scope: {
            business: '='
        },
        templateUrl: '/partials/directives/business-info-header.html'
    }
}]);

//business info remain
directive.directive('businessInfoRemain', [function () {
    return {
        restrict: 'E',
        scope: {
            business: '='
        },
        templateUrl: '/partials/directives/business-info-remain.html'
    }
}]);

// set percent progress bar for gift card
directive.directive('progress', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var progress = 0;
            attrs.$observe('progress', function(val){
                progress = isNaN(Number(val)) ? 0 : Number(val);
                var percent = (progress/2500)*100;
                var rotageElement1 = element.find('.circle .mask.full');
                var rotageElement2 = element.find('.circle .fill');
                rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
                rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            });
        }
    }
});
