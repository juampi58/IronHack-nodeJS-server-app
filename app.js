const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const multer = require("multer");

//routes
const users = require('./routes/users');
const layovers  = require('./routes/layovers');
const auth = require('./routes/auth');

const passport   = require('passport');

const app = express();

mongoose.connect('mongodb://localhost/app-catchme');

app.use(session({
  secret: 'catchme-app',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', auth);
app.use('/users', users);//, passport.authenticate('jwt', { session: false }));
app.use('/layovers', layovers);
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

  console.log('ERROR', req.method, req.path, err);

  if (!res.headersSent) {
    res.status(err.status || 500);
    res.json({error: err && err.message || 'Unexpected error'});
  }
});

module.exports = app;
