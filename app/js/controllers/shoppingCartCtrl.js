/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Shopping cart controller.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
angular.module("app")
    .controller("shoppingCartCtrl", ['$scope', 'storage', '$rootScope', '$location', function($scope, storage, $rootScope, $location){

        $scope.cartList = storage.getItemFromCart();
        $scope.price = [];
        $scope.total = 0;
        $scope.validate = [];
        for(var i=0;i<$scope.cartList.length;i++){
            $scope.cartList[i].value = '0';
            $scope.price.push(0);
            $scope.total += 0;
        }
        /**
         * Refresh the page.
         */
        $scope.reflash = function(){
            $scope.total = 0;
            $scope.price = [];
            $scope.validate = [];
            for(var i=0;i<$scope.cartList.length;i++){
                //Validate
                if(Number($scope.cartList[i].value) > 0 && (Number($scope.cartList[i].value) <= $scope.cartList[i].availableQuantity)){
                    $scope.validate.push(false);
                    if(!isNaN(Math.round(Number($scope.cartList[i].value) * (1 - $scope.cartList[i].discount/100)))){
                        $scope.price.push((Number($scope.cartList[i].value) * (1 - $scope.cartList[i].discount/100)).toFixed(2));
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
        };
        /**
         * Go to the payment page.
         */
        $scope.pay = function(){
            var flag = true;
            for (var i=0; i<$scope.validate.length; i++) {
                if ($scope.validate[i] === true) {
                    flag = false;
                    break;
                }
            }
            if (flag === false || $scope.total === 0) {
                return;
            }
            var profile = storage.getCurrentUserProfile("role");
            if(!profile){
                $rootScope.modal = $scope.unLoginModal = true;
            }else{
                $rootScope.prices = $scope.price;
                $location.path("/Payment/shoppingcart");
            }
        };
        /**
         * Close the modal.
         */
        $scope.cancel = function(){
            $rootScope.modal = $scope.unLoginModal = false;
        };
        /**
         * Delete the item.
         * @param id the item id.
         */
        $scope.delete = function(id){
            storage.removeItemFromCart(id);
            $scope.cartList = storage.getItemFromCart();
            $scope.reflash();
        };
        /**
         * Close the modal.
         */
        $scope.closeModal = function(){
            $rootScope.modal = $scope.unLoginModal = false;
        };
    }]);