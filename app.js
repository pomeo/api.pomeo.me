var express = require('express');
var debug = require('debug')('app');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var routes = require('./routes/index');

var app = express();

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

var server = app.listen(app.get('port'), '127.0.0.1', function() {
               debug('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
             });

// server with small memory, need manual release
setInterval(function () {
  global.gc();
  console.log((process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'Mb');
}, 10000);