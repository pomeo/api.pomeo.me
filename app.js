'use strict';
const express = require('express');
const debug = require('debug')('app');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

let routes = require('./routes/index');

const app = express();

app.set('port', process.env.PORT || 3000);

app.enable('trust proxy');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.sendStatus(500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.sendStatus(500);
});

app.listen(app.get('port'), '0.0.0.0', function() {
  debug('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
