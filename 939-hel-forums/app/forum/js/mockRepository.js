angular.module("app")
	.factory("MockForumRepository", ["$http", "$q", function($http, $q) {
		var repository = {},
			mockData = null;
			
	    function getData() {
			return $q(function(resolve) {
				if(mockData) {
					return resolve(mockData);
				}
				else {
					// Retrieve mock data from JSON file
					$http.get('/forum/data/mockForum.json').success(function(data) {
						mockData = data;
						resolve(mockData);
					});
				}
			});
		}
		
		repository.checkNicknameAvailability = function(nickname) {
			return getData().then(function(data) { 
				return nickname != 'rioandrew' && !_.find(data.users, function(user) {
					user.nickname === nickname;
				});
			});
		}
		
		repository.getUsers = function() {
			return getData().then(function(data) { return data.users; });
		};
		
		repository.getSections = function() {
			return getData().then(function(data) { return data.sections; });
		};
		
		repository.getSection = function(id) {
			return getData().then(function(data) { 
				var section = _.find(data.sections, function(section) { return section.id.toString() === id.toString() });
				
				// Prefill the section with sample threads
				if(section && typeof section.threads === "undefined" ) {
					section.threads = data.threads;
				}
				
				return section;
			});
		}
		
		repository.getThread = function(sectionId, threadId) {
			return repository.getSection(sectionId).then(function(section) { 
				var thread = _.find(section.threads, function(thread) { return thread.id.toString() === threadId.toString() });
				
				// Prefill the thread with sample posts
				if(thread && typeof thread.posts === "undefined") {
					return getData().then(function(data) {
						thread.posts = data.posts.slice();
						return thread;
					});
				} else {
					return thread;	
				}
			});
		}
		
		repository.getPost = function(postId) {
			return getData().then(function(data) {
				return _.find(data.posts, function(post) { return post.id.toString() === postId.toString() });
			});
		}
		
		repository.createThread = function(sectionId, title, body, username) {
			var thread = {
				name: title,
				replyCount: 0,
				viewCount: 0,
				lastPostDate: 'Teu, Nov 15 2015, 07:45 PM',
				lastPostAuthor: username,
				hasNewActivity: true,
				id: Math.round(Math.random()*100000),
				posts: []
			};
			
			return repository.getSection(sectionId).then(function(section) {
				section.threads.unshift(thread);
				
				return repository.createPost(sectionId, thread.id, title, body, username)
					.then(function() {
						return thread;
					});
			});
		}
		
		
		repository.createPost = function(sectionId, threadId, title, body, username) {
			return repository.getThread(sectionId, threadId).then(function(thread) {
				var post = {
					id: Math.round(Math.random()*100000),
					date: 'Teu, Nov 15 2015, 07:45 PM',
					title: title, 
					body: body, 
					ordinalNumber: thread.posts.length + 1,
					author: {
						name: username,
						avatar: "/forum/assets/i/avatar-placeholder.png",
						type: "Bussiness Owner",
						numPosts: 123
					}
				};
				
				thread.posts.push(post);
				return post;
			});
		}
		
		return repository;
	}]);