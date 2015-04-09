/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Mock controller
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//Shopping Cart Controller
angular.module("app")
.controller("shoppingCartCtrl",function($scope,DataService,$rootScope, $location, localStorageService){
    $rootScope.modal = false;
    //Get Shopping Cart
    var promise = DataService.query("cart");

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
                if(Number($scope.cartList[i].value.replace('$','')) <= $scope.cartList[i].available){
                    $scope.validate.push(false);
                    if(!isNaN(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100)){
                        $scope.price.push((Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)).toFixed(2));
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
            var role = localStorageService.get("role");
            console.log(role);
            if(!role){
                $rootScope.modal = $scope.unLoginModal = true;
            }else{
                $location.path("/Payment");
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