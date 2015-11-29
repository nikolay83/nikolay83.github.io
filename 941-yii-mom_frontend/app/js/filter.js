/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application filters.
 *
 * @version 1.2
 * @author TCSASSEMBLER
 *
 * Changes in version 1.1
 * - Add format to timeRemaining
 *
 * Changes in version 1.2 (Project Mom and Pop - MiscUpdate5):
 * - Add multiline filter
 */
'use strict';

var app = angular.module("app");

//Force Number
app.filter('num', function () {
    return function (input) {
        return Number(input.replace('$', ''));
    }
});

//Force Percent
app.filter('percentage', function () {
    return function (input) {
        if (input < 0 || input > 100 || isNaN(input) || input === '') {
            return '0';
        } else {
            return input;
        }
    }
});

//Validate Date
app.filter('endDate', function () {
    return function (input) {
        if (Date.parse(input)) {
            return input;
        } else {
            return "No expiration date";
        }
    }
});

//format remaining time in format XX days YYh
app.filter('timeRemaining', function () {
    return function (input, format) {
        if (!input) {
            return "-";
        }
        var diff = new Date(input).getTime() - new Date().getTime();
        if (diff <= 0) {
            return "Expired"
        }
        var totalMinutes = diff / 1000 / 60;
        if (totalMinutes < 60) {
            if (totalMinutes < 1) {
                return "< 1 min";
            }
            return Math.floor(totalMinutes) + " min";
        }
        var totalHours = totalMinutes / 60;
        var days = Math.floor(totalHours / 24);
        var hours = Math.floor(totalHours % 24);
        var ret = "";
        if (days) {
            if(days <= 1) {
                return "today"
            } else if(days > 1 && days <= 2) {
                return "tomorrow";
            } else if(format === 'short') {
                return "in " + days + " days";
            }
            ret = days + " day";
            if (days > 1) {
                ret += "s";
            }
            ret += " ";
        }
        if (hours) {
            ret += hours + "h";
        }
        return ret;
    }
});

// Transforms a string and replaces LF (\n) characters with <br/>
app.filter('multiline', ['$sce', function ($sce) {
    return function(input) {
	if (input) {
	    return $sce.trustAsHtml(input.replace('\n', '<br/>\n'));
	} else {
	    return input;
	}
    };
}]);

// limit pagination
app.filter('limitPart', function () {
    return function(input, limit, begin) {
        if (Math.abs(Number(limit)) === Infinity) {
            limit = Number(limit);
        } else {
            limit = parseInt(limit,10);
        }
        if (isNaN(limit)) return input;

        if (angular.isNumber(input)) input = input.toString();
        if (!angular.isArray(input) && !angular.isString(input)) return input;

        begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin,10);
        begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

        if (limit >= 0) {
            return input.slice(begin, begin + limit);
        } else {
            if (begin === 0) {
                return input.slice(limit, input.length);
            } else {
                return input.slice(Math.max(0, begin + limit), begin);
            }
        }
    };
});

// cut string
app.filter('cutString',["$filter", function ($filter) {
    return function(input, limit, symbol) {
        if(input.length > limit){
            return ""+$filter('limitTo')(input, limit)+symbol;
        }else{
            return input;
        }
    };
}]);
