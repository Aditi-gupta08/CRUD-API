var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');

var courseRouter = require('./routes/course');
var studentRouter = require('./routes/student');
var authRouter = require('./routes/auth');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use( '/api', authRouter);

// Application level middleware
app.use( (req, res, next) => {


  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];

      req.token = bearerToken;

      jwt.verify( req.token, 'secretkey', (err, authData) => {

          if(err) {
              res.status(400).json({ "error": "Not verified successfully"}); 
          } else {
              next();
          }
      });
      
  } else {
    res.status(400).json({error: 'Token not found'});
  }
  
});



/* app.use( '/api', authRouter); */
app.use( '/api/course', courseRouter );
app.use( '/api/student', studentRouter );



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
