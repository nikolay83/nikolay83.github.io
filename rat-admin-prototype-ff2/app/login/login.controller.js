/* Controllers */
(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('Login', Login);

    //login
    function Login($scope, $filter, $location) {
        $scope.db;
        var vm = this;
        vm.isEnabledReset = false;

        //login
        vm.login = function() {
            var u = vm.username,
                p = vm.password;
            $scope.isVaid = false;
            $scope.loginError = false;
            $scope.matched = [];
            var search = $filter('filter')($scope.db.users, function(item) {
                if (u && p && item.username.toLowerCase() === u.toLowerCase() && item.password === p) {
                    $scope.matched.push(item);
                    return true;
                }
                return false;
            });
            if (search.length > 0) {
                $scope.isVaid = true;
            }
            if ($scope.isVaid) {
                var u = $scope.matched[0];
                $location.path(u.role+'/home');
            } else {
                $scope.loginError = true;
            }
        }
    }
})();
