angular.module("loginModule", [])
    .controller('loginCtrl', function($scope, $location, $rootScope, localStorageService) {
        $scope.rememberMe = false;
        $scope.password = '';
        $scope.loginError = false;

        /** get/set user name */
        $scope.setUsername = function(user) {
            if (localStorageService.isSupported) {
                localStorageService.set('user', user);
            }
        };
        $scope.getUser = function() {
            if (localStorageService.isSupported) {
                return localStorage["FS.user"] || null;
            }
            return null;
        };

        function getRole(username) {
            username = username.toLowerCase();
            if (username === 'tammy') {
                return 'Admin';
            } else if (username === 'chris') {
                return 'Business Owner';
            }
            return 'Champion';
        }

        

        $scope.login = function() {
            $scope.loginError = false;
            if ($scope.username && $scope.password) {
                var user = {
                    'username': $scope.username,
                    'userRole': getRole($scope.username),
                    'firstVisit': true
                };
                $scope.setUsername(user);
                $location.path('/Forum');
            } else {
                $scope.loginError = true;
            }
        };
    });
