var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var clientSessions = require('client-sessions');

var index = require('./api/routes/index');
var signup = require('./api/routes/signup');
var login = require('./api/routes/login');
var profile = require('./api/routes/profile');
var users = require('./api/routes/users');
var documents = require('./api/routes/documents');

var app = express();

// ============================================================================================= //
// Server Configuration                                                                          //
// ============================================================================================= //

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// Discovers public and views directories.
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//stuff for passports & sessions
app.use(clientSessions({
	cookieName: 'userSession',
	path: '/',
	secret: 'cookieStealer', //TODO: make this more secure
	duration: 600000,
	activeDuration: 600000
})); 
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

// Handling CORS.
app.use(function(req, res, next) {
    // Allows accepts to any client; hence '*'
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Let's the browser know which HTTP methods the server allows.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    // Must route requests by calling next(), otherwise all requests will be blocked.
    next();
});
// ============================================================================================= //

// ============================================================================================= //
// MongoDB Connection                                                                            //
// ============================================================================================= //

// A third party Promise object; Mongoose's Promise is deprecated.
// For more information about Promises:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
mongoose.Promise = require('bluebird');

// Connect to Database
const dbUser = process.env.ATLAS_USER || 'cruder';
const dbPassword = process.env.ATLAS_PW;
mongoose.connect(
    'mongodb://' + dbUser + ':' + dbPassword + '@cluster0-shard-00-00-8nsnm.mongodb.net:27017,' +
    'cluster0-shard-00-01-8nsnm.mongodb.net:27017,cluster0-shard-00-02-8nsnm.mongodb.net:27017/' +
    'test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
);
// ============================================================================================= //

app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/profile', profile);
app.use('/users', users);
app.use('/documents', documents);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
