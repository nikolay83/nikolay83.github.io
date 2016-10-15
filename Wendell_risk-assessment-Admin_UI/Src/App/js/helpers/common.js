/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * The service helper
 *
 * @author veshu
 * @version 1.0
 */
(function () {
    'use strict';

    angular
        .module("app")
        .factory('common', ['$http', '$q', '$log', 'storage', 'config', 'util', '$injector', 'FileSaver', 'Blob',
            function ($http, $q, $log, storage, config, util, $injector, FileSaver, Blob) {

                var common = {};

                /**
                 * Creates http requests
                 * @param {Object} options the http request options
                 * @returns {Object} the http request options
                 * @private
                 */
                function _createRequestOption(options) {
                    var accessToken = storage.getSessionToken();
                    if (!options.headers) {
                        options.headers = {};
                    }
                    if (!accessToken) {
                        $injector.get('util').logout();
                    }
                    if (accessToken && !options.headers.Authorization) {
                        options.headers.Authorization = 'Bearer ' + accessToken.tokenValue;
                    }
                    if (options.url.indexOf("http") !== 0) {
                        options.url = config.REST_SERVICE_BASE_URL + options.url;
                    }
                    options.cache = false;
                    return options;
                }

                /**
                 * Make an HTTP request and add access token
                 * @param {Object} options the options for $http call
                 * @returns {promise} the promise with result
                 */
                common.makeRequest = function (options) {
                    var deferred = $q.defer();

                    $http(_createRequestOption(options))
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(data || "An error occurred while processing your request");
                        });
                    return deferred.promise;
                };

                /**
                 * Make an HTTP request to export files
                 * @param {Object} options the options for $http call
                 * @returns {promise} the promise with result
                 */
                common.export = function (options) {
                    options.responseType = 'arraybuffer';
                    $http(_createRequestOption(options))
                        .success(function (data, status, headers) {
                            var header = headers();
                            var contentType = header['content-type'];
                            if (!contentType) {
                                contentType = "application/octet-stream";
                            }
                            var fileName = header['content-disposition'];
                            if (fileName.indexOf('filename=') > 0) {
                                fileName = fileName.split("filename=")[1];
                            } else {
                                fileName = fileName.split("filename=");
                            }
                            var content = new Blob([data], {type: contentType});
                            FileSaver.saveAs(content, fileName);
                        })
                        .error(function () {
                            alert("An error occurred while downloading the file.");
                        });
                };
                return common;
            }]);
})();