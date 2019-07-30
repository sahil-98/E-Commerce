var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expresshbs = require('express-handlebars')
var mongoose = require ('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash')
var MongoStore = require('connect-mongo')(session);
//var expressValidator = require('express-validator');


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();


const url = 'mongodb://localhost:27017/shopping';
const connect = mongoose.connect(url, { useNewUrlParser: true }); 
require('./config/passport');
console.log("Hello222");


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.use(express.static('public/images'));
app.engine('.hbs',expresshbs({defaultLayout: 'layout',extname: '.hbs'}));

app.use("/images",express.static(__dirname + "/images"));
app.set('view engine', '.hbs');

//It is use to serve static files in public folder like, images in public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'mysuper',
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*1000} //180 Minutes
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//app.use(function(req,res,next) {
  //res.locals.login = req.isAuthenticated();
//});
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user',userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
