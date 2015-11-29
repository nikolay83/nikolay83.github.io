//forum controller
angular.module("app")
    .controller('nicknamePopupCtrl', ['$scope', '$rootScope', 'localStorageService', 'DataService',
        function ($scope, $rootScope, localStorageService, DataService) {
			var vm = this;

			//close nickname popup
			$scope.closeNickname = function () {
				$scope.displayNickname = false;
				$rootScope.details = false;
			};

			var forumNickname = localStorageService.get("momandpop.forum.nickname");
			if(!!forumNickname){
				vm.nickname = forumNickname;
				$scope.displayNickname = false;
				$rootScope.details = false;
			}else{
				$scope.displayNickname = true;
				$rootScope.details = true;
			}

			//submit nickname & close popup
			$scope.submitNickName = function (val) {
				if(!!$scope.nicknameChecked){
					$scope.closeNickname();
					localStorageService.set("momandpop.forum.nickname", val);
				}
			};

			//check valid for nickname
			$scope.checkValid = function (val) {
				$scope.nicknameChecked = null;
				if(!!val){
					$scope.nicknameChecked = true;
					DataService.query("nickname").then(function (data) {
						angular.forEach(data, function(value){
							if(value===val){
								$scope.nicknameChecked = false;
								return false;
							}
						});
					});
				}
			};


		}
    ]);
