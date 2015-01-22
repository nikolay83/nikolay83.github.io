'use strict';

/* Controller */

var controllers = angular.module("controllers",[]);

//Main Controller
controllers.controller("mainCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
});

//My History Controller
controllers.controller("championMyHistoryCtrl",function($scope,championHistoryList,$rootScope){
	$rootScope.modal = false;
	//Get History
	var promise = championHistoryList.query();
	promise.then(function(data){
		$scope.historyList = data.history;
		$rootScope.role = 'Champion';
	},function(data){});
});

controllers.controller("founderMyHistoryCtrl",function($scope,founderHistoryList,$rootScope){
	$rootScope.modal = false;
	//Get History
	var promise = founderHistoryList.query();
	promise.then(function(data){
		$scope.historyList = data.history;
		$rootScope.role = 'Founder';
	},function(data){});
});

//My Employees Controller
controllers.controller("MyEmployeesCtrl",function($scope,employeesList,$rootScope){
	$rootScope.modal = false;
	//Get Employees
	$rootScope.role = 'Founder';
	var promise = employeesList.query();
	promise.then(function(data){
		$scope.employeesList = data.employees;
		angular.forEach($scope.employeesList,function(employees,index){
			angular.extend(employees,{'flag' : false , 'nameEmpty' : false , 'passwordEmpty': false});
		});
		//Add
		$scope.add = function(){
			var item = {
				"name": "",
				"password": "",
				"flag": true,
				"nameEmpty": "",
				"passwordEmpty": ""
			}
			$scope.employeesList.push(item);
		}
		//Modify
		$scope.modify = function(idx){
			$scope.employeesList[idx].flag = true;
		}
		//Save
		$scope.save = function(idx){
			if($scope.employeesList[idx].name && $scope.employeesList[idx].password){
				$scope.employeesList[idx].flag = 
				$scope.employeesList[idx].passwordEmpty = 
				$scope.employeesList[idx].nameEmpty = false;
			}else{
				if(!$scope.employeesList[idx].name){
					$scope.employeesList[idx].nameEmpty = true;
				}
				if(!$scope.employeesList[idx].password){
					$scope.employeesList[idx].passwordEmpty = true;
				}
			}
		}
		//Delete
		$scope.remove = function(idx){
			$scope.employeesList.splice(idx, 1);
		}
	},function(data){});
});

//Report Abuse Controller
controllers.controller("reportAbuseCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
	$rootScope.role = 'Founder';
	$scope.submitQuery = function(){
		$scope.submitted = true;
		if($scope.abuseForm.$valid){
			$scope.reportModal = $rootScope.modal = true;
		}
	}
	$scope.submit = $scope.submitQuery;
	//Close Modal
	$scope.done = function(){
		$scope.submitted = $scope.reportModal = $rootScope.modal = false;
	}
	$scope.closeModal = function(){
		$scope.submitted = $scope.reportModal = $rootScope.modal = false;
	}
});

//Provide Feedback
controllers.controller("provideFeedbackCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
	$rootScope.role = 'Founder';
	$scope.myOptions = [
		{
			name: 'Question',
			value: 'Question'
		},
		{
			name: 'Problem',
			value: 'Problem'
		},
		{
			name: 'Other',
			value: 'Other'
		}
	];
	$scope.feedback_type = {
		name: 'Question',
		value: 'Question'
	}
	$scope.submit = function(){
		$scope.submitted = true;
	}
});

//Payment
controllers.controller("paymentCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
	$scope.years = [
		{
			name: 'year',
			value: 'year'
		},
		{
			name: '2014',
			value: '2014'
		},
		{
			name: '2013',
			value: '2013'
		},
		{
			name: '2012',
			value: '2012'
		},
		{
			name: '2011',
			value: '2011'
		},
		{
			name: '2010',
			value: '2010'
		}
	];
	$scope.months = [
		{
			name: 'month',
			value: 'month'
		},
		{
			name: '1',
			value: '1'
		},
		{
			name: '2',
			value: '2'
		},
		{
			name: '3',
			value: '3'
		},
		{
			name: '4',
			value: '4'
		},
		{
			name: '5',
			value: '5'
		},
		{
			name: '6',
			value: '6'
		},
		{
			name: '7',
			value: '7'
		},
		{
			name: '8',
			value: '8'
		},
		{
			name: '9',
			value: '9'
		},
		{
			name: '10',
			value: '10'
		},
		{
			name: '11',
			value: '11'
		},
		{
			name: '12',
			value: '12'
		}
	];
	$scope.select_year = {
		name: 'year',
		value: 'year'
	}
	$scope.select_month = {
		name: 'month',
		value: 'month'
	}
	$scope.submit = function(){
		$scope.submitted = true;
	}
});

//My Info Controller
controllers.controller("platEmployeeMyInfoCtrl",function($scope,infoList,passwordList,$rootScope){
	$rootScope.modal = false;
	$rootScope.role = 'Employee';
	$scope.uploader = {};
	//Get Info
	var promise = infoList.query();
	promise.then(function(data){
		$scope.infoList = data.info;
		
		$scope.edit = function(){
			if($scope.uploader.flow[3].files.length){
				$scope.infoList[3].describe = $scope.uploader.flow[3].files[0].name	
			}
			$scope._infoList = angular.copy($scope.infoList);
			$scope.switch = true;
		}
		$scope.cancel = function(){
			angular.copy($scope._infoList,$scope.infoList);
			$scope.switch = false;
		}
		$scope.save = function(){
			if($scope.infoForm.$valid){
				$scope.switch = false;
			}
		}
	},function(data){});
	//Get Password
	var promise = passwordList.query();
	promise.then(function(data){
		$scope.password = data.password;
		$scope.password[0].new = {};
		$scope.password[0].confirm = {};
		$scope.editPassword = function(){
			$scope.switchPassword = true;
			$scope.password[0]._password = angular.copy($scope.password[0].password);
			$scope.password[0]._new = angular.copy($scope.password[0].new);
			$scope.password[0]._confirm = angular.copy($scope.password[0].confirm);
			$scope.password[0].new.validate = $scope.password[0].confirm.validate = true;
		}
		$scope.cancelPassword = function(){
			$scope.password[0].password = $scope.password[0]._password;
			angular.copy($scope.password[0]._new,$scope.password[0].new);
			angular.copy($scope.password[0]._confirm,$scope.password[0].confirm);
			$scope.switchPassword = false;
		}
		$scope.savePassword = function(){
			$scope.submitted = true;
			if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
				$scope.switchPassword = false;
			}
		}
	},function(data){});
});

//Shopping Cart Controller
controllers.controller("shppingCartCtrl",function($scope,cartList,$rootScope){
	$rootScope.modal = false;
	//Get Shopping Cart
	var promise = cartList.query();
	promise.then(function(data){
		$scope.cartList = data.carts;
		$scope.price = [];
		$scope.total = 0;
		for(var i=0;i<$scope.cartList.length;i++){
			$scope.price.push(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100);
			$scope.total += Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100;
		}
		$scope.reflash = function(){
			$scope.total = 0;
			$scope.price = [];
			$scope.validate = [];
			for(var i=0;i<$scope.cartList.length;i++){
				//Validate
				if(Number($scope.cartList[i].value.replace('$','')) < $scope.cartList[i].available){
					$scope.validate.push(false);
					if(!isNaN(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100)){
						$scope.price.push(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100);
					}else{
						$scope.price.push('0');	
					}
					$scope.total += $scope.price[i];	
					$scope.total = Math.round($scope.total*100)/100;
				}else{
					$scope.price.push('0');
					$scope.total += $scope.price[i];	
					$scope.total = Math.round($scope.total*100)/100;
					$scope.validate.push(true);	
				}
			}
		}
		//Pay
		$scope.pay = function(){
			if(!$rootScope.role){
				$rootScope.modal = $scope.unLoginModal = true;
			}	
		}
		//Close
		$scope.cancel = function(){
			$rootScope.modal = $scope.unLoginModal = false;
		}
		//Delete
		$scope.delete = function(id){
			for(var i=0;i<$scope.cartList.length;i++){
				$scope.cartList.splice(i,1);
			}	
			$scope.reflash();
		}
		$scope.closeModal = function(){
			$rootScope.modal = $scope.unLoginModal = false;
		}
	},function(data){});
});

//Founder Status Controller
controllers.controller("founderStatusCtrl",function($scope,founderList,$rootScope){
	$rootScope.modal = false;
	$rootScope.role = 'Employee';
	//Get Founder Status
	var promise = founderList.query();
	promise.then(function(data){
		$scope.founderList = data.founder;
		$scope.active = function(idx){
			for(var i=0;i<$scope.founderList.length;i++){
				$scope.founderList[i].active = false;	
			}
			$scope.founderList[idx].active = true;
		}
	},function(data){});
});

//Founder$hares Controller
controllers.controller("founder$haresCtrl",function($scope,founder$haresList,$rootScope){
	$rootScope.modal = false;
	$rootScope.role = 'Founder';
	//Get History
	var promise = founder$haresList.query();
	promise.then(function(data){
		$scope.founder$hares = data.founder$hares;
	},function(data){});
});

//FounderF$Posting Controller
controllers.controller("founderF$PostingCtrl",function($scope,postList,$rootScope){
	$rootScope.modal = false;
	//Get History
	$rootScope.role = 'Founder';
	var promise = postList.query();
	promise.then(function(data){
		$scope.post = data.post;
		//Set Dropdown
		$scope.myOptions = [
			{
				name: 'Adventure',
				value: 'Adventure'
			},
			{
				name: 'Food & Drink',
				value: 'Food & Drink'
			},
			{
				name: 'Flying',
				value: 'Flying'
			},
			{
				name: '...',
				value: '...'
			}
		];
		$scope.business_type = {
			name: $scope.post[0].businessType,
			value: $scope.post[0].businessType
		}
		//Save
		$scope.save = function(){
			if($scope.form.$valid){
				$scope.saveModal = $scope.modal = true;
			}
		}
		//Done
		$scope.done = function(){
			$scope.saveModal = $scope.modal = false;	
		}
		//Post
		$scope.postNow = function(){
			if($scope.form.$valid){
				$scope.postModal = $scope.modal = true;
			}
		}
		//Close Modal
		$scope.closeModal = function(){
			$scope.postModal = $scope.saveModal = $scope.modal = false;	
		}
	},function(data){});
});

//Register Controller
controllers.controller("registerCtrl",function($scope,$rootScope){
	$rootScope.modal = true;
	$scope.accept = false;
	//Set Dropdown
	$scope.myOptions = [
		{
			name: 'Champion',
			value: 'Champion'
		},
		{
			name: 'Founder',
			value: 'Founder'
		}
	];
	$scope.account_type = {
		name: $scope.myOptions[0].name,
		value: $scope.myOptions[0].value
	}
	$scope.register = function(){
		if($scope.form.$valid && $scope.accept) {
			$rootScope.role = $scope.account_type.name;
			$rootScope.modal = false;	
		}	
	}
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
});

//Reset Password Controller
controllers.controller("resetPasswordCtrl",function($scope,$rootScope){
	$rootScope.modal = true;
	$rootScope.role = 'Founder';
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid) {
			$rootScope.modal = false;	
		}
	}
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
});

//Forgot Password Controller
controllers.controller("forgotPasswordCtrl",function($scope,$rootScope){
	$rootScope.modal = true;
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid) {
			$rootScope.modal = false;	
		}
	}
});

//Verify Account Controller
controllers.controller("verifyAccountCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
});