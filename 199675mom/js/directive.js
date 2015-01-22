'use strict';

var directive = angular.module("directive", []);

//Only Number
directive.directive('numbersOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				if(inputValue === undefined) return '' 
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
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);