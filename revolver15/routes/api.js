/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 */

var exec = require('child_process').exec; 
 
/**
 * This supplies route to local rest api.
 *
 * @version 1.0
 * @author dombits
 */

var xpath = require('xpath')
    , dom = require('xmldom').DOMParser
var http = require('http');

"use strict";

/**
 * Creates a route to execute a batch file, it also sets up socket.io to listen to the default namespace.
 * @param io the socket.io reference
 * @returns {*} the express route for executing batch files
 */
module.exports = function(router) {

  // create a router for expressJS

	function performRequest(endpoint, cb) {
		http.get(endpoint, function(res){
		var str = '';
		res.on('data', function (chunk) {
			 str += chunk;
		 });
		res.on('end', function () {
			return cb(null, str);
		});

	 }).on('error', function(e) {
		console.error(e);
		cb(e, '');
	});
	}
	
  /**
   * ExpressJS controller method for api categories endpoint.
   */
   
  router.get('/rest/channel/getChannels', function(req, res, nxt) {
	
	var host = 'http://udbunu.g.comcast.net/GetFolderContents/comcast.comMENU0000000000001829?mac=0000001E4F26';
	
	var data = performRequest(host, function (error, xml) {	
	
		var error;
		if(error) {
			res.send('error');
		}else {
			var doc = new dom().parseFromString(xml);
			var root = xpath.select("//FolderContents", doc);
			var nodes = xpath.select("//FolderContents//ChildFolder", doc);
			var cat = '';
			var catId = '' ; //xpath.select("text()", node[0]).toString()
			var node =  {};
			var items = [];
			for (var j in nodes) {
				
				cat = xpath.select1("@displayName", nodes[j]).value;
				catId = xpath.select1("@assetID", nodes[j]).value;
				node.id = catId;
				node.text = cat;
				items.push({ "id": catId, "text": cat });
			}
			res.send( items );
		}
	});
	
  });
  
    /**
   * ExpressJS controller method for api categories submit.
   */
   
	return router;
}
