'use strict';
const express    = require('express');
const router     = express.Router();
const moment     = require('moment');
const rest       = require('restler');
const NodeCache  = require('node-cache');
const myCache    = new NodeCache({
  stdTTL: 3600, checkperiod: 120
});
import logger from '../lib/logger';

router.get('/', function(req, res) {
  res.send('OK');
});

router.get('/github', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  myCache.get('github', function(err, value){
    if (err) {
      logger.error('Error: ' + err);
      res.send('err');
    } else {
      if (value === undefined) {
        rest.get('https://github.com/pomeo.atom', {
          parser: rest.parsers.xml
        }).once('complete', function(result) {
          if (result instanceof Error) {
            logger.error('Error:' + result.message);
            res.send('ok');
          } else {
            let githubArray = [];
            for (var i = 0; i < 2; i++) {
              githubArray.push({
                date: '<time datetime="' + result.feed.entry[i].published[0] + '">' + moment(result.feed.entry[i].published[0]).fromNow() + '</time>',
                content: result.feed.entry[i].content[0]._.replace(new RegExp('(href\=\")[^http]', 'g'), 'href="https:\/\/github.com\/')
              });
            }
            myCache.set('github', githubArray);
            res.json(myCache.get('github'));
          }
        });
      } else {
        res.json(myCache.get('github'));
      }
    }
  });
});

module.exports = router;
