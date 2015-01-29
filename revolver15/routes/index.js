/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 */

/**
 * This supplies route to batch file execution.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var config = require('../config');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var moment = require('moment');

var timeLog = {
	meta: { start:"0", end:"0", timeTaken:'0' },
	video: { start:"0", end:"0", timeTaken:'0' },
	manz: { start:"0", end:"0", timeTaken:'0' },
	munx: { start:"0", end:"0", timeTaken:'0'}
};

/**
 * Creates a route to execute a batch file, it also sets up socket.io to listen to the default namespace.
 * @param io the socket.io reference
 * @returns {*} the express route for executing batch files
 */
module.exports = function(io, checkAuth) {


  // create a router for expressJS
  var router = express.Router();

  require('./api.js')(router);
  
  // whenever a socket.io connection sends a tail event, we send that user to their own 'room'.
  io.on('connection', function (socket) {
    socket.on('tail', function(room) {
      socket.join(room);
    });
	socket.on('forceDisconnect', function(){
		socket.disconnect();
	});
  });

  /**
   * Sends the data from the process stream to the socket.io clients.
   *
   * @param src the source stream, also used as the event name e.g. stderr, stdout
   * @param uuid the client identifier, to ensure only that client can view this process
   * @param processId the process identifier, to distinguish concurrent processes
   * @param content the data content from the process stream
   */
  function stream(src, uuid, processId, content) {
	  // send to connected clients
	//var date =new Date();
	var date = moment().toISOString();
	var data = {pid: processId, time: date, text: content.toString()};
    io.to(uuid).emit(src, data);
	return data.time;
  }
  
  function calcTimeTaken(startTime, endTime){	
		var start = moment(startTime);
		var end = moment(endTime);
		var hours = end.diff(start, 'hours');
		var minutes = end.diff(start, 'minutes');
		var seconds = end.diff(start, 'seconds');

		var  timetaken = '';
		timetaken = (hours > 0) ? hours + ' hours, ' : ''; 
		timetaken += (minutes > 0) ? (minutes - (hours * 60)) + ' mins, ' : ''; 
		timetaken += (seconds > 0) ? (seconds - (minutes * 60)) + ' secs ' : ''; 
		return timetaken;
	}
	
  /**
   * ExpressJS controller method for starting a batch application.
   *
   * The following parameters are required:
   * a) command - the name of the batch file to be executed
   *
   * if command arguments are provided, they should be sent as a comma separated list of strings
   */
   
  router.get('/exec', function(req, res, next) {
    if (!_.isString(req.query.command)) {
      return next(new Error('command must be a string.'));
    }

    if (!_.isString(req.query.args)) {
      return next(new Error('args is required.'));
    }

    // setup the execution context
    var program = {
      "command" :  config.BASE_PATH + "/" + req.query.command,
      "arguments" : req.query.args || ''
    };
    // ensure the batch file exists
    if (!fs.existsSync(program.command)) {
      return next(new Error('file does not exist.'));
    }

    var callArgs = program.arguments.split(',');
    /*
	var genre = callArgs[0];
	var currentIndex = config.CATEGORIES.indexOf(genre);
    if (currentIndex == -1) {
      return next(new Error('Unsupported genre: ' + genre));
    }
    var previousIndex = currentIndex === 0 ? config.CATEGORIES.length - 1 : currentIndex - 1;
    var nextIndex = currentIndex === config.CATEGORIES.length - 1 ? 0 : currentIndex + 1;
	*/
	var currentStep = 0;
	
	function checkStep(time, text){
		var timeTaken = 0;
		var data;
		switch(true) {
		case (text.indexOf("Getting Metadata") > -1):
			currentStep = 1;
			// store step begin time
			timeLog.meta.start = time;
			break;
		case (text.indexOf("Generating videos") > -1):
			currentStep = 2;
			timeLog.meta.end = time;
			timeLog.video.start = time;
			timeTaken = calcTimeTaken(timeLog.meta.start, time);
			data = {currentStep: currentStep - 1, timeTaken: timeTaken};
			io.to(uuid).emit('step', data);
			break;
		case (text.indexOf("Calling Manzanita") > -1):
			currentStep = 3;
			timeLog.video.end = time;
			timeLog.manz.start = time;
			timeTaken = calcTimeTaken(timeLog.video.start, time);
			data = {currentStep: currentStep - 1, timeTaken: timeTaken};
			io.to(uuid).emit('step', data);
			break;
		case (text.indexOf("Building EBIF") > -1):
			currentStep = 4;
			timeLog.manz.end = time;
			timeLog.munx.start = time;
			timeTaken = calcTimeTaken(timeLog.manz.start, time);
			data = {currentStep: currentStep - 1, timeTaken: timeTaken};
			io.to(uuid).emit('step', data);
			break;
		case (text.indexOf("Exporting output") > -1):
			currentStep = 5;
			timeLog.munx.end = time;
			timeTaken = calcTimeTaken(timeLog.munx.start, time);
			data = {currentStep: currentStep - 1, timeTaken: timeTaken};
			io.to(uuid).emit('step', data);
			break;
		}
		return timeTaken;
	}
	
	var uuid = req.query.clientId || uuidlib.v4();
	
      if (!fs.existsSync(__dirname + '/../public/logs')) {
        fs.mkdirSync(__dirname + '/../public/logs');
      }
	  
	  function doLog(data) {
		switch(true) {
			case (currentStep == 1):
				batchMetaLog.write(data );
				break;
			case (currentStep == 2):
				batchMetaLog.end();
				batchVideoLog.write(data );
				break;
			case (currentStep == 3):
				batchVideoLog.end();
				batchManzaLog.write(data );
				break;
			case (currentStep == 4):
				batchManzaLog.end();
				batchMunxLog.write(data );
				break;
			}
		}
		
    try {
      // spawn the process, we pass the current, previous and next genres
	  var batch = spawn(program.command, [
      //  config.CATEGORIES[currentIndex],
      //  config.CATEGORIES[previousIndex],
      //  config.CATEGORIES[nextIndex]
      ]);

      // setup the stream so they are sent to socket.io
      var processId = batch.pid;
     
      var exited = false;
	
      var batchMetaLog = fs.createWriteStream(__dirname + '/../public/logs/' + uuid + '_meta.txt', {'flags': 'a'});
	  var batchVideoLog = fs.createWriteStream(__dirname + '/../public/logs/' + uuid + '_video.txt', {'flags': 'a'});
	  var batchManzaLog = fs.createWriteStream(__dirname + '/../public/logs/' + uuid + '_manz.txt', {'flags': 'a'});
	  var batchMunxLog = fs.createWriteStream(__dirname + '/../public/logs/' + uuid + '_munx.txt', {'flags': 'a'});

      // complete the request (streams are sent through other requests)
      res.status(200).json({success : true, uuid: uuid, pid : processId});

		var time, timeTaken;
      // pipe the output to the socket io module
      batch.on('error', function(err) {
        stream('stderr', uuid, processId, JSON.stringify(err));
		doLog(data);
      });
      batch.stdout.on('data', function (data) {
		time = stream('stdout', uuid, processId, data);
		if(data.length > 10 && data != null ){
			checkStep(time, data.toString());
		}
		doLog("[# " + time + " ] " + data);
		console.log("[# " + time + " ] " + data);
      });
      batch.stderr.on('data', function (data) {
		time = stream('stderr', uuid, processId, data);
		doLog(data);
      });

      // send process end information
      batch.on('close', function (code, signal) {
        exited = true;
        if (code != null) {
          if (code !== 0) {
            stream('stdout', uuid, processId, 'PROGRESSERROR: Program exited with code: ' + code);
          } else {
            stream('stdout', uuid, processId, 'Program exited with code: ' + code);
          }
        }
        if (signal) {
          stream('stdout', uuid, processId, 'PROGRESSERROR: Program exited abnormally with signal: ' + signal);
		   console.log('stdout: PROGRESSERROR: Program exited abnormally with signal: ' + signal);
        }

        batchMunxLog.end();
      });

      // if a timeout is configured, kill the process when elapsed
      if (config.TIMEOUT > 0) {
        setTimeout(function(){
          if (!exited) {
			console.log('TIMEOUT_SIGNAL');
          //  batch.kill(config.TIMEOUT_SIGNAL);
            stream('stdout', uuid, processId, 'PROGRESSERROR: TERMINATED DUE TO TIMEOUT');
          }
        }, config.TIMEOUT);
      }
    } catch (e) {
      // not a lot we can do now (the response has been committed), just stop the app from crashing.
      console.log(e);
    }
  });

   router.post('/process', function(req, res, nxt) {
		// save selected categories to *.properties file
		function getParams(obj) {
		  var count = 1;
		  var params = '';
		  for(var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if(key == 'field_' + count) {	
					var field = obj[key];
					field = field.replace(/\s+/g, '');
					var asset = obj['asset_' + count];
					asset = asset.split(',');
					params = params + field + ' comcast.com' + asset[1] + ' ';
				}
			  ++count;
			}
		  }
		  params = ((count - 1) / 2) + " " + params;
		  return params;
		}
		var params = getParams(req.body);

		try {
			
			var cp = spawn('cmd', ['/c', 'scripts\\set_genres.bat ' + params], { stdio: 'inherit'});
			
			cp.stdout.on("data", function(data) {
			});

			cp.stderr.on("data", function(data) {
				console.error(data.toString());
			});
			
			cp.on('exit', function (code) {
				console.log('child process exited with code ' + code);
			});
			
			cp.on('close', function (code, signal) {
				exited = true;
				if (code != null) {
				  if (code !== 0) {
					console.log('stdout. PROGRESSERROR: Program exited with code: ' + code);
				  } else {
					console.log('stdout. PROGRESSERROR: Program exited with code: ' + code);
				  }
				}
				if (signal) {
				  console.log('stdout - PROGRESSERROR: Program exited abnormally with signal: ' + signal);
				}
			});
			
		} catch (e) {
		  // not a lot we can do now (the response has been committed), just stop the app from crashing.
		  console.log(e);
		}
   });

  return router;
}