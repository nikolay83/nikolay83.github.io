/* Controllers */
(function() {
		'use strict';

		angular
				.module('app.admin')
				.controller('Admin', Admin)
				.controller('AddUser', AddUser);

		//Admin
		function Admin($scope, $filter, $location, dataSvc,FileUploader,$timeout,$rootScope,$window) {
				var vm = this;
				vm.bu = 'annuities';
				vm.dbCurrent = {};
				vm.dbBUtype = {};
				$scope.dbm = {};
				$scope.dbBUinfo = {};

				$rootScope.isShowDivDrag = true;
				//sortOptions
				$scope.rowSortOptions = {
						handle: '.move-handel-row'
				}

				//get data
				var promise = dataSvc.query('app/data/db.admin.json');
				promise.then(function(data) {
						$scope.dbm = data;
				});

				/**
				 * Business Unit info (BU)
				 */
				//get bu data
				var promise = dataSvc.query('app/data/db.bu-info.json');
				promise.then(function(data) {
						vm.dbCurrent = data;
						vm.bu = vm.dbCurrent ? vm.dbCurrent.buInfo.buSelected : 'annuities';
						vm.dbCurrentType = vm.dbCurrent[vm.bu];
				});

				//change child data on selected partent item change
				$scope.$watch('vm.dbCurrent.buInfo.buSelected', function() {
						vm.bu = (vm.dbCurrent && vm.dbCurrent.buInfo) ? vm.dbCurrent.buInfo.buSelected : 'annuities';
						vm.dbCurrentType = vm.dbCurrent[vm.bu];
				})


				/**
				 * process
				 */
				//get process data
				$rootScope.dbProCurrentdragData = [];
				var promise = dataSvc.query('app/data/db.process.json');
				promise.then(function(data) {
					vm.dbProCurrent = data;			
					vm.dbProCurrentdragData = angular.copy(vm.dbProCurrent.masterList.sla[vm.dbProCurrent.masterList['selectedKpi']]);
					$rootScope.dbProCurrentdragData = vm.dbProCurrentdragData;
				});

				

				//change child data on selected partent item change
				vm.process = {};
				//process row data structure
				vm.process.ds = {
						"categoryVal": $scope.newRecord,
						"category": $scope.newRecord,
						"kpiVal": {},
						"selectedKpi": "",
						"kpi": [],
						"slaVal": {
								"newSla": {}
						},
						"sla": {
								"newSla": []
						}
				}

				$scope.$on('addNewRecord', function() {
						var nc = angular.copy(vm.process.ds);
						nc.category = [];
						var tx = $('.li-add-row .li-add .text-ctrl').val();
						nc[tx + 'Val'] = {};

						nc.category.push({ 'id': tx.replace(' ', ''), 'name': tx });
						var len = vm.dbProCurrent.kpiList.length;
						vm.dbProCurrent.kpiList.push(nc);
						$scope.$broadcast('addedRecord');
				})

				// update code
				$scope.isShowApproveAddOn = false;

				$rootScope.arraySelected =[];
				// show hide popup upload file
				$scope.showPopupUpload = function() {
					uploader.queue=[];
					$scope.uploadFileShow = true;
					$scope.stepFirstUpload = true;
					$scope.stepSecondUpload = false;
					$scope.stepThirdUpload = false;
					$scope.stepFourthUpload = false;
					$timeout(function(){
						if (angular.element(document.querySelectorAll('#wrapper'))[0].offsetHeight > $window.innerHeight) {
							angular.element(document.querySelectorAll('.dark-overlay')).css("height",angular.element(document.querySelectorAll('#wrapper'))[0].offsetHeight+"px");
						}else{
							angular.element(document.querySelectorAll('.dark-overlay')).css("height",$window.innerHeight+"px");
						}
					}, 50);
				}

				$scope.hidePopupUpload = function() {
					uploader.queue=[];
					$scope.uploadFileShow = false;
				}

				$scope.retryUpload = function() {
					//show step 2
					$scope.stepFirstUpload = true;
					$scope.stepSecondUpload = false;
					$scope.stepThirdUpload = false;
					$scope.stepFourthUpload = false;
					testUpload = true;
					
				}

				$scope.stepFirstUpload = true;
				// upload file function
				var uploader = $scope.uploader = new FileUploader({
						url: 'upload.php'
				});

				// FILTERS
				uploader.filters.push({
						name: 'customFilter',
						fn: function(item /*{File|FileLikeObject}*/, options) {
								return this.queue.length < 10;
						}
				});

				// CALLBACKS
				var testUpload = false;
				uploader.onAfterAddingAll = function(addedFileItems) {
					//loading file mock
					//upload true
					if (testUpload===true) {
						$scope.stepFirstUpload = false;
						$scope.stepSecondUpload = true;
						$scope.stepThirdUpload = false;
						$scope.stepFourthUpload = false;

						$scope.percentValue =0;
						$scope.loadingPercent = $scope.percentValue + "%";
						angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");

						$timeout(function() { 
							$scope.percentValue =30;
							$scope.loadingPercent = $scope.percentValue + "%";
							angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");
						}, 1500); 
						
						$timeout(function() { 
							$scope.percentValue =100;
							$scope.loadingPercent = $scope.percentValue + "%";
							angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");
							$timeout(function() { 
								$scope.stepSecondUpload = false;
								$scope.stepThirdUpload = true;
								uploader.queue=[];
								testUpload = false;
							}, 500); 
						}, 3000); 
					}
					// upload fail
					if (testUpload === false) {
						//show step 2
						$scope.stepFirstUpload = false;
						$scope.stepSecondUpload = true;

						//loading file mock
						$scope.percentValue =0;
						$scope.loadingPercent = $scope.percentValue + "%";
						angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");

						$timeout(function() { 
							$scope.percentValue =30;
							$scope.loadingPercent = $scope.percentValue + "%";
							angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");
						}, 1500); 

						$timeout(function() { 
							$scope.percentValue =80;
							$scope.loadingPercent = $scope.percentValue + "%";
							angular.element(document.querySelectorAll('.inline-progress')).css('width', $scope.percentValue+"%");
							$timeout(function() { 
								$scope.stepSecondUpload = false;
								$scope.stepThirdUpload = false;
								$scope.stepFourthUpload = true;
								uploader.queue=[];
							}, 500); 
						}, 3000); 
					}
						
				};

				//KPI's / SLA's
				$scope.addCategory= function () {
					if (vm.categoryTitle!=="") {
						var itemAdd = {
		            "categoryVal": {},
		            "category": [{
		                "name": vm.categoryTitle,
		                "id": "utilization"
		            }],
		            "kpiVal": {},
		            "selectedKpi": "individual",
		            "kpi": [],
		            "slaVal": {
		                "individual": {}
		            },
		            "sla": {
		                "individual": []
		            }
		        	}
		        vm.dbProCurrent.kpiList.push(itemAdd);
						vm.categoryTitle = "";
					}
				}

				$scope.addKPI = function () {
					if (vm.titleKPI!=="") {
						var itemKPI =   {
                    "name": vm.titleKPI,
                    "id": vm.titleKPI,
                    "slaVal": {}
                }
						vm.dbProCurrent.kpiList[vm.dbProCurrent.kpiList.length-1].kpi.push(itemKPI);
						vm.titleKPI = "";
					}
				}

				//get Data Global Fields
				var promise = dataSvc.query('app/data/db.global-fields.json');
				promise.then(function(data) {
						vm.dbGlobalField = data;
				});

				//get Data Risk calculation
				var promise = dataSvc.query('app/data/db.risk-calculation.json');
				promise.then(function(data) {
						vm.dbRiskCalculation = data;
				});

				//get Data Corporate & Divisional Training
					var promise = dataSvc.query('app/data/db.corporate-divisional-training.json');
					promise.then(function(data) {
							vm.dbCorporateDivisional = data;
							vm.dbCorporateDivisionalDragData=angular.copy(vm.dbCorporateDivisional.masterList.sla[vm.dbCorporateDivisional.masterList['selectedKpi']]);
					});

					$scope.addCurriculum = function () {
						if (vm.curriculumTitle!=="" ) {
							var addItem = {
						        "title":vm.curriculumTitle,
						        "curriculums":[],
						        "risks":[]
									}
							vm.dbCorporateDivisional.corporateDivisional.push(addItem);
							vm.curriculumTitle = "";
							vm.riskCorTitle = "";
						}
					}

					$scope.addRiskCor = function () {
						if (vm.riskCorTitle!=="" ) {
							var addItem = {
						        "name":vm.riskCorTitle
									}
							var lastItemIndex = vm.dbCorporateDivisional.corporateDivisional.length -1;
							vm.dbCorporateDivisional.corporateDivisional[lastItemIndex].risks.push(addItem);
							vm.riskCorTitle = "";
						}
					}


				//get Data functional Area Process
					var promise = dataSvc.query('app/data/db.functional-area-processes.json');
					promise.then(function(data) {
							vm.dbFuncAreaProcess = data;
							vm.dbFuncAreaProcessdragData = angular.copy(vm.dbFuncAreaProcess.masterList.sla[vm.dbFuncAreaProcess.masterList['selectedKpi']]);
					});

					$scope.addCoreProcess = function () {
						if (vm.coreProcessTitle!=="" ) {
							var coreProcessItem = {
							    "title":vm.coreProcessTitle,
							    "curriculums":[],
							    "subProcess":[]
								}
							vm.dbFuncAreaProcess.functionalArea.push(coreProcessItem);
							vm.coreProcessTitle = "";
							vm.subProcessTitle = "";
						}
					}

					$scope.addLastSubProcess= function () {
						if (vm.subProcessTitle!=="") {
							$scope.addSubProcess(vm.dbFuncAreaProcess.functionalArea.length-1,vm.subProcessTitle);
							vm.subProcessTitle = "";
							vm.riskTitle = "";
						}
					}

					$scope.addLastRiskProcess= function () {
						if (vm.riskTitle!=="") {
							$scope.addRisk(vm.dbFuncAreaProcess.functionalArea.length-1,vm.riskTitle);
							vm.riskTitle = "";
						}
					}

					$scope.addSubProcess = function (index,titleSub) {
						if (titleSub!=="") {
							var subProcessItem = {
		                  "desc":titleSub,
		                  "risk":[]
		              	}
							vm.dbFuncAreaProcess.functionalArea[index].subProcess.push(subProcessItem);
							titleSub = "";
						}
					}

					$scope.addRisk = function (index,titleRisk) {
						if (titleRisk!=="") {
							var riskItem = {
		                  "name":titleRisk
		              	}
							var lastIndexSub = vm.dbFuncAreaProcess.functionalArea[index].subProcess.length-1;
							vm.dbFuncAreaProcess.functionalArea[index].subProcess[lastIndexSub].risk.push(riskItem);
						}
					}
				

				//get Data business continuity disaster recovery
					var promise = dataSvc.query('app/data/db.business-continuity-disaster-recovery.json');
					promise.then(function(data) {
							vm.dbBusinessContinuity = data;
							vm.dbBusinessDragData = angular.copy(vm.dbBusinessContinuity.masterList.sla[vm.dbBusinessContinuity.masterList['selectedKpi']]);

					});

					$scope.addProcessBu = function () {
						if (vm.curriculumTitle!=="" ) {
							var addItem = {
						        "title":vm.curriculumTitle,
						        "curriculums":[],
						        "risks":[]
									}
							vm.dbBusinessContinuity.businessRecovery.push(addItem);
							vm.curriculumTitle = "";
							vm.riskCorTitle = "";
						}
					}

					$scope.addRiskBu = function () {
						if (vm.riskCorTitle!=="" ) {
							var addItem = {
						        "name":vm.riskCorTitle
									}
							var lastItemIndex = vm.dbBusinessContinuity.businessRecovery.length -1;
							vm.dbBusinessContinuity.businessRecovery[lastItemIndex].risks.push(addItem);
							vm.riskCorTitle = "";
						}
					}

				//get Data Records Management
					var promise = dataSvc.query('app/data/db.records-management.json');
					promise.then(function(data) {
							vm.dbRecordsManagement = data;
							vm.dbRecordsManagementDragData = angular.copy(vm.dbRecordsManagement.masterList.sla[vm.dbRecordsManagement.masterList['selectedKpi']]);
					});

					$scope.addProcessRec = function () {
						if (vm.curriculumTitle!=="" ) {
							var addItem = {
						        "title":vm.curriculumTitle,
						        "curriculums":[],
						        "risks":[]
									}
							vm.dbRecordsManagement.recodsManagement.push(addItem);
							vm.curriculumTitle = "";
							vm.riskCorTitle = "";
						}
					}

					$scope.addRiskRec = function () {
						if (vm.riskCorTitle!=="" ) {
							var addItem = {
						        "name":vm.riskCorTitle
									}
							var lastItemIndex = vm.dbRecordsManagement.recodsManagement.length -1;
							vm.dbRecordsManagement.recodsManagement[lastItemIndex].risks.push(addItem);
							vm.riskCorTitle = "";
						}
					}

				//get Data information security
					var promise = dataSvc.query('app/data/db.information-security.json');
					promise.then(function(data) {
							vm.dbInfomationSecurity = data;
							vm.dbInfomationSecurityDragData = angular.copy(vm.dbInfomationSecurity.masterList.sla[vm.dbInfomationSecurity.masterList['selectedKpi']]);
					});

					$scope.addProcessInfo = function () {
						if (vm.curriculumTitle!=="" ) {
							var addItem = {
						        "title":vm.curriculumTitle,
						        "curriculums":[],
						        "risks":[]
									}
							vm.dbInfomationSecurity.infoSecurity.push(addItem);
							vm.curriculumTitle = "";
							vm.riskCorTitle = "";
						}
					}

					$scope.addRiskInfo = function () {
						if (vm.riskCorTitle!=="" ) {
							var addItem = {
						        "name":vm.riskCorTitle
									}
							var lastItemIndex = vm.dbInfomationSecurity.infoSecurity.length -1;
							vm.dbInfomationSecurity.infoSecurity[lastItemIndex].risks.push(addItem);
							vm.riskCorTitle = "";
						}
					}

				//get Data Privacy protection
				var promise = dataSvc.query('app/data/db.data-privacy-protection.json');
				promise.then(function(data) {
						vm.dbPrivacyProtection = data;
						vm.dbPrivacyProtectionDragData = angular.copy(vm.dbPrivacyProtection.masterList.sla[vm.dbPrivacyProtection.masterList['selectedKpi']]);
				});

				$scope.addProcessPriv = function () {
					if (vm.curriculumTitle!=="" ) {
						var addItem = {
					        "title":vm.curriculumTitle,
					        "curriculums":[],
					        "risks":[]
								}
						vm.dbPrivacyProtection.privacyProtection.push(addItem);
						vm.curriculumTitle = "";
						vm.riskCorTitle = "";
					}
				}

				$scope.addRiskPriv = function () {
					if (vm.riskCorTitle!=="" ) {
						var addItem = {
					        "name":vm.riskCorTitle
								}
						var lastItemIndex = vm.dbPrivacyProtection.privacyProtection.length -1;
						vm.dbPrivacyProtection.privacyProtection[lastItemIndex].risks.push(addItem);
						vm.riskCorTitle = "";
					}
				}

				vm.titlePopupNonGlobal = "";

				$scope.clickApproveButton = function () {
					$scope.isShowApproveAddOn =true;
					$timeout(function(){
						if (angular.element(document.querySelectorAll('#wrapper'))[0].offsetHeight > $window.innerHeight) {
							angular.element(document.querySelectorAll('.dark-overlay')).css("height",angular.element(document.querySelectorAll('#wrapper'))[0].offsetHeight+"px");
						}else{
							angular.element(document.querySelectorAll('.dark-overlay')).css("height",$window.innerHeight+"px");
						}
					}, 50);
				}

				//click
				$scope.clickBtnApprove = function () {
					if (vm.titlePopupNonGlobal!=='') {
						$scope.isShowApproveAddOn=false; 
						vm.titlePopupNonGlobal='';
					}
				}

				//End Update Code
		}

		//AddUser
		function AddUser($scope, $filter, $location, dataSvc) {
				var vmAdd = this;
				vmAdd.dbAdd = {};

				//sortOptions
				$scope.rowSortOptions = {
						handle: '.move-handel-row'
				}

				//get data
				var promise = dataSvc.query('app/data/db.admin.new-user.json');
				promise.then(function(data) {
						vmAdd.dbAdd = data;
				});


				//change child data on selected partent item change
				vmAdd.process = {};
				//process row data structure
				vmAdd.process.ds = {
						"categoryVal": {},
						"category": [],
						"kpiVal": {},
						"selectedKpi": "",
						"kpi": [],
						"slaVal": {
								"newSla": {}
						},
						"sla": {
								"newSla": []
						}
				}



 }

})();
