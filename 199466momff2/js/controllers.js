'use strict';

var controllers = angular.module('controllers', []);

/**
 * masterCtrl
 ********************************/
controllers.controller('masterCtrl', ['$scope', 'DataService', '$location',
    function ($scope, DataService, $location) {
		// store role of user had login
    	$scope.role = null;
        $scope.startLogin = false;
        $scope.hadLogin = false;

        // store search data
        $scope.search = {};

	    
        $scope.select = {item: 0};
        $scope.router = function(endpoint) {
		    $location.path("/" + ($scope.partial = endpoint));
		};

        // starting login
        $scope.authorization = function() {
        	if(!$scope.hadLogin) {
        		$scope.startLogin = true;
        	} else {
        		$scope.startLogin = false;
        		$scope.hadLogin = false;
        		$location.path('/Home');
        	}
        }

        // mock up login
	    $scope.login = function(role, buyGift) {
	    	enableScroll();
	    	$scope.role = role;
	    	$scope.startLogin = false;
	    	$scope.hadLogin = true;
	    	if(!buyGift) {
	    		$location.path('/MyProfile');
	    	} else {
	    		$location.path('/ShoppingCard');
	    	}
	    }

	    // mock up add to card
	    $scope.addToCard = function () {
	    	if($scope.hadLogin) {
	    		$location.path('/ShoppingCard');
	    	} else {
	    		$scope.startLogin = true;
	    		disableScroll();
	    	}
	    }

	    // get role
	    $scope.isVisible = function(items) {
	    	var roles = items.split(',');
	    	for(var index in roles) {
	    		if(roles[index] == $scope.role)
	    			return true;
	    	}
	    	return false;
	    }

	    // disable scroll of body when login box show
	    function disableScroll() {
	    	angular.element('body').addClass('hide-body');
	    }
	    // ebable scroll of body when login box show
	    function enableScroll() {
	    	angular.element('body').removeClass('hide-body');
	    }

    }
]);

/**
 * homeCtrl
 ********************************/
controllers.controller('homeCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {
        $scope.pause = false;
        $scope.check = false;
        // display view details
    	$scope.display = false;
  		$scope.showInfo = function(item){
  			$scope.display = true;
  			$scope.arrayList = item;
  		}


        // close view details
  		$scope.closeInfo = function () {
  			$scope.display = false;
  		}

  		// add comment
  		$scope.checkComment = function(){
  			$scope.check = true;
  		}

        // data content Home
	    var HomePromise = DataService.query('Home');
	        HomePromise.then(function(data) {
	            $scope.Home = data;
	        }, function(data) {});

	    // mock up infinite scroll
	    $scope.loadMore = function() {
	    	if($scope.search.name != undefined && $scope.search.name != '') return;
	    	if($scope.Home && $scope.Home.listItem.length <= 24 && !$scope.pause) {
		    	$scope.pause = true;
		    	$timeout(function () {
			    	for(var i = 0; i < 4; i++) {
		    			$scope.Home.listItem.push(angular.copy($scope.Home.more));
		    		}
		    		$scope.pause = false;
		    	}, 800);
		    }
	    }
    }
]);

/**
 * myCartCtrl
 ********************************/
controllers.controller('myCartCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {
        $scope.pause = false;

        // open file dialog
        $scope.openFileDialog = function (elementName) {
        	angular.element('#' + elementName)[0].click();

        }

        // data content Myinfo
	    var MyinfoPromise = DataService.query('Myinfo');
	        MyinfoPromise.then(function(data) {
	            $scope.Myinfo = data;
	        }, function(data) {});

        // data content MyCart
	    var MyCartPromise = DataService.query('MyCart');
	        MyCartPromise.then(function(data) {
	            $scope.MyCart = data;
	        }, function(data) {});

	    // data content Founders
	    var FoundersPromise = DataService.query('Founders');
	        FoundersPromise.then(function(data) {
	            $scope.Founders = data;
	        }, function(data) {});

	    // data content FounderShares
	    var FounderSharesPromise = DataService.query('FounderShares');
	        FounderSharesPromise.then(function(data) {
	            $scope.FounderShares = data;
	        }, function(data) {});

	        
	    $scope.user = {item: 0};
	    $scope.activeButton = {item: 1};
	    $scope.show = "show";

	    // mock up infinite scroll
	    $scope.loadMore = function() {
	    	if($scope.MyCart && $scope.MyCart.listItem.length <= 30 && !$scope.pause) {
		    	$scope.pause = true;
		    	$timeout(function () {
				    	for(var i = 0; i < 5; i++) {
			    			$scope.MyCart.listItem.push(angular.copy($scope.MyCart.more));
			    		}
			    		$scope.pause = false;
		    	}, 800);
		    }
	    }

	    $scope.showAddNew = false;

    	$scope.startAddNew = function () {
    		$scope.showAddNew = true;
    	}
        // data content PlatformEmployee
	    var MyinfoPromise = DataService.query('PlatformEmployee');
	        MyinfoPromise.then(function(data) {
	            $scope.PlatformEmployee = data;
	        }, function(data) {});

	         //add item
        $scope.addItem = function (source, object) {
            object.push(angular.copy(source));
            $scope.showAddNew = false;
        };
        
        //delete Custom Site
	    $scope.delete = function (index, object) {
	        if (index > -1) {
	            object.splice(index, 1);
	        }
	    }
	    // init when page loaded
	    function init() {
	    	switch ($scope.role) {
	    		case 'champion':
	    			$scope.user.item = 1;
	    			break;
	    		case 'founder':
	    			$scope.user.item = 1;
	    			break;
	    		case 'employee':
	    			$scope.user.item = 2;
	    			break;
	    	}
	    }
	    init();
    }
]);


/*-----------PostCardsCtrl------------*/
controllers.controller('PostCardsCtrl', ['$scope', 'DataService',
    function ($scope, DataService) {

        // data content PostCards
	    var MyinfoPromise = DataService.query('PostCards');
	        MyinfoPromise.then(function(data) {
	            $scope.PostCards = data;
	        }, function(data) {});


	        $scope.pause = false;
        
        // displaay view details
    	$scope.display = false;
  		$scope.showInfo = function(item){
  			$scope.display = true;
  			$scope.arrayList = item;
  		}

        // close view details
  		$scope.closeInfo = function () {
  			$scope.display = false;
  		}

    }
]);
/*-----------FounderpostingCtrl------------*/
controllers.controller('FounderpostingCtrl', ['$scope', 'DataService',
    function ($scope, DataService) {

        // data content Founderposting
	    var MyinfoPromise = DataService.query('Founderposting');
	        MyinfoPromise.then(function(data) {
	            $scope.Founderposting = data;
	        }, function(data) {});

	    //dropdown options
	    $scope.optionList = {
	        "BusinessName": [
				{ "text": "Select" },
				{ "text": "State 1", "value": "State 1" },
				{ "text": "State 2", "value": "State 2" },
				{ "text": "State 3", "value": "State 3" }
	        ]
	    }
    }
]);
/*-----------PlatformEmployeeCtrl------------*/
controllers.controller('PlatformEmployeeCtrl', ['$scope', 'DataService',
    function ($scope, DataService) {

        // data content PlatformEmployee
	    var MyinfoPromise = DataService.query('PlatformEmployee');
	        MyinfoPromise.then(function(data) {
	            $scope.PlatformEmployee = data;
	        }, function(data) {});
    }
]);
