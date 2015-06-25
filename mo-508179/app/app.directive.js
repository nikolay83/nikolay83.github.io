// App wide directive
(function () {
  'use strict';

  angular.module('MomMobileApp')
    .directive('navMenuToggler', navMenuToggler);

  function navMenuToggler(){
    return {
      restrict: 'A',
      link: function($scope, $elem, $attrs){
        $elem.on('click touch', toggleNavMenu);

        var body = $('body');
        var overlay = $('<div>');
        overlay.addClass('modal-backdrop fade in');
        overlay.css('position', 'absolute');

        function toggleNavMenu(){
          body.toggleClass('menu-opened');

          if(body.hasClass('menu-opened')){
            $('body').append(overlay);
            var menu_items = $($attrs.navMenuToggler);
            menu_items.on('click touch', closeNavMenu);
          } else {
            overlay.detach();
          }
        }

        function closeNavMenu(){
          body.removeClass('menu-opened');
          overlay.detach();
        }
      }
    }
  }
})();