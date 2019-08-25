// filename: index.js

// import express
var express = require('express');

// import body-parser
var bodyParser = require('body-parser');

// import mongoose
var mongoose = require('mongoose');

// initialize the app
var app = express();

// import routes
var router = require('./router');

// configure body-parser to handle post requests
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

// connect to mongoose and set connection variable
mongoose.connect('mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study', {useNewUrlParser: true});
var db = mongoose.connection;

// added check for DB connection
if (!db) {
  console.log('error connecting to db!');
} else {
  console.log('DB connected successfully.');
}

// setup server port
var port = process.env.PORT || 8080;

// reject requests other than POST
app.all('*', function(req, res, next) {
  if (req.method != 'POST') {
    res.status(405)
        .json({'code': 'METHOD_NOT_ALLOWED', 'message': req.method + ' method is not allowed!'});
  }
  next(); // pass control to the next handler
});

// use API router in the app
app.use('/api', router);

// launch app to listen to specified port
app.listen(port, function() {
  console.log('running getir-case on port ' + port);
});
