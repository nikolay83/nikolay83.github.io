'use strict';

/* Services */

var projectServices = angular.module('projectServices', ['ngResource']);

//History List
projectServices.factory('championHistoryList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/championHistory.json'}).
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

projectServices.factory('founderHistoryList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/founderHistory.json'}).
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

//Employees List
projectServices.factory('employeesList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/employees.json'}).
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

//Info List
projectServices.factory('infoList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/info.json'}).
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

//Password List
projectServices.factory('passwordList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/password.json'}).
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

//Cart List
projectServices.factory('cartList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/cart.json'}).
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

//Founder Status List
projectServices.factory('founderList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/founder.json'}).
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

//Founder Status List
projectServices.factory('founder$haresList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/founder$hares.json'}).
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

//FounderF$Posting List
projectServices.factory('postList',['$http','$q',function($http, $q){
	return {
		query : function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/post.json'}).
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

//factory for Data
projectServices.factory('DataService', ['$http', '$q', function ($http, $q) {
    return {
        query : function(fileName) {
            var deferred = $q.defer();
            $http({method: 'GET', url: 'data/'+fileName+'.json'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
}]);