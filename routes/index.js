'use strict';
const express    = require('express');
const router     = express.Router();
const log        = require('winston-logs')({
  production: {
    logentries: {
      token: process.env.logentries
    }
  },
  development: {
    'console': {
      colorize: true
    }
  }
});
const moment     = require('moment');
const rest       = require('restler');
const _          = require('lodash');
const Twit       = require('twit');
const NodeCache  = require('node-cache');
const myCache    = new NodeCache({
  stdTTL: 3600, checkperiod: 120
});

let T = new Twit({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_KEY_SECRET,
  access_token:        process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/', function(req, res) {
  res.send('ok');
});

router.get('/twitter', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  myCache.get('github', function(err, value){
    if (err) {
      log('Error: ' + err);
      res.send('err');
    } else {
      if (_.isUndefined(value)) {
        T.get('statuses/user_timeline', {
          screen_name: 'pomeo',
          count: 2
        }, function (err, statuses) {
          if (err) {
            log('Error: ' + err);
            res.send('err');
          } else {
            let twArray = [];
            for (var i = 0; i < statuses.length; i++) {
              twArray.push({
                url: 'https://twitter.com/pomeo/statuses/' + statuses[i].id_str,
                date: moment(new Date(statuses[i].created_at)).fromNow(),
                content: statuses[i].text
              });
            }
            myCache.set('twitter', twArray);
            res.json(myCache.get('twitter'));
          }
        });
      } else {
        res.json(myCache.get('twitter'));
      }
    }
  });
});

router.get('/github', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  myCache.get('github', function(err, value){
    if (err) {
      log('Error: ' + err);
      res.send('err');
    } else {
      if (_.isUndefined(value)) {
        rest.get('https://github.com/pomeo.atom', {
          parser: rest.parsers.xml
        }).once('complete', function(result) {
          if (result instanceof Error) {
            log('Error:' + result.message, 'error');
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
