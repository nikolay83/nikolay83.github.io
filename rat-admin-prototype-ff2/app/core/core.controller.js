/* Controllers */
(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('Core', Core);

    //core 
    function Core($scope, config, dataSvc) {
        $scope.db;
        $scope.title = config.title;
        //core vm
        var vmc = this;

        //get data
        var promise = dataSvc.query('app/data/db.json');
        promise.then(function(data) {
            $scope.db = data;
        });

        //menu active functions
        vmc.checkMenu = function(newPath) {
            var path = $scope.path ? $scope.path.toLowerCase() : '';
            if (path && path.indexOf(newPath) > 0) {
                return true;
            }
            return false;
        }

        //endswith
        vmc.endsWith = function(newPath, onlyLast) {
            newPath = newPath.toLowerCase();
            var path = $scope.path ? $scope.path.toLowerCase() : '';
            path = path.split('/');
            var len = path.length;
            if (onlyLast) {
                if (len > 0 && (path[len - 1] === newPath )) {
                    return true;
                }
            } else {
                if (len > 0 && (path[len - 1] === newPath || (path[len - 2] === newPath && path[len - 2] !== 'add') && path[len - 2] !== 'edit')) {
                    return true;
                }
            }
            return false;
        }

        //scrollTop
        vmc.scrollBy = function(value) {
            angular.element('body').scrollTop(value);
        }
    }

})();
