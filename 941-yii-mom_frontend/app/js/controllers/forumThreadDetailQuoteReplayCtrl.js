//forumThreadCtrl controller
angular.module("app")
    .controller('forumThreadDetailQuoteReplayCtrl', ['$scope', '$rootScope', 'DataService', 'crumble', 'localStorageService', '$routeParams',
        function ($scope, $rootScope, DataService, crumble, localStorageService, $routeParams) {
            var vm = this;

            vm.subject = "Re:Redeem My Founder$hare";
            vm.content = "<div style='line-height35px;border-left: 5px solid #eeeeee; font-size: 16px;'>Hi, riopurba! It’s easy. You only need to lorem ipsum dolor is amet. <i>(Posted by <b>tammy</b>)</i></div>"

            $rootScope.loadCKEditor = true;

            crumble.update({"threadDetailTitle": "REDEEM MY FOUNDER$HARE"});

            DataService.query("thread-details-replay").then(function (data) {
                vm.threadDetailsList = data;
            });
        }
    ]);
