(function() {
	angular.module("app")
		.controller("postEditorCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$route", "crumble", "$location", "MockForumRepository", 'config', '$interpolate',
			function($scope, $http, $routeParams, $rootScope, $route, crumble, $location, repository, config, $interpolate) {
				var originalPostId = $routeParams.quotePostId || $routeParams.replyPostId,
					backUrl = null;
				
				// Reply or quote
				if(originalPostId) {
					repository.getPost(originalPostId).then(function(post) {
						$scope.originalPost = post;
						$scope.postTitle = 'Re:' + post.title;
						backUrl = '/Forum/' + $routeParams.sectionId + '/' +  $routeParams.threadId;
						
						// If user is quoting a post - add original post to editor
						if($routeParams.hasOwnProperty('quotePostId')) {
							$scope.postBody = $interpolate(config.FORUM_QUOTE_HTML_TEMPLATE)({post: post});	
						}
						else {
							$scope.postBody = '';
						}
					});	
				} 
				else {
					$scope.postTitle = $scope.postBody = '';
				}
				
				$scope.submit = function() {
					if(originalPostId) {
						repository.createPost($routeParams.sectionId, $routeParams.threadId, $scope.postTitle, $scope.postBody, $rootScope.loggedUser.nickname)
							.then(function() {
								$location.path('/Forum/' + $routeParams.sectionId + '/' + $routeParams.threadId);
							});
					}
					else {
						repository.createThread($routeParams.sectionId, $scope.postTitle, $scope.postBody, $rootScope.loggedUser.nickname)
							.then(function(thread) {
								$location.path('/Forum/' + $routeParams.sectionId + '/' + thread.id);
							});
					}
				}
				
				$scope.cancel = function() {
					
				}
			}]);
})();