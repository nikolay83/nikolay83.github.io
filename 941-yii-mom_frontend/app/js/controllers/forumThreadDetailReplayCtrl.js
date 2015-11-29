//forumThreadCtrl controller
angular.module("app")
    .controller('forumThreadDetailReplayCtrl', ['$scope', '$rootScope', 'DataService', 'crumble', 'localStorageService', '$routeParams',
        function ($scope, $rootScope, DataService, crumble, localStorageService, $routeParams) {
            var vm = this;

            vm.subject = "Re:Redeem My Founder$hare";

            $rootScope.loadCKEditor = true;

            crumble.update({"threadDetailTitle": "REDEEM MY FOUNDER$HARE"});

            DataService.query("thread-details-replay").then(function (data) {
                vm.threadDetailsList = data;
            });
        }
    ]);
