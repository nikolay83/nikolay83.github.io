//forum controller
angular.module("app")
    .controller('forumCtrl', ['DataService', 'localStorageService', '$location',
        function (DataService, localStorageService, $location) {
			var vm = this;

			//set page per page
			vm.pageSelected = {
				text: '10 Per Page',
				value: '10'
			};

			//page current number
			vm.currentPage = 1;

			//get Json from forum.json
			DataService.query("forum").then(function (data) {
				vm.forumList = data;
			});


			//set all thread read
			vm.readAll = function(){
				angular.forEach(vm.forumList, function(data, index, array) {
					array[index].new = false;
				});
			};
			localStorageService.remove("momandpop.forum.nickname");

			//get user type & set storage
			if(!!$location.search().user){
				vm.type = $location.search().user;
				console.log(vm.type);
				localStorageService.set("momandpop.forum.userType", vm.type);
			}else{
				localStorageService.set("momandpop.forum.userType", "anonymous");
			}
		}
    ]);
