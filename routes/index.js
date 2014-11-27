var express    = require('express'),
    router     = express.Router(),
    winston    = require('winston'),
    xml2js     = require('xml2js'),
    moment     = require('moment'),
    rest       = require('restler'),
    Twit       = require('twit'),
    NodeCache  = require('node-cache'),
    myCache    = new NodeCache({stdTTL: 3600, checkperiod: 120}),
    Logentries = require('winston-logentries');

var T = new Twit({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_KEY_SECRET,
  access_token:        process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

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

router.get('/twitter', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  res.send('ok');
});

router.get('/github', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  if (Object.getOwnPropertyNames(myCache.get('github')).length == 0) {
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
            title: '<div class="b-title">' + result['feed']['entry'][i]['title'] + '</div>',
            date: '<time datetime="' + result['feed']['entry'][i]['published'] + '">about ' + moment(result['feed']['entry'][i]['published']).fromNow() + '</time>',
            content: result['feed']['entry'][i]['content'].replace(new RegExp('(href\=\")[^http]', 'g'), 'href="https:\/\/github.com\/')
          });
        }
        myCache.set('github', githubArray);
        res.json(myCache.get('github'));
      }
    });
  } else {
    res.json(myCache.get('github'));
  }
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