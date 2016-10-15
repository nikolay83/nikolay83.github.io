$(function() {
    angular.module('app.core')
        .directive('toggleView', toggleView)
        .directive('editBlock', editBlock);
    //toggleView directive
    function toggleView() {
        return {
            restrict: 'A',
            link: function(scope, el, attr) {
                var _ = $(el);
                $('.toggle-handle', _).on('click', function() {
                    if (_el.hasClass('open')) {
                        _el.removeClass('open');
                    } else {
                        _el.addClass('open');
                    }
                })
            }
        }
    }

    //editBlock
    function editBlock() {
        return {
            restrict: 'A',
            scope: {
                ngModel: "=",
                list: '@editBlock'
            },
            templateUrl: 'app/blocks/editBlock.template.html',
            controller: function($scope){
            	$scope.a = 23;
            },
            link: function(scope, el, attr) {
                console.log('editBlock');
            }
        }
    }
})();
