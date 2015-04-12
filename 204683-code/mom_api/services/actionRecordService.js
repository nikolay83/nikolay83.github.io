/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service provides methods to manage Action Record.
 *
 * Changes in version 1.1:
 *  - Added log for search() method.
 *
 * @version 1.1
 * @author TCSASSEMBLER
 */
'use strict';

var config = require('config'),
    helper = require('../helpers/helper'),
    _ = require('lodash'),
    async = require('async');
var logger = require('../logger').getLogger();
var ActionRecordSchema = require('../models/ActionRecord').ActionRecordSchema,
  db = require('../datasource').getDb(config.MONGODB_URL),
  ActionRecord = db.model('ActionRecord', ActionRecordSchema);

var ActionRecordService = {
    /**
     * Create action record.
     * @param actionRecord {ActionRecord} the action record
     * @param callback {Function<error:Error, result:ActionRecord>} the callback function
     */
    create: function(actionRecord, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(actionRecord, 'actionRecord', error) ||
            !helper.validateRequiredParameter(actionRecord.userId, 'actionRecord.userId', error) ||
            !helper.validateRequiredParameter(actionRecord.timestamp, 'actionRecord.timestamp', error) ||
            !helper.validateRequiredIntParameter(actionRecord.type, 'actionRecord.type', error) ||
            !helper.validateRequiredParameter(actionRecord.details, 'giftCard.details', error)) {
            callback(error.Err);
        } else {
            ActionRecord.create(actionRecord, callback);

        }
    },

    /**
     * Search action record with criteria.
     * @param criteria {Object} the criteria
     * ==== The criteria parameters ===
     * pageSize        {Integer} The page size.
     * pageNumber      {Integer} The page number.
     * sortBy          {String}  The name of the property that will be used to sort the results, default to "id".
     * sortOrder       {String}  The sorting order. Must be one of "Ascending", "Descending", default to "Ascending".
     * type            {String}  This is used to partial match action type.
     * userId          {String}  This is used to partial match user id.
     * startDate       {Date}    This is used to filter for start time
     * endDate         {Date}    This is used to filter for end time
     * ===============================
     * @param callback {Function<error:Error, result:SearchResult<ActionRecord>>} the callback function
     */
    search: function(criteria, callback) {
        var pageSize = criteria.pageSize || config.DEFAULT_PAGE_SIZE;
        var pageNumber = criteria.pageNumber || 1;
        var orderBy = criteria.sortBy || config.DEFAULT_SORT_BY;
        var order = criteria.sortOrder || config.DEFAULT_SORT_ORDER;

        var error = {};
        if (!helper.validatePageSize(pageSize, error) ||
            !helper.validatePageNumber(pageNumber, error) ||
            !helper.validateOrderBy(orderBy, error) ||
            !helper.validateOrder(order, error) ||
            !helper.validateDate(criteria.startDate, error) ||
            !helper.validateDate(criteria.endDate, error) ||
            !helper.validateDateOrder(criteria.startDate, criteria.endDate, error)) {
            callback(error.Err);
        } else {
            var filter = {};

            if (criteria.userId) {
                filter.userId = {
                    '$regex': criteria.userId
                };
            }

            if (criteria.actionType) {
                filter.actionType = {
                    '$regex': criteria.actionType
                };
            }

            if (criteria.startDate) {
                filter.timestamp = {
                    '$gte': new Date(criteria.startDate)
                };
            }

            if (criteria.endDate) {
                if (!filter.timestamp) {
                    filter.timestamp = {};
                }
                filter.timestamp = {
                    '$lte': new Date(criteria.endDate + ' 23:59:59.999')
                };
            }

            if (orderBy === 'id') {
                orderBy = '_id';
            }
            var sortBy = {};
            sortBy[orderBy] = helper.getOrder(order);

            async.waterfall([
                function(cb) {
                    if (0 === parseInt(pageNumber)) {
                        ActionRecord.find(filter).sort(sortBy).exec(function(err, items) {
                            if (err) {
                                cb(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: 1,
                                    pageNumber: 0,
                                    totalRecords: resultItems.length,
                                    items: resultItems
                                };
                                cb(null, result);
                            }
                        });
                    } else {
                        ActionRecord.paginate(filter, pageNumber, pageSize, function(err, pageCount, items, itemCount) {
                            if (err) {
                                cb(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: pageCount,
                                    pageNumber: parseInt(pageNumber),
                                    totalRecords: itemCount,
                                    items: resultItems
                                };
                                cb(null, result);
                            }
                        }, {
                            sortBy: sortBy
                        });

                    }

                }
            ], function(err, result) {
                if (err) {
                    logger.error('Error to get ActionRecords ' + err);
                }
                callback(err, result);
            });
        }
    }

};


module.exports = ActionRecordService;
