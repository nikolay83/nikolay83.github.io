(function (angular) {
  'use strict';
  
  angular.module('heritage')
    .directive("profilePopoverPopup", function () {
      return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "profile-popup.html",
        link: function(scope, elt, attrs) {
          // Set active state on element
          // Use $parent.$parent as directive is wrapped
          // into tooltip directive
          scope.$parent.$parent.popover = {
            active: true
          };
          elt.on('$destroy', function() {
            scope.$parent.$parent.popover.active = false;
          });
        }
      };
    })

    .directive("profilePopover", [ "$tooltip", function ($tooltip) {
      return $tooltip("profilePopover", "popover", "click");
    }]);
  
}(window.angular));