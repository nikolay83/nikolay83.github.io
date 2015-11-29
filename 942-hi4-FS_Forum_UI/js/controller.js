/* Controller */
var ngcControllers = angular.module('ngcControllers', [])

.controller('mainCtrl', function($rootScope, $scope, localStorageService) {
    $scope.getUser = function() {
        if (localStorageService.isSupported) {
            return localStorage["FS.user"] || null;
        }
        return null;
    };
    $scope.setUsername = function(user) {
        if (localStorageService.isSupported) {
            localStorageService.set('user', user);
        }
    };
    $rootScope.header = {};
});
