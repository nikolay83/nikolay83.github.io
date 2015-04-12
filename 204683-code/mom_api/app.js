'use strict';

/**
 * API Application script
 */

/* Globals */
var express = require('express'),
  logger = require('./logger').getLogger(),
  path = require('path'),
  cors = require('cors'),
  app = express();

var router = require('./middlewares/router'),
  tokenParser = require('./middlewares/tokenParser'),
  formParser = require('./middlewares/formParser'),
  responser = require('./middlewares/responser'),
  errorHandler = require('./middlewares/errorHandler'),
  config = require('config'),
  port = process.env.PORT || config.WEB_SERVER_PORT || 3000;

var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var job = require('./lib/scheduleJob');

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors());
// only use bodyParser for json and urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var options = {
  uploadDir: path.join(process.cwd(), config.TEMP_DIRECTROY)
};
app.use(formParser(options));
app.use(tokenParser());
// init application routes
app.use(router(config));
// use global error handler
app.use(errorHandler());
// use responser
app.use(responser());
// start the application
app.listen(port);
logger.info('App started on port ' + port);
// schedule job

//schedule.scheduleJob('* * '+ config.OFFER_EXPIRATION_DAYS +' * *', job.runJob());