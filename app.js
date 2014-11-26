var express = require('express');
var debug = require('debug')('api.pomeo.me');
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


var server = app.listen(app.get('port'), function() {
               debug('Express server listening on port ' + server.address().port);
             });
