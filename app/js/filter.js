/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application filters.
 *
 * @version 1.0
 * @author TCSASSEMBLER
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
    return function (input) {
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
        var hours = Math.floor(totalHours % 24)
        var ret = "";
        if (days) {
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