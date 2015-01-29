	// The batch files to report progress by pre-pending keywords to STDOUT messages
var REPORT_FLAG_CALL = 'PROGRESSREPORT:'; // flags a status message
var REPORT_FLAG_END = 'PROGRESSEND:'; // flags end of processing
var REPORT_FLAG_ERROR = 'PROGRESSERROR:'; // flags error in processing

// the batch file name to be executed
var DEFAULT_BATCH_FILE = 'buildVodBrowser.bat';
//var DEFAULT_BATCH_FILE = 'test3.bat';


// limit display to N lines of log
var LOG_LIMIT = 500;
var childCount = 0;

// for throttling scroll events
var lastScrollTime = 0;

// for progress bar
var timer;

/**
 * Since there is no login, just create a new identifier for this user.
 */
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };
})();
var clientId = guid();

//function prepareLogDetailstable(value = ''){

//}


// construct the application command request
function buildCommand() {
  return '/exec?command=' + DEFAULT_BATCH_FILE + '&args=' + '&clientId=' + clientId;
}

/* event handlers */

// called when a progress status line is detected
function onProgressReport(logtime, text) {
	var data = [];
	switch(true) {
	case (text.indexOf("Getting Metadata") > -1):
		$('.progressMain .step-1').addClass('active');
		data[0] = 'GENERATE_METADATA_STATUS=RUNNING';
		data[1] = 'GENERATE_METADATA_STARTTIME=' + logtime;
		updateTableDetail(data);
		break;
	case (text.indexOf("Generating videos") > -1):
		data[0] = 'GENERATE_METADATA_STATUS=COMPLETED';
		data[1] = 'GENERATE_VIDEOS_STATUS=RUNNING'
		data[2] = 'GENERATE_METADATA_ENDTIME=' + logtime;
		data[3] = 'GENERATE_VIDEOS_STARTTIME=' + logtime;
		data[4] = 'GENERATE_VIDEOS_STARTTIME=' + logtime;
		updateTableDetail(data);
		break;
	case (text.indexOf("Calling Manzanita") > -1):
		data[0] = 'GENERATE_VIDEOS_STATUS=COMPLETED';
		data[1] = 'MANZ_STATUS=RUNNING';
		data[2] = 'GENERATE_VIDEOS_ENDTIME=' + logtime;
		data[3] = 'MANZ_STARTTIME=' + logtime;
		updateTableDetail(data);
	
		break;
	case (text.indexOf("Building EBIF") > -1):
		data[0] = 'MANZ_STATUS=COMPLETED';
		data[1] = 'MUX_STATUS=RUNNING';
		data[2] = 'MANZ_ENDTIME=' + logtime;
		data[3] = 'MUX_STARTTIME=' + logtime;
		updateTableDetail(data);
		break;
	case (text.indexOf("Exporting output") > -1):
		data[0] = 'MUX_STATUS=COMPLETED';
		data[1] = 'MUX_ENDTIME=' + logtime;
		updateTableDetail(data);
		break;
	}					
 // $('.statusBar').text(text);

}

// called when a progress end line is detected
function onProgressComplete(text) {
$('.progressMain .step-5').removeClass('active').addClass('done');
$('.progressMain .step-6').addClass('active');
  $('.statusBar').text('');
  $('.fileLocation').html('<strong>File Location:</strong>');
  $(".success").html("Succeeded");
  $(".progress").css("width", "402px");
  window.clearInterval(timer);
}

// called when a progress error line is detected
function onProgressError(text) {
  $('.statusBar').text(text);
  $(".progress").css("width", "402px");
  window.clearInterval(timer);
}

// called when socket.io receives data
// the log object will have the following properties : pid, time, text
function appendLogString(log, isError) {

  var area = $("#log-area")[0];
  var nowInMs = Date.now();

  var lines = log.text.split(/\r\n|\r|\n/g);
  //var logTime = new Date(log.time);
  var logTime = log.time;
   var timestamp = '[ ' + logTime +' ]';
 // var timestamp = '[ ' + logTime.toLocaleTimeString('en-GB') +' ]';

  for (var j = 0; j < lines.length; j++) {
    var line = lines[j];
    if (line === '') {
      continue;
    }

    // check if the output is a progress report line
    if (line.indexOf(REPORT_FLAG_CALL) === 0) {
      onProgressReport(logTime, line.substr(REPORT_FLAG_CALL.length));
    }

    if (line.indexOf(REPORT_FLAG_END) === 0) {
	  
      onProgressComplete(line.substr(REPORT_FLAG_END.length));
    }

    if (line.indexOf(REPORT_FLAG_ERROR) === 0) {
      onProgressError(line.substr(REPORT_FLAG_ERROR.length));
    }

    // limit the amount of data on screen or we will run out of memory
    if (childCount >= LOG_LIMIT) {
      area.removeChild(area.firstChild);
    }

    $(area).append($('<div />').addClass(isError ? 'stderr' : 'stdout').text(timestamp + ' ' + line));
    childCount++;
  }

  // throttle scrolling so browser won't have to work too hard
  if (lastScrollTime === 0 || nowInMs - lastScrollTime > 500) {
    lastScrollTime = nowInMs;
    $(area).scrollTop(area.scrollHeight);
  }
  area = null;
}

function updateTableDetail( data) {
	
/*     $.ajax({
		type: 'GET',
		url: 'rest/VodBrowser/updateTableDetails',
		success: function (data) {*/
			if (data == null) {
				//do nothing
			} else {
				var str = data;
				if (str != "COMPLETED") {
					//var arr = str.split('|');
					var arr = data;
					for (var i = 0; i < arr.length; i++) {
						var key_pairs = arr[i];
						if (key_pairs == null || key_pairs == '') {
							//do nothing
						} else {
							var key_pairs_arr = key_pairs.split('=');
							var key = key_pairs_arr[0];
							var value = key_pairs_arr[1];
							if (key == "GENERATE_METADATA_STATUS") {
								$("#metadata_status").text(value);
								if (value.trim() == "COMPLETED") {
									$("#metadata_graphic").css('color', 'green');
									$('#metadata_log').show();

								} else if (value.trim() == "QUEUED") {
									$("#metadata_graphic").css('color', '#CC4E5C');

								} else if (value.trim() == "RUNNING") {
									$("#metadata_graphic").css('color', '#FF6961');

								} else if (value.trim() == "FAILED") {
									$("#metadata_graphic").css('color', 'red');
									$('#metadata_log').show();
								}
							} else if (key == "GENERATE_METADATA_STARTTIME") {
								$("#metadata_start").text(value);
							} else if (key == "GENERATE_METADATA_ENDTIME") {
								$("#metadata_end").text(value);
							} else if (key == "GENERATE_METADATA_TIME_TAKEN") {
								$("#metadata_time").text(value);
							} else if (key == "GENERATE_VIDEOS_STATUS") {
								$("#videos_status").text(value);
								if (value.trim() == "COMPLETED") {
									$("#video_graphic").css('color', 'green');
									$('#videos_log').show();

								} else if (value.trim() == "QUEUED") {
									$("#video_graphic").css('color', '#CC4E5C');

								} else if (value.trim() == "RUNNING") {
									$("#video_graphic").css('color', '#FF6961');

								} else if (value.trim() == "FAILED") {
									$("#video_graphic").css('color', 'red');
									$('#videos_log').show();
								}
							} else if (key == "GENERATE_VIDEOS_STARTTIME") {
								$("#videos_start").text(value);
							} else if (key == "GENERATE_VIDEOS_ENDTIME") {
								$("#videos_end").text(value);
							} else if (key == "GENERATE_VIDEOS_TIME_TAKEN") {
								$("#videos_time").text(value);
							} else if (key == "MANZ_STATUS") {
								$("#manz_status").text(value);
								if (value.trim() == "COMPLETED") {
									$("#manz_graphic").css('color', 'green');
									$('#manz_log').show();

								} else if (value.trim() == "QUEUED") {
									$("#manz_graphic").css('color', '#CC4E5C');

								} else if (value.trim() == "RUNNING") {
									$("#manz_graphic").css('color', '#FF6961');

								} else if (value.trim() == "FAILED") {
									$("#manz_graphic").css('color', 'red');
									$('#manz_log').show();
								}

							} else if (key == "MANZ_STARTTIME") {
								$("#manz_start").text(value);
							} else if (key == "MANZ_ENDTIME") {
								$("#manz_end").text(value);
							} else if (key == "MANZ_TIME_TAKEN") {
								$("#manz_time").text(value);
							} else if (key == "MUX_STATUS") {
								$("#mux_status").text(value);
								if (value.trim() == "COMPLETED") {
									$("#mux_graphic").css('color', 'green');
									$('#mux_log').show();

								} else if (value.trim() == "QUEUED") {
									$("#mux_graphic").css('color', '#CC4E5C');

								} else if (value.trim() == "RUNNING") {
									$("#mux_graphic").css('color', '#FF6961');

								} else if (value.trim() == "FAILED") {
									$("#mux_graphic").css('color', 'red');
									$('#mux_log').show();
								}

							} else if (key == "MUX_STARTTIME") {
								$("#mux_start").text(value);
							} else if (key == "MUX_ENDTIME") {
								$("#mux_end").text(value);
							} else if (key == "MUX_TIME_TAKEN") {
								$("#mux_time").text(value);
							} else if (key == "ALL_STATUS") {
								if (value.trim() != "COMPLETED") {
									// Schedule the next
									setTimeout(updateTableDetail, updateInterval);
								} else {
									$('#status').hide();
								}
							} else {
								console.log("Nothing Matched..")
							}
						}
					}
				}
			}
	   // }
   // });
}

$(document).ready(function () {
  $('.progressMain .step').removeClass('active').removeClass('done');
  // connect to the socket.io server
  var socket = io('http://localhost:3000', {'forceNew': true });
  // listen to ALL process Ids started by the current user
  socket.emit('tail', clientId);

	$("#logout").click(function () {
		/*
		$.ajax({type: 'GET',
			url: "logout",
			success: function (responseData) {
				if ("logout_ERROR" == responseData) {
				} else {
					socket.emit('forceDisconnect');
				}
			}
		});
		*/
		window.location = '/logout';
	});
  
  // disable caching on IE
  $.ajaxSetup({
    cache: false
  });

  $(".categorySelection .selectionTopRow a").on("click", function () {
    $(".categorySelection").find("ul").toggle();
  });

  $(".categorySelection .selectionTopRow .selectedInput").on("click", function () {
    $(".categorySelection .selectionTopRow a").trigger("click");
  });

  $(".categorySelection ul a").on("click", function () {
    $(".categorySelection .selectionTopRow a").trigger("click");
    $(".categorySelection .selectionTopRow .selectedInput").text($(this).find("span").text());
    $(this).addClass("selected");
    //$(".resultArea").hide();
    $(".resultArea .success").text("");
    $(".resultArea .logArea").html("");
    $(".resultArea .fileLocation").html("");
  });

 // var progressWidth = 0;
  //$("#startButton").on("click", function () {
  $("#build_vod_browser").on("click", function () {
  
	 $('.progressMain .step').removeClass('active').removeClass('done');
   // if ($(".categorySelection").find(".selected").length == 0)return;

    // reset processing information
    childCount = 0;
    $('.fileLocation').html('');
    $(".logArea").empty();
    $(".resultArea").show();
	
	var data = [];
	data[0] = 'COMPLETE = false';
	data[1] = 'GENERATE_METADATA_STATUS=QUEUED';
	data[2] = 'GENERATE_VIDEOS_STATUS=QUEUED';
	data[3] = 'MANZ_STATUS=QUEUED';
	data[4] = 'MUX_STATUS=QUEUED';
	
	updateTableDetail(data);

    $.ajax({"url": buildCommand()}).done(function (data) {
      $('.logLocation').html('<a target="_blank" href="/logs/' + clientId + '_' + data.pid + '.txt">View Full Log</a>');
      // handle logs
      socket.on('stdout', function (data) {
        appendLogString(data, false);
      });
	  socket.on('step', function (data) {
		var text = [];
		var htmlL = '<a href="http://localhost:3000/logs/'  + clientId;
		var htmlR = '" target="_blank">click here</a>';
		switch(true) {
			case (data.currentStep == 1):
				text[0] = "GENERATE_METADATA_TIME_TAKEN=" + data.timeTaken;
				// display log file link
				$('#metadata_log').append(htmlL + "_meta.txt"  + htmlR);
				break;
			case (data.currentStep == 2):
				text[0] = "GENERATE_VIDEOS_TIME_TAKEN=" + data.timeTaken;
				$('#videos_log').append(htmlL + "_video.txt"  + htmlR);
				break;
			case (data.currentStep == 3):
				text[0] = "MANZ_TIME_TAKEN=" + data.timeTaken;
				$('#manz_log').append(htmlL + "_manz.txt"  + htmlR);
				break;
			case (data.currentStep == 4):
				text[0] = "MUX_TIME_TAKEN=" + data.timeTaken;
				$('#mux_log').append(htmlL + "_munx.txt"  + htmlR);
				break;
		}
		updateTableDetail(text);
      });
      socket.on('stderr', function (data) {
        appendLogString(data, true);
      });

    }).error(function (jqXHR, errorText) {
      alert(jqXHR.responseText || errorText);
    });
  });
});