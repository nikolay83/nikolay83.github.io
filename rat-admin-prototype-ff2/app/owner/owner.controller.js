/* Controllers */
(function() {
    'use strict';

    angular
        .module('app.owner')
        .controller('Owner', Owner);

    //Owner
    function Owner($scope, $filter, $location, dataSvc) {
        var vm = this;
        $scope.dbm = {};

        //get data
        var promise = dataSvc.query('app/data/db.owner.json');
        promise.then(function(data) {
            $scope.dbm = data;
        });

        
    }

})();
