/**
 * core module
 */
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngTouch', 'ngSanitize', 'ngResource',
        /*
         * Our reusable cross app code modules
         */
        'ui.router', 'ui.sortable', 'ngDragDrop','angularFileUpload'
    ]);
})();