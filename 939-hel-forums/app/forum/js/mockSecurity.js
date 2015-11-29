(function() {
	angular.module("mockSecurity", ['ngMockE2E'])
		.run(['$httpBackend', 'MockForumRepository', function($httpBackend, repository) {
			var sampleUsers = null;
			
			repository.getUsers().then(function(users) {
				sampleUsers = users;
			});
			
			// Login mock - uses sample user list to lookup mock session token
			$httpBackend.whenPOST(/login/).respond(function(method, url, data) {
				data = angular.fromJson(data);
				var user = _.find(sampleUsers, function(user) { return user.email === data.email && user.password === data.password });
				
				if(user) {
					return [200, {"sessionToken":user.sessionToken}, {}];
				}
			});
			
			// User info mock - uses sample user list to retrieve user based on provided session token
			$httpBackend.whenGET(/users\/me/).respond(function(method, url, data, headers) {
				var user = _.find(sampleUsers, function(user) { return headers.Authorization === 'Bearer ' + user.sessionToken });
				return [200, user, {}];
			});
			
			// pass through all other requests
			$httpBackend.whenGET(/^.*$/).passThrough();
			$httpBackend.whenPOST(/^.*$/).passThrough();
		}]);
})();