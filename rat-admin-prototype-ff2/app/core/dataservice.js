/* Services */
angular
    .module('app.core')
    .factory('dataSvc', dataSvc);

//dataSvc
function dataSvc($http, $q) {
    return {
        query: function(src) {
            var deferred = $q.defer();
            $http({ method: 'GET', url: src }).
            success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function(data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    };
};
