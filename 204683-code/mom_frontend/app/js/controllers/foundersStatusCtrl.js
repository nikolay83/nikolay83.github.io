/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Founder status controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("founderStatusCtrl",['$scope', 'UserService', 'BusinessService', function($scope, UserService, BusinessService){
        var criteria = {};
        criteria.role = 'BUSINESS_ADMIN';

        $scope.founderList = [];
        UserService.search(criteria).then(function(data) {
                for (var i=0; i<data.length; i++) {
                    for (var j=0; j<data[i].userRoles.length; j++) {
                        if (data[i].userRoles[j].role === 'BUSINESS_ADMIN') {
                            $scope.founderList.push({businessId: data[i].userRoles[j].businessId, founderId: data[i].id});

                            var criteria = {
                                userId : data[i].id,
                                sortBy : 'timestamp',
                                sortOrder : 'Descending'
                            };

                            UserService.getActionRecords(criteria).then(function (data) {
                                if (data && data.totalRecords > 0) {
                                    for (var i=0; i<data.items.length; i++) {
                                        for (var l=0; l<$scope.founderList.length; l++) {
                                            if (data.items[i].userId === $scope.founderList[l].founderId) {
                                                $scope.founderList[l].active = true;
                                            }
                                        }
                                    }
                                }
                            }, function (reason) {
                                console.log(reason);
                                alert(reason);
                            });


                            BusinessService.getBusiness(data[i].userRoles[j].businessId).then(function (result) {
                                    var tmp = {};
                                    for (var k=0; k<$scope.founderList.length; k++) {
                                        if (result.id === $scope.founderList[k].businessId) {
                                            tmp = $scope.founderList[k];
                                        }
                                    }

                                        tmp.name = result.name;
                                        tmp.step1st = true;
                                        if (result.creditCard) {
                                            tmp.step2nd = true;
                                        } else {
                                            tmp.step2nd = false;
                                        }
                                        tmp.step3rd = result.isVerified;
                                        tmp.picture = result.picture;

                            }, function (reason) {
                                    console.log(reason);
                                    alert(reason);
                                }
                            );
                        }
                    }
                }
            }, function (reason) {
                console.log(reason);
                alert(reason);
            }
        );

    }]);