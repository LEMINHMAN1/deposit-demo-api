var express = require('express');
var app = express();
var http = require('http').Server(app);
var dotenv = require('dotenv');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var passport = require('passport');
var DBConnectUtils = require('./src/utils/DBConnectUtils');

// Load all config from .env
dotenv.config();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use(cookieParser());

// Config passport
app.use(passport.initialize());

// Config log
winston.level = process.env.LOG_LEVEL;

// Database connection
DBConnectUtils.connectMongoDB();

app.use(require('./src/router/routes'));

var port = process.env.PORT || 5000;

http.listen(port, function (req, res) {
  console.log('listening on *:' + port);
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
