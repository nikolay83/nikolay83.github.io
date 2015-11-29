(function() {
	angular.module("app")
		.controller("nicknamePopupCtrl", ["$scope", "MockForumRepository",
			function($scope, repository) {
				var vm = this;
				
				vm.nickname = $scope.loggedUser.firstName + $scope.loggedUser.lastName; // Replace with a default nickname
				vm.nicknameAvailable = true;
				
				vm.checkNickname = function(nickname) {
					repository.checkNicknameAvailability(nickname).then(function(available) {
						vm.nicknameAvailable = available;
					});
				};
				
			}]);
})();