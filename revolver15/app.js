var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');

var session = require('cookie-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  keys: ['sessionkey', '']
}))

var server = require('http').createServer(app);
var io = require('socket.io')(server);

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
	res.redirect('/');
  }else {
    next();
  }
}
var routes = require('./routes/index')(io, checkAuth);

app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

app.use('/',  routes);

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.post('/login', function (req, res) {
 var post = req.body;
  if (post.username === 'cable\\topcoder' && post.password === 'password') {
    req.session.user_id = "rev_user_id_321564";
    res.send('OK');
  } else {
    res.send('AUTHENTICATION_ERROR');
  }
});

app.get('/odcr', checkAuth, function(req, res) {
	res.render('odcr.ejs');
});

app.get('/logout', function(req, res){
	delete req.session.user_id;
	res.redirect('/');
});

app.set('port', process.env.PORT || 3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        "message": err.message,
        "error": err
    });
});

if (!module.parent) {
  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
}

module.exports = app;