/* forum module */
var ngcControllers = angular.module('forumModule', [])

// forum controller
.controller('forumCtrl', function($scope, $rootScope, $http) {


    // perpage opts
    $scope.perpageOpts = [{
        text: "5 Per Page",
        value: 5
    }, {
        text: "10 Per Page",
        value: 10
    }, {
        text: "25 Per Page",
        value: 25
    }, {
        text: "50 Per Page",
        value: 50
    }];
    $scope.perpageVal = $scope.perpageOpts[1];
    //pagination 
    $scope.activeForum = {
        index: 0,
        limitTo: 2
    };


    $rootScope.header.page = 'forum';
    //get JSON data
    $scope.forumData = {};
    $http.get("data/forum.json")
        .then(function(res) {
            $scope.forumData = res.data;
            $scope.activeForum.length = $scope.forumData.forums.length;
            $scope.setPageNavs();
        });

    $scope.setPageNavs = function() {
        $scope.activeForum.pageLinks = [];
        $scope.activeForum.pageCount = Math.ceil($scope.activeForum.length / $scope.perpageVal.value);
        for (var i = 0; i < $scope.activeForum.pageCount; i++) {
            $scope.activeForum.pageLinks.push({
                index: i,
                label: (i + 1)
            });
        }
    };

    $scope.$watch('perpageVal.value', function() {
        $scope.setPageNavs();
    })


    $scope.noLimit = function() {
        $scope.activeForum.limitTo = 1000;
    };

    /** pagination goto page */
    $scope.gotoPage = function(page) {
        var pagesize = Math.ceil($scope.activeForum.length / $scope.perpageVal.value);
        var prevVl = Math.max($scope.activeForum.index - 1, 0);
        var nextVl = Math.min($scope.activeForum.index + 1, pagesize - 1);
        var LastVl = pagesize - 1;
        page = page === 'first' ? 0 : page;
        page = page === 'last' ? LastVl : page;
        page = page === 'prev' ? prevVl : page;
        page = page === 'next' ? nextVl : page;

        $scope.activeForum.index = page;
    };

    /** mark read */
    $scope.markRead = function() {
        for (var i = 0; i < $scope.forumData.forums.length; i++) {
            if (typeof($scope.forumData.forums[i].isNew)!=='undefined') {
                $scope.forumData.forums[i].isNew = false;
            }
        }
    };


    // breadcrumb
    $rootScope.showBreadcrumbs = true;
    $rootScope.crumble = {};
    $rootScope.crumble.compaq = true;
    $rootScope.crumble.trail = [{
        label: "",
        path: "/"
    }, {
        label: "Forums",
        path: "/Forum"
    }];

    $scope.username = $scope.getUser() || '';
    $scope.local = {};

    $rootScope.user = JSON.parse($scope.getUser()) || null;
    if ($scope.user && $scope.user.firsVisit) {
        $rootScope.user.firsVisit = false;
        $rootScope.setUsername = ($rootScope.user);
    }

    /** validate username */
    var inValidNames = ["rioandrew", "tammyandrew", "chrisandrew"];
    $scope.isValidNickname = true;

    function checkNickname() {
        for (i = 0; i < inValidNames.length; i++) {
            if ($scope.local.nickname === '' || $scope.local.nickname === inValidNames[i]) {
                return false;
            }
        }
        return true;
    }
    if ($scope.user && $scope.user.firstVisit) {
        var cur = $scope.user.username.replace(/@/g, '');
        cur = cur.replace(/ /g, '') + 'andrew'; // andrew is added a as dummy lastname
        $scope.local.nickname = cur;

        $scope.nicknameStatus = checkNickname();
    }
    $scope.validateName = function(e) {
        var key = typeof event.which === "undefined" ? event.keyCode : event.which;
        var isValid = true;
        if (key === 50 || key === 32) {
            isValid = false;
        } else if (!checkNickname()) {
            isValid = false;
        }
        $scope.nicknameStatus = isValid;
    };

    $scope.submitNick = function(nickname) {
        if ($scope.isValidNickname === true) {
            $scope.user.nickname = nickname;
            $scope.user.firstVisit = false;
            $scope.setUsername($scope.user);
        }
    };

})
