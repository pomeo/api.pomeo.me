var express    = require('express'),
    router     = express.Router(),
    winston    = require('winston'),
    xml2js     = require('xml2js'),
    logger     = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)()
      ]
    }),
    moment     = require('moment'),
    rest       = require('restler'),
    Logentries = require('winston-logentries');

router.get('/', function(req, res) {
  res.send('ok');
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