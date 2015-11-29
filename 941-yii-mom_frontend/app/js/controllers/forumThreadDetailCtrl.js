//forumThreadCtrl controller
angular.module("app")
    .controller('forumThreadDetailCtrl', ['$scope', 'DataService', 'crumble', 'localStorageService', '$routeParams',
        function ($scope, DataService, crumble, localStorageService, $routeParams) {
            var vm = this;

            //set page per page
            vm.pageSelected = {
                text: '10 Per Page',
                value: '10'
            };

            vm.type = localStorageService.get("momandpop.forum.userType");

            crumble.update({"threadDetailTitle": "REDEEM MY FOUNDER$HARE"});

            DataService.query("thread-details").then(function (data) {
                vm.threadDetailsList = data;
            });
        }
    ]);
