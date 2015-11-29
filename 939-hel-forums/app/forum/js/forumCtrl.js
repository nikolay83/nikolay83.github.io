(function() {
	angular.module("app")
		.controller("forumCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$route", "crumble", "$location", "MockForumRepository", "$uibModal",
			function($scope, $http, $routeParams, $rootScope, $route, crumble, $location, repository, $uibModal) {
				var displayColumns = null;
				
				$http.get('/Forum/data/forumColumns.json').success(function(data) {
					displayColumns = data;
					
					// Add href generator to the first (name) column of the view template
					displayColumns.sections[0].getHref = displayColumns.threads[0].getHref = function(entry) {
						return '#' + $location.url() + '/' + entry.id;
					}
					
					// If section id and thread id are provided - render posts for the specified thread
					if($routeParams.hasOwnProperty('sectionId') && $routeParams.hasOwnProperty('threadId')) {
						repository.getThread($routeParams.sectionId, $routeParams.threadId).then(function(thread) {
							$scope.entries = thread.posts;
							$scope.currentThreadPath = $location.path();
							$route.routes["/Forum/:sectionId/:threadId"].label = thread.name;
							crumble.update();
						});
					}
					// If section id is provided - render threads for the specified section
					else if($routeParams.hasOwnProperty('sectionId')) {
						repository.getSection($routeParams.sectionId).then(function(section) {
							$scope.entries = section.threads;
							$scope.columns = displayColumns.threads;
							$route.routes["/Forum/:sectionId"].label = "Threads of " + section.name;
							crumble.update();
						});
						
						$scope.forumButtons = [{
							title: 'Post New Thread',
							href: 'javascript:;'
						}];
					}
					// Render the sections
					else {
						repository.getSections().then(function(sections) {
							$scope.entries = sections;
							$scope.columns = displayColumns.sections;	
						});
						
						if($scope.loggedUser.isAdmin) {
							$scope.forumButtons = [{
								title: 'Create New Section',
								href: 'javascript:;'
							}];
						}
					}
				});
																			

				
				$scope.itemsPerPageOptions = [
					{ label: '10 Per Page', count: 10 },	
					{ label: '20 Per Page', count: 20 },	
					{ label: '30 Per Page', count: 30 },	
					{ label: '40 Per Page', count: 40 },	
					{ label: '50 Per Page', count: 50 }	
				];
				
				$scope.itemsPerPage = _.clone($scope.itemsPerPageOptions[0]);
			}]);
})();