/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
'use strict';

/**
 * This module contains helper functions.
 *
 * @author TCSASSEMBLER
 * @version 1.0
 */

// var GIFT_CARD_STATUS = {
//     ACTIVE: 'ACTIVE',
//     FOR_RESALE: 'FOR_RESALE',
//     INACTIVE: 'INACTIVE'
// };

// Global variable to store user coordinate for each request
// It shouldn't be implemented in that way!
var userCoordinates = null;
var isGiftCardFlag = true;

var GiftCard = require('../models').GiftCard;
var GiftCardOffer = require('../models').GiftCardOffer;
var Business = require("../models").Business;
var async = require('async');
var winston = require('winston');

var helper = {};

helper.sortOrders = {
    asc: 'asc',
    desc: 'desc'
};

helper.giftCardStatus = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE',
    FOR_RESALE: 'FOR_RESALE'
};

helper.giftCardOfferStatus = {
    DRAFT: 'DRAFT'
};

helper.userRoles = {
    BUSINESS_ADMIN: 'BUSINESS_ADMIN',
    INDIVIDUAL_USER: 'INDIVIDUAL_USER',
    BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE'
};

helper.getOrder = function(order) {
    return order === 'Ascending' ? 1 : -1;
};


helper.validatePageSize = function(pageSize, error) {
    pageSize = parseInt(pageSize);
    if (isNaN(pageSize) || pageSize < 1) {
        error.Err = new Error('pageSize should be positive integer.');
        return false;
    }

    return true;
};


helper.validatePageNumber = function(pageNumber, error) {
    pageNumber = parseInt(pageNumber);
    if (isNaN(pageNumber) || pageNumber < 0) {
        error.Err = new Error('pageNumber should be non-negative integer.');
        return false;
    }

    return true;
};


helper.validateOrderBy = function(orderBy, error) {
    var allowed = ['id', 'name', 'address', 'telephoneNumber', 'businessHours',
        'website', 'isVerified', 'isSubscriptionExpired', 'braintreeAccountId',
        'notificationDate'];

    if (allowed.indexOf(orderBy) === -1) {
        error.Err = new Error('sortBy should be in: [' + allowed.join(', ') + ']');
        return false;
    }

    return true;
};


helper.validateOrder = function(order, error) {
    var allowed = ['Ascending', 'Descending'];
    if (allowed.indexOf(order) === -1) {
        error.Err = new Error('sortOrder should be in: [' + allowed.join(', ') + ']');
        return false;
    }

    return true;
};

helper.validateDate = function(date, error) {
    if (date === undefined) {
        return true;
    }

    var dateFormat = /(\d{4})-(\d{1,2})-(\d{1,2})/;
    if (dateFormat.exec(date)) {
        var d1 = new Date(date);

        if (d1.toString() !== 'Invalid Date') {
            return true;
        }
    }

    error.Err = new Error('Date format should be like: YYYY-MM-DD');
    return false;
};

helper.validateDateOrder = function(date1, date2, error) {
    if (date1 === undefined || date2 === undefined ) {
        return true;
    }

    var d1 = new Date(date1);
    var d2 = new Date(date2);

    if(d1 <= d2){
        return true;
    }

    error.Err = new Error('StartDate should be before EndDate');
    return false;
};


// helper.validateStatus = function(statuses, error) {
//     if (statuses === undefined) {
//         return true;
//     }

//     var items = statuses.split(",");

//     for (var i = 0; i < items.length; i++) {
//         if (!GIFT_CARD_STATUS[helper.trim(items[i])]) {
//             error.Err = new Error("Status must be in [ACTIVE, FOR_RESALE, INACTIVE], and array format should be xxx,xxx,xxx");
//             return false;
//         }
//     }

//     return true;
// };


helper.trim = function(str) {
    return String(str).replace(/^\s+|\s+$/g, '');
};


// helper.validateFloatRangeNumber = function(rangeNumbers, error) {
//     if (rangeNumbers === undefined) {
//         return true;
//     }

//     var nums = rangeNumbers.split(",");
//     if (nums.length !== 2) {
//         error.Err = new Error("Coordinates number format should be like: xxx,xxx");
//         return false;
//     }

//     var num1 = parseFloat(nums[0]);
//     var num2 = parseFloat(nums[1]);

//     if (isNaN(num1) || isNaN(num2)) {
//         error.Err = new Error("Coordinates number should be valid float.");
//         return false;
//     }

//     return true;
// };

helper.validateBoolean = function(boolValue, error) {
    if (boolValue === undefined) {
        return true;
    }

    var allowed = ['true', 'false'];
    if (allowed.indexOf(helper.trim(boolValue).toLowerCase()) === -1) {
        error.Err = new Error('Boolean value should be in: [' + allowed.join(', ') + ']');
        return false;
    }

    return true;
};


// helper.validateIntRangeNumber = function(rangeNumbers, error) {
//     if (rangeNumbers === undefined) {
//         return true;
//     }

//     var nums = rangeNumbers.split(",");
//     if (nums.length !== 2) {
//         error.Err = new Error("Range number format should be like: xxx,xxx");
//         return false;
//     }

//     var num1 = parseInt(nums[0]);
//     var num2 = parseInt(nums[1]);

//     if (isNaN(num1) || isNaN(num2)) {
//         error.Err = new Error("Range number should be valid int.");
//         return false;
//     }

//     return true;
// };


// helper.validateRangeDate = function(rangeDates, error) {
//     if (rangeDates === undefined) {
//         return true;
//     }

//     error.Err = new Error("Range date format should be like: YYYY-MM-DD,YYYY-MM-DD");

//     var dates = rangeDates.split(",");
//     if (dates.length !== 2) {
//         return false;
//     }

//     var dateFormat = /(\d{4})-(\d{1,2})-(\d{1,2})/;
//     if (dateFormat.exec(dates[0]) && dateFormat.exec(dates[1])) {
//         var d1 = new Date(dates[0]);
//         var d2 = new Date(dates[1]);

//         console.log(d1, d2);
//         if (d1.toString() !== 'Invalid Date' && d2.toString() !== 'Invalid Date') {
//             return true;
//         }
//     }

//     return false;
// };


helper.validateRequiredParameter = function(paramValue, paramName, error) {
    if (!paramValue) {
        error.Err = new Error('Required query parameter \'' + paramName + '\' is missing.');
        return false;
    }

    return true;
};

helper.validateRequiredIntParameter = function(paramValue, paramName, error) {
    if (!helper.validateRequiredParameter(paramValue, paramName, error)) {
        return false;
    }

    if (isNaN(parseInt(paramValue))) {
        error.Err = new Error(paramName + ' should be an Integer but \'' + paramValue + '\' was provided.');
        return false;
    }

    return true;
};


helper.validateRequiredArrayFloatParameter = function(paramValue, paramName, error) {
    if (paramValue === undefined) {
        return true;
    }

    if(!Array.isArray(paramValue)){
        error.Err = new Error(paramName + ' should be an Array with float element, like: [xxx,xxx].');
        return false;
    }

    if(paramValue.length !== 2){
        error.Err = new Error(paramName + ' should be an Array with float element, like: [xxx,xxx].');
        return false;
    }

    if (isNaN(parseFloat(paramValue[0]))) {
        error.Err = new Error(paramName + ' should be an Float but \'' + paramValue[0] + '\' was provided.');
        return false;
    }

    if (isNaN(parseFloat(paramValue[1]))) {
        error.Err = new Error(paramName + ' should be an Float but \'' + paramValue[1] + '\' was provided.');
        return false;
    }

    return true;
};


// helper.validateRequiredStatusParameter = function(paramValue, paramName, error) {
//     if (!helper.validateRequiredParameter(paramValue, paramName, error)) {
//         return false;
//     }

//     if (!GIFT_CARD_STATUS[helper.trim(paramValue)]) {
//         error.Err = new Error(paramName + " must be in [ACTIVE, FOR_RESALE, INACTIVE]");
//         return false;
//     }

//     return true;
// };



helper.validateIntRangeNumber = function(rangeNumbers, error) {
    if (rangeNumbers === undefined) {
        return true;
    }

    var nums = rangeNumbers.split(",");
    if (nums.length !== 2) {
        error.Err = new Error("Range number format should be like: xxx,xxx");
        return false;
    }

    var num1 = parseInt(nums[0]);
    var num2 = parseInt(nums[1]);

    if (isNaN(num1) || isNaN(num2)) {
        error.Err = new Error("Range number should be valid int.");
        return false;
    }

    return true;
};

helper.validateGiftCardOfferStatus = function(statuses, error) {
    if (statuses === undefined) {
        return true;
    }

    var items = statuses.split(",");

    for (var i = 0; i < items.length; i++) {
        if (!GIFT_CARD_OFFER_STATUS[helper.trim(items[i])]) {
            error.Err = new Error("Status must be in [CANCELLED, DRAFT, ACTIVE, ENDED], and array format should be xxx,xxx,xxx");
            return false;
        }
    }

    return true;
};


helper.validateFloatRangeNumber = function(rangeNumbers, error) {
    if (rangeNumbers === undefined) {
        return true;
    }

    var nums = rangeNumbers.split(",");
    if (nums.length !== 2) {
        error.Err = new Error("Range number format should be like: xxx,xxx");
        return false;
    }

    var num1 = parseFloat(nums[0]);
    var num2 = parseFloat(nums[1]);

    if (isNaN(num1) || isNaN(num2)) {
        error.Err = new Error("Range number should be valid float.");
        return false;
    }

    return true;
};


helper.validateRangeDate = function(rangeDates, error) {
    if (rangeDates === undefined) {
        return true;
    }

    error.Err = new Error("Range date format should be like: YYYY-MM-DD,YYYY-MM-DD");

    var dates = rangeDates.split(",");
    if (dates.length !== 2) {
        return false;
    }

    var dateFormat = /(\d{4})-(\d{1,2})-(\d{1,2})/;
    if (dateFormat.exec(dates[0]) && dateFormat.exec(dates[1])) {
        var d1 = new Date(dates[0]);
        var d2 = new Date(dates[1]);

        if (d1.toString() !== 'Invalid Date' && d2.toString() !== 'Invalid Date') {
            if (d1 <= d2) {
                return true;
            }

            error.Err = new Error("StartDate should be before EndDate");
            return false;
        }
    }

    return false;
};


/**
 * Helper function to get the business coordinates for fiven business entity
 *
 * @param  {Object}     business      business entity
 * @param  {Function}   callback      callback function<error, result>
 */
function _getBusinessCoordinates (business, callback) {
    // if business coordinate doesn't exist
    if (business.coordinates.length < 1) {
        business.coordinates = helper.getCoordinateByAddress(business.businessAddress, function(err, coordinates) {
            var updated = _.extend(business, {
                coordinates: coordinates
            });
            callback(null, updated.toJSON());
        });
    } else {
        // business is already having coordinates
        callback(null, business);
    }
}


/**
 * Helper function to calculate the distance between business coordinates and user coordinates
 *
 * @param  {Object}     business      business entity
 * @param  {Function}   callback      callback function<error, result>
 */
function _calculateDistance (business, callback) {
    winston.info('Calculating distance POINT 1 ' + JSON.stringify(business.coordinates));
    winston.info('Calculating distance POINT 2 ' + JSON.stringify(userCoordinates));
    var lat1 = userCoordinates[0],
        lon1 = userCoordinates[1],
        lat2 = business.coordinates[0],
        lon2 = business.coordinates[1];
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    // calculate distance in meters ( to minimize decimal)
    dist = dist * 1.609344 * 1000;
    winston.info('Computed distance ' + dist);
    if (isGiftCardFlag) {
        GiftCard.findOne({
            businessId: business._id
        }, function(err, card) {
            var result = card.toJSON();
            // adding this distance parameter only for demo purpose to show that the results are actually sorted from nearest to farthest
            result.distance = dist;
            callback(err, result);
        });
    } else {
        GiftCardOffer.findOne({
            businessId: business._id
        }, function(err, offer) {
            var result = offer.toJSON();
            // adding this distance parameter only for demo purpose to show that the results are actually sorted from nearest to farthest
            result.distance = dist;
            callback(err, result);
        });

    }
}

/**
 * Helper function to calculate the distance between business coordinates and user coordinates
 *
 * @param  {Boolean}    isGiftCard    whether called by GiftCardService or GiftCardOfferService
 * @param  {Object}     coordinates   criteria's coordinates
 * @param  {Object}     items         cards to sort
 * @param  {Number}     pageSize      page size
 * @param  {Number}     pageNumber    page number
 * @param  {Function}   callback      callback function<error, result>
 */
helper._sortByCoordinates = function(isGiftCard, coordinates, items, pageSize, pageNumber, callback) {


    isGiftCardFlag = isGiftCard;
    userCoordinates = coordinates;

    async.waterfall([
        function(cb) {
            // get businesses
            var businessIds = _.pluck(items, 'businessId');
            // async.map(businessIds, BusinessService.get, cb);
            // BusinessService.getByIds(businessIds, cb);
            Business.find({
                _id: {
                    "$in": businessIds
                }
            }).exec(cb);
        },
        function(businesses, cb) {
            // get businesses coordinates
            async.map(businesses, _getBusinessCoordinates, cb);
        },
        function(updatedBusinesses, cb) {
            // get the distance between user coordinates and businesses coordinates
            async.map(updatedBusinesses, _calculateDistance, cb);
        },
        function(cards, cb) {
            // sort the gift offers
            var sortedCards = _.sortBy(cards, function(card) {
                return card.distance;
            });

            var adjustItems = _.map(sortedCards, function(item) {
                delete item.distance;
                return item;
            });

            if (0 === pageNumber) {
                cb(null, {
                    totalPages: 1,
                    pageNumber: 0,
                    totalRecords: adjustItems.length,
                    items: adjustItems
                });
            } else {
                var count = adjustItems.length;

                var start = pageSize * (pageNumber - 1);
                var resultItems;
                if (start + pageSize >= count) {
                    resultItems = adjustItems.slice(start);
                } else {
                    resultItems = adjustItems.slice(start, start + pageSize);
                }


                cb(null, {
                    totalPages: parseInt(count / pageSize) + (count % pageSize !== 0 ? 1 : 0),
                    pageNumber: pageNumber,
                    totalRecords: count,
                    items: resultItems
                });
            }

        }
    ], callback);
};

module.exports = helper;
