var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

 var compression = require('compression')
var express = require('express')
var app = express()
app.use(compression())

var index = require('./routes/index');
var users = require('./routes/users');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require("hbs")
hbs.registerHelper("equal", require("handlebars-helper-equal"))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var session=require('express-session');
app.use(session({secret:'sdadadasdadsa344',resave:false,saveUninitialized:true}));



app.use('/css',express.static(path.join(__dirname+'/node_modules/bootstrap/dist/css')));
app.use('/js',express.static(path.join(__dirname+'/node_modules/bootstrap/dist/js')));
app.use('/css',express.static(path.join(__dirname+'/node_modules/bootstrap-material-design/dist/css')));
app.use('/js',express.static(path.join(__dirname + '/node_modules/bootstrap-material-design/dist/js/')));
app.use('/js',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));	


app.use('/', index);
app.use('/users', users);

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
