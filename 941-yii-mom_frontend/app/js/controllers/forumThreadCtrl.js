//forumThreadCtrl controller
angular.module("app")
    .controller('forumThreadCtrl', ['$scope', 'DataService', 'crumble', 'localStorageService', '$routeParams',
        function ($scope, DataService, crumble, localStorageService, $routeParams) {
            var vm = this;

            //set page per page
            vm.pageSelected = {
                text: '10 Per Page',
                value: '10'
            };

            //page current number
            vm.currentPage = 1;


            DataService.query("thread").then(function (data) {
                vm.threadList = data;
            });

            DataService.query("forum").then(function (data) {
                angular.forEach(data, function(forumListData, index, array) {
                    if(parseInt(array[index].id) === parseInt($routeParams.threadId)){
                        crumble.update({"threadTitle":array[index].section});
                        return false;
                    }
                });
            });

            vm.readAll = function(){
                angular.forEach(vm.threadList, function(data, index, array) {
                    array[index].new = false;
                });
            };

        }
    ]);
