/* Mapper Controllers */
(function() {
    'use strict';

    angular
        .module('app.admin')
        .controller('Mapper', Mapper);

    //Mapper
    function Mapper($scope, $filter, $location, dataSvc) {
        var vmMap = this;
        vmMap.dbMap = {};
        vmMap.fl = {
            name: true
        }
        vmMap.dropOpt = { hoverClass: "ui-state-hover"}
        vmMap.drop = {
            unit: {
                list1: [],
                list2: [],
                list3: [],
                list4: [],
                list5: []
            },
            fnArea: {
                list1: [],
                list2: [],
                list3: []
            },
            assessment: {
                list1: [],
                list2: []
            }
        }

        vmMap.drag = {
            unit: {
                list1: [],
                list2: [],
                list3: [],
                list4: [],
                list5: []
            },
            fnArea: {
                list1: [],
                list2: [],
                list3: []
            },
            assessment: {
                list1: [],
                list2: []
            }
        }

        vmMap.buDrop = {
            opts: {
                multiple: false
            }
        }
        vmMap.buDrag = {
            opts: {

            }
        }

        vmMap.syncOpts = {
            connectWith: '.mapping-section .connect-list',
            placeholder: "drop-area da-placeholder"
        }

        //get data
        var promise = dataSvc.query('app/data/db.mapping.json');
        promise.then(function(data) {
            vmMap.dbMap = data;
        });

        //remove
        vmMap.remove = function(idx, dataArray){
            var rec = dataArray[idx];
            angular.forEach(vmMap.dbMap.fileData,function(val,key){
                var r = vmMap.dbMap.fileData[key]
                if(!r.name){
                    vmMap.dbMap.fileData.splice(key,1);
                }
            })
            vmMap.dbMap.fileData.push(rec);
            dataArray.splice(idx,1);            
        }


    }


})()
