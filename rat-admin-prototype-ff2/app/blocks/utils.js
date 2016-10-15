$(function() {
		angular.module('app.core')
				.directive('ngEnter', ngEnter)
				.directive('sglclick', sglclick)
				.directive('toggleView', toggleView)
				.directive('editBlock', editBlock)
				.directive('selectBlock', selectBlock)
				.directive('customSelect', customSelect)
				.directive('goNav', goNav)
				.directive('notification', notification)
				.directive('masterListBlock', masterListBlock)
				.directive('editNoCheckBoxBlock', editNoCheckBoxBlock)
				.directive('editNoDragBlock', editNoDragBlock)
				.directive('positionArea', positionArea)
				.directive('validNumber', validNumber);
		//customSelect
		function customSelect() {
				return function(scope, el, attrs) {
						var _ = $(el);
						$('.select-val', _).on('click', function(e) {
								e.stopPropagation();
								var p = $(this).closest('.select-group');
								if (p.hasClass('open')) {
										p.removeClass('open');
								} else {
										p.addClass('open');
								}
						})
						$('.select-list', _).on('click', function(e) {
								e.stopPropagation();
						})
						$('body').on('click', function() {
								$('.select-group.open').removeClass('open');
						})
				}
		};

		//ngEnter
		function ngEnter() {
				return function(scope, element, attrs) {
						element.bind("keydown keypress", function(event) {
								if (event.which === 13) {
										scope.$apply(function() {
												scope.$eval(attrs.ngEnter);
										});

										event.preventDefault();
								}
						});
				}
		};

		//dingle click
		function sglclick($parse) {
				return {
						restrict: 'A',
						link: function(scope, element, attr) {
								var fn = $parse(attr['sglclick']);
								var delay = 200,
										clicks = 0,
										timer = null;
								element.on('click', function(event) {
										clicks++;
										//count clicks
										if (clicks === 1) {
												timer = setTimeout(function() {
														scope.$apply(function() {
																fn(scope, {
																		$event: event
																});
														});
														clicks = 0;
														//after action performed, reset counter
												}, delay);
										} else {
												clearTimeout(timer);
												//prevent single-click action
												clicks = 0;
												//after action performed, reset counter
										}
								});
						}
				};
		};

		//toggleView directive
		function toggleView() {
				return {
						restrict: 'A',
						link: function(scope, el, attr) {
								var _ = $(el);
								$('.toggle-group-title', _).on('click', function() {
										if (_.hasClass('collapse')) {
												_.removeClass('collapse');
										} else {
												_.addClass('collapse');
										}
								})
						}
				}
		}

		//editBlock
		function editBlock() {
				return {
						restrict: 'A',
						require: '?list',
						scope: {
								model: "=",
								list: '=editBlock',
								selected: '=',
								pending: '=',
								synched: '=',
								checkall: '@',
								restcheck: '@',
								addOnBlur: '@'
						},
						templateUrl: 'app/blocks/editBlock.template.html',
						controller: function($scope) {
						 
								//addOnBlur
								if ($scope.addOnBlur) {
										$scope.addNewRecord = function(toAdd) {
												if (toAdd) {
														$scope.$emit('addNewRecord');
												}
										}
								}


								$scope.$on('addNewRecord', function() {
										$scope.newRecord = '';

								})

								//sortOptions
								$scope.sortOptions = {
										handle: '.move-handel'
								}

								//setActive
								function setItemsActive() {
										angular.forEach($scope.list, function(value, key) {
												if ($scope.model) {
														if ($scope.model[value.id] === undefined) {
																$scope.model[value.id] = true;
														}
												}
										})
								}

								$scope.$watch('list', setItemsActive);

								$scope.changeChk = function(ele) {
										if (!ele) {
												ele = false;
										}
								}

								//check all
								$scope.chkall = true;
								if ($scope.restcheck) {
										$scope.chkall = false;
								}
								$scope.toggleAllChks = function(listArray, modelVl) {
										var _ = this;
										var _s = $scope.model;
										angular.forEach(_.model, function(val, key) {
												_s[key] = _.chkall;
										})
								}

								//addRecord
								$scope.addRecord = function() {
										var nr = {};
												var nid = $scope.newRecord.replace(' ', '');
												nid = nid.toLowerCase();
												nr = {
														id: nid,
														name: ''
												}
										if ($scope.newRecord && $scope.list) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list.push(nr);

												if ($scope.synched) {
														$scope.synched[nid] = []
												}

												$scope.newRecord = "";
										} else if ($scope.newRecord) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list = [];
												$scope.list.push(nr)
												$scope.newRecord = "";
										}
								}

								//remove record
								$scope.removeRecord = function(id, array) {
										array.splice(id, 1);
								}
						},
						link: function(scope, el, attr) {
								var _ = $(el);
								var instClk = true;
								//makes text editable
								_.on('dblclick', '.tx', function() {
										$(this).addClass('editing');
										$(this).attr('contenteditable', true);
										$(this).focus();
										instClk = false;
								})
								_.on('blur', '.tx', function() {
										$(this).removeClass('editing');
										$(this).removeAttr('contenteditable');
								})
								_.on('keypress', '.tx', function(e) {
										var code = e.keyCode || e.which;
										if (code == 13) {
												e.preventDefault();
												$(this).removeClass('editing');
												$(this).removeAttr('contenteditable');
										}
								})

								//slect item
								scope.select = function(item) {
										var ci = item;
										if (_.hasClass('can-select')) {
												if (true) {
														scope.selected = ci.id;
												}
										}
								}
						}
				}
		}

		// //masterList
		function masterListBlock() {
				return {
						restrict: 'A',
						require: '?list',
						scope: {
								model: "=",
								list: '=masterListBlock',
								dragdata:"=",
								selected: '=',
								pending: '=',
								synched: '=',
								checkall: '@',
								restcheck: '@',
								addOnBlur: '@'
						},
						templateUrl: 'app/blocks/masterListBlock.html',
						controller: function($scope,$rootScope) {
								//addOnBlur
								if ($scope.addOnBlur) {
										$scope.addNewRecord = function(toAdd) {
												if (toAdd) {
														$scope.$emit('addNewRecord');
												}
										}
								}

								$scope.$on('addNewRecord', function() {
										$scope.newRecord = '';

								})

								//sortOptions
								$scope.sortOptions = {
										handle: '.move-handel'
								}

								//setActive
								function setItemsActive() {
										angular.forEach($scope.list, function(value, key) {
												if ($scope.model) {
														if ($scope.model[value.id] === undefined) {
																$scope.model[value.id] = true;
														}
												}
										})
								}

								$scope.$watch('list', setItemsActive);

								$scope.changeChk = function(ele,record) {
										if (!ele) {
												ele = false;
												$scope.removeItemDrag(record);
										}else{
											$scope.dragdata.push(record);
										}
								}

								$scope.removeItemDrag = function (record) {
									for (var i = 0; i < $scope.dragdata.length; i++) {
										if($scope.dragdata[i].id===record.id){
											$scope.dragdata.splice(i,1);
										}
									}
								}
								//check all
								$scope.chkall = true;
								if ($scope.restcheck) {
										$scope.chkall = false;
								}
								$scope.toggleAllChks = function(listArray, modelVl) {
										var _ = this;
										var _s = $scope.model;
										angular.forEach(_.model, function(val, key) {
												_s[key] = _.chkall;
										})

										if (_.chkall) {
											$scope.dragdata = [];
											angular.forEach($scope.list, function(item) {
													$scope.dragdata.push(item);
											})
										}else{
											$scope.dragdata = [];
										}
								}

								//addRecord
								$scope.addRecord = function() {
										var nr = {};
												var nid = $scope.newRecord.replace(' ', '');
												nid = nid.toLowerCase();
												nr = {
														id: nid,
														name: ''
												}
										if ($scope.newRecord && $scope.list) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list.push(nr);

												if ($scope.synched) {
														$scope.synched[nid] = []
												}

												$scope.newRecord = "";
										} else if ($scope.newRecord) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list = [];
												$scope.list.push(nr)
												$scope.newRecord = "";
										}
								}

								//remove record
								$scope.removeRecord = function(id, array) {
										array.splice(id, 1);
								}
						},
						link: function(scope, el, attr) {
								var _ = $(el);
								var instClk = true;
								//makes text editable
								_.on('dblclick', '.tx', function() {
										$(this).addClass('editing');
										$(this).attr('contenteditable', true);
										$(this).focus();
										instClk = false;
								})
								_.on('blur', '.tx', function() {
										$(this).removeClass('editing');
										$(this).removeAttr('contenteditable');
								})
								_.on('keypress', '.tx', function(e) {
										var code = e.keyCode || e.which;
										if (code == 13) {
												e.preventDefault();
												$(this).removeClass('editing');
												$(this).removeAttr('contenteditable');
										}
								})
								//slect item
								scope.select = function(item) {
										var ci = item;
										if (_.hasClass('can-select')) {
												if (true) {
														scope.selected = ci.id;
												}
										}
								}
						}
				}
		}

		//editNoCheckBoxBlock
		function editNoCheckBoxBlock() {
				return {
						restrict: 'A',
						require: '?list',
						scope: {
								model: "=",
								list: '=editNoCheckBoxBlock',								
								selected: '=',
								pending: '=',
								synched: '=',
								checkall: '@',
								restcheck: '@',
								addOnBlur: '@'
						},
						templateUrl: 'app/blocks/editNoCheckBoxBlock.template.html',
						controller: function($scope) {
								//addOnBlur
								if ($scope.addOnBlur) {
										$scope.addNewRecord = function(toAdd) {
												if (toAdd) {
														$scope.$emit('addNewRecord');
												}
										}
								}


								$scope.$on('addNewRecord', function() {
										$scope.newRecord = '';

								})

								//sortOptions
								$scope.sortOptions = {
										handle: '.move-handel'
								}

								//setActive
								function setItemsActive() {
										angular.forEach($scope.list, function(value, key) {
												if ($scope.model) {
														if ($scope.model[value.id] === undefined) {
																$scope.model[value.id] = true;
														}
												}
										})
								}

								$scope.$watch('list', setItemsActive);

								$scope.changeChk = function(ele) {
										if (!ele) {
												ele = false;
										}
								}

								//check all
								$scope.chkall = true;
								if ($scope.restcheck) {
										$scope.chkall = false;
								}
								$scope.toggleAllChks = function(listArray, modelVl) {
										var _ = this;
										var _s = $scope.model;
										angular.forEach(_.model, function(val, key) {
												_s[key] = _.chkall;
										})
								}

								//addRecord
								$scope.addRecord = function() {
										var nr = {};
												var nid = $scope.newRecord.replace(' ', '');
												nid = nid.toLowerCase();
												nr = {
														id: nid,
														name: ''
												}
										if ($scope.newRecord && $scope.list) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list.push(nr);

												if ($scope.synched) {
														$scope.synched[nid] = []
												}

												$scope.newRecord = "";
										} else if ($scope.newRecord) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list = [];
												$scope.list.push(nr)
												$scope.newRecord = "";
										}
								}

								//remove record
								$scope.removeRecord = function(id, array) {
										array.splice(id, 1);
								}
						},
						link: function(scope, el, attr) {
								var _ = $(el);
								var instClk = true;
								//makes text editable
								_.on('dblclick', '.tx', function() {
										$(this).addClass('editing');
										$(this).attr('contenteditable', true);
										$(this).focus();
										instClk = false;
								})
								_.on('blur', '.tx', function() {
										$(this).removeClass('editing');
										$(this).removeAttr('contenteditable');
								})
								_.on('keypress', '.tx', function(e) {
										var code = e.keyCode || e.which;
										if (code == 13) {
												e.preventDefault();
												$(this).removeClass('editing');
												$(this).removeAttr('contenteditable');
										}
								})

								//slect item
								scope.select = function(item) {
										var ci = item;
										if (_.hasClass('can-select')) {
												if (true) {
														scope.selected = ci.id;
												}
										}
								}
						}
				}
		}

		//editNoDragBlock
		function editNoDragBlock() {
				return {
						restrict: 'A',
						require: '?list',
						scope: {
								model: "=",
								list: '=editNoDragBlock',								
								selected: '=',
								pending: '=',
								synched: '=',
								checkall: '@',
								restcheck: '@',
								addOnBlur: '@'
						},
						templateUrl: 'app/blocks/editNoDragBlock.template.html',
						controller: function($scope) {
								//addOnBlur
								if ($scope.addOnBlur) {
										$scope.addNewRecord = function(toAdd) {
												if (toAdd) {
														$scope.$emit('addNewRecord');
												}
										}
								}


								$scope.$on('addNewRecord', function() {
										$scope.newRecord = '';

								})

								//sortOptions
								$scope.sortOptions = {
										handle: '.move-handel'
								}

								//setActive
								function setItemsActive() {
										angular.forEach($scope.list, function(value, key) {
												if ($scope.model) {
														if ($scope.model[value.id] === undefined) {
																$scope.model[value.id] = true;
														}
												}
										})
								}

								$scope.$watch('list', setItemsActive);

								$scope.changeChk = function(ele) {
										if (!ele) {
												ele = false;
										}
								}

								//check all
								$scope.chkall = true;
								if ($scope.restcheck) {
										$scope.chkall = false;
								}
								$scope.toggleAllChks = function(listArray, modelVl) {
										var _ = this;
										var _s = $scope.model;
										angular.forEach(_.model, function(val, key) {
												_s[key] = _.chkall;
										})
								}

								//addRecord
								$scope.addRecord = function() {
										var nr = {};
												var nid = $scope.newRecord.replace(' ', '');
												nid = nid.toLowerCase();
												nr = {
														id: nid,
														name: ''
												}
										if ($scope.newRecord && $scope.list) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list.push(nr);

												if ($scope.synched) {
														$scope.synched[nid] = []
												}

												$scope.newRecord = "";
										} else if ($scope.newRecord) {
												nr.name = angular.copy($scope.newRecord);
												$scope.list = [];
												$scope.list.push(nr)
												$scope.newRecord = "";
										}
								}

								//remove record
								$scope.removeRecord = function(id, array) {
										array.splice(id, 1);
								}
						},
						link: function(scope, el, attr) {
								var _ = $(el);
								var instClk = true;
								//makes text editable
								_.on('dblclick', '.tx', function() {
										$(this).addClass('editing');
										$(this).attr('contenteditable', true);
										$(this).focus();
										instClk = false;
								})
								_.on('blur', '.tx', function() {
										$(this).removeClass('editing');
										$(this).removeAttr('contenteditable');
								})
								_.on('keypress', '.tx', function(e) {
										var code = e.keyCode || e.which;
										if (code == 13) {
												e.preventDefault();
												$(this).removeClass('editing');
												$(this).removeAttr('contenteditable');
										}
								})

								//slect item
								scope.select = function(item) {
										var ci = item;
										if (_.hasClass('can-select')) {
												if (true) {
														scope.selected = ci.id;
												}
										}
								}
						}
				}
		}

		//selectBlock
		function selectBlock() {
				return {
						restrict: 'A',
						require: '?list',
						scope: {
								model: "=",
								list: '=selectBlock',
								selected: '=',
								synched: '=',
								checkall: '@',
								restcheck: '@'
						},
						templateUrl: 'app/blocks/selectBlock.template.html',
						controller: function($scope) {


								//sortOptions
								$scope.sortOptions = {
										handle: '.move-handel'
								}

								//setActive
								function setItemsActive() {
										angular.forEach($scope.list, function(value, key) {
												if ($scope.model) {
														if ($scope.model[value.id] === undefined) {
																$scope.model[value.id] = true;
														}
												}
										})
								}

								$scope.$watch('list', setItemsActive);

								$scope.changeChk = function(ele) {
										if (!ele) {
												ele = false;
										}
								}

								//check all
								$scope.chkall = true;
								if ($scope.restcheck) {
										$scope.chkall = false;
								}
								$scope.toggleAllChks = function(listArray, modelVl) {
										var _ = this;
										var _s = $scope.model;
										angular.forEach(_.model, function(val, key) {
												_s[key] = _.chkall;
										})
								}

								//addRecord
								$scope.addRecord = function() {
										var nr = {};
										if ($scope.newRecord) {
												var nid = $scope.newRecord.replace(' ', '');
												nid = nid.toLowerCase();
												nr = {
														id: nid,
														name: angular.copy($scope.newRecord),
														isNew: true
												}
												$scope.list.push(nr);

												if ($scope.synched) {
														$scope.synched[nid] = []
												}

												$scope.newRecord = "";
										}


								}

								//remove record
								$scope.removeRecord = function(id, array) {
										array.splice(id, 1);
								}
						},
						link: function(scope, el, attr) {
								var _ = $(el);
								var instClk = true;
								//makes text editable
								_.on('dblclick', '.tx', function() {
										$(this).addClass('editing');
										$(this).attr('contenteditable', true);
										$(this).focus();
										instClk = false;
								})
								_.on('blur', '.tx', function() {
										$(this).removeClass('editing');
										$(this).removeAttr('contenteditable');
										var vl = $(this).text();
										scope.$apply(function() {

										})
								})

								scope.onblur = function($event) {
										var _ = $($event.target());
										_.removeClass('editing');
										_.removeAttr('contenteditable');
										var vl = _.text();

								}

								//slect item
								scope.select = function(item) {
										var ci = item;
										if (_.hasClass('can-select')) {
												if (true) {
														scope.selected = ci;
												}
										}
								}
						}
				}
		}

		//goNav
		function goNav() {
				return {
						link: function(scope, el) {
								$('.upload-btn', $(el)).on('change', function() {
										var src = $(this).attr('data-src');
										window.location = src;
								})
						}
				}
		}

		//positionArea - drag box
		function positionArea() {
				return {
						link: function(scope,$rootScope, el, $event) {
					  		$( ".when-drop-drap" ).draggable({ 
					  			handle: ".move-hand", 
					  			containment: "#main-content",
					  			start: function() {
 									$( ".when-drop-drap" ).addClass("active");
 									$( ".when-drop-drap" ).parent().addClass("active");
								},
					  			stop: function() {
				  					scope.testDrag=true;
				  					scope.showDragInfo = function(index,$event,rootItem,array) {
				  						if (scope.testDrag===true && array.length >0) {
				  							angular.element($event.currentTarget).find( ".when-drop-d" ).css("display","block");
				  							rootItem.arrayDrag = array.slice();
				  							scope.testDrag=false;
				  						}
				  					} 
				  					$( ".when-drop-drap" ).removeClass("active");
				  					$( ".when-drop-drap" ).parent().removeClass("active");
							      },
							      revert: true,
							      revertDuration: 20
					  		});
		  			  		// close box drag
		  			  		scope.closeDragBox = function(index,$event,rootItem) {
		  		  				angular.element($event.currentTarget).parent().css("display","none");
		  		  				rootItem.arrayDrag = [];
		  			  		}
		  			  		
						}
				}
		}

		//Input Only Number
		function validNumber() {
		    return {
		    require: '?ngModel',
		    link: function(scope, element, attrs, ngModelCtrl) {
		      if(!ngModelCtrl) {
		        return; 
		      }

		      ngModelCtrl.$parsers.push(function(val) {
		        if (angular.isUndefined(val)) {
		            var val = '';
		        }
		        
		        var clean = val.replace(/[^-0-9\.]/g, '');
		        var negativeCheck = clean.split('-');
		        var decimalCheck = clean.split('.');
		        if(!angular.isUndefined(negativeCheck[1])) {
		            negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
		            clean =negativeCheck[0] + '-' + negativeCheck[1];
		            if(negativeCheck[0].length > 0) {
		                clean =negativeCheck[0];
		            }
		            
		        }
		          
		        if(!angular.isUndefined(decimalCheck[1])) {
		            decimalCheck[1] = decimalCheck[1].slice(0,4);
		            clean =decimalCheck[0] + '.' + decimalCheck[1];
		        }

		        if (val !== clean) {
		          ngModelCtrl.$setViewValue(clean);
		          ngModelCtrl.$render();
		        }
		        return clean;
		      });

		      element.bind('keypress', function(event) {
		        if(event.keyCode === 32) {
		          event.preventDefault();
		        }
		      });
		    }
		  };
		};

		//notification
		function notification() {
				return function(scope, el) {
						var _ = $(el);
						//hide nfn panel
						$('.nfn-link', _).on('click', function(e) {
								e.stopPropagation();
								$(this).closest('.top-nav').toggleClass('nfn-open');
						})
						$('.nofication-panel', _).on('click', function(e) {
								e.stopPropagation();
						})
						$('body').on('click', function() {
								$('.nfn-open').removeClass('nfn-open');
						})
				}
		}
});
