var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var userInfoRouter = require('./routes/user');
var showRequestRouter = require('./routes/showReq');
var registerRouter = require('./routes/register');
var resetPfp = require('./routes/resetPfp');
var addLearnedWord = require('./routes/addLearnedWord');
var saveTimeSpent = require('./routes/saveTimeSpent');
var editUsernameEmail = require('./routes/editUsernameEmail');
var setStreak = require('./routes/setStreak');
var sync = require('./routes/sync');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/user', userInfoRouter);
app.use('/showReq', showRequestRouter);
app.use('/register', registerRouter);
app.use('/resetPfp', resetPfp);
app.use('/addLearnedWord', addLearnedWord);
app.use('/saveTimeSpent', saveTimeSpent);
app.use('/editUsernameEmail', editUsernameEmail);
app.use('/setStreak', setStreak);
app.use('/sync', sync);


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

// Set the port
const port = process.env.PORT || 3000;

// Start the server and log the port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;