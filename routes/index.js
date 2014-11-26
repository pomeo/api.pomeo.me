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
    debugOn    = true;

router.get('/', function(req, res) {
  res.send('ok');
});

module.exports = router;

function log(logMsg) {
  if (logMsg instanceof Error) logger.error(logMsg.stack);
  if (debugOn) {
    logger.info(logMsg);
  }
};
