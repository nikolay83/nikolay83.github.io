/**
 * notifications
 */
(function() {
    'use strict';
    angular.module('blocks.notifications')
        .factory('notifications', notifications);

    function notifications() {
        var service = {
            catcher: catcher
        };
        return service;
    }
})();
