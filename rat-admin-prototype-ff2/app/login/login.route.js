/* Routes */
(function() {
    'use strict';

    angular
        .module('app.login')
        .config(config);

    //config
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
        // anonymous
            .state('anonymous', {
            url: '/',
            views: {
                "default": {
                    templateUrl: "app/login/login.html"
                }
            }
        })

        .state('login', {
            url: '/login',
            views: {
                "default": {
                    templateUrl: "app/login/login.html"
                }
            }
        })

        $urlRouterProvider.otherwise('/');
    }
})();
