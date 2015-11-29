/* Services */
var ngcServices = angular.module('ngcServices', []);

//get data svc
ngcServices.factory('dataSvc',['$http','$q',function($http, $q){
	return {
		query : function(src) {
			var deferred = $q.defer();
			$http({method: 'GET', url: src}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);
