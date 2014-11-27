var express    = require('express'),
    router     = express.Router(),
    winston    = require('winston'),
    xml2js     = require('xml2js'),
    moment     = require('moment'),
    rest       = require('restler'),
    Logentries = require('winston-logentries');

if (process.env.NODE_ENV === 'development') {
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });
} else {
  var logger = new (winston.Logger)({
    transports: [
      new winston.transports.Logentries({token: process.env.logentries})
    ]
  });
}

router.get('/', function(req, res) {
  res.send('ok');
});

router.get('/github', function(req, res) {
  rest.get('https://github.com/pomeo.atom', {
    parser: rest.parsers.xml
  }).once('complete', function(result) {
    if (result instanceof Error) {
      log('Error:' + result.message, 'error');
      res.send('ok');
    } else {
      var githubArray = [];
      for (var i = 0; i < 2; i++) {
        githubArray.push({
          title: result['feed']['entry'][i]['title'],
          date: result['feed']['entry'][i]['published'],
          content: result['feed']['entry'][i]['content']
        });
      }
      res.json(githubArray);
    }
  });
});

module.exports = router;

function log(logMsg, logType) {
  if (logMsg instanceof Error) logger.error(logMsg.stack);
  if (logType !== undefined) {
    logger.log(logType, logMsg);
  } else {
    logger.info(logMsg);
  }
};