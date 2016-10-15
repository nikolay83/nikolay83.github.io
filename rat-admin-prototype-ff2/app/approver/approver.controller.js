/* Controllers */
(function() {
    'use strict';

    angular
        .module('app.approver')
        .controller('Approver', Approver);

    //Approver
    function Approver($scope, $filter, $location, dataSvc) {
        var vm = this;
        $scope.dbm = {};

        //get data
        var promise = dataSvc.query('app/data/db.approver.json');
        promise.then(function(data) {
            $scope.dbm = data;
        });

        
    }

})();
