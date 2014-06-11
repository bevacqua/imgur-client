'use strict';

var https = require('https');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var host = 'https://api.imgur.com';
var endpoint = '/2/upload.json';
var types = 'jpg jpeg gif png apng tiff bmp pdf xcf'.split(' ');
var rtypes = new RegExp('(' + types.join('|') + ')', 'i');

function upload (key, file, done) {
  var form = new FormData();

  form.append('key', key);
  form.append('type', 'file');
  form.append('image', fs.createReadStream(file));
  form.submit(host + endpoint, function handleImgurResponse (err, res) {
    if (err) {
      done(err, { file: file });
      return;
    }

    var body = '';
    var ratelimit = {
      limit: null,
      remaining: null,
      reset: null
    };

    res.setEncoding('utf8');

    if (res.headers['x-ratelimit-limit'] !== void 0) {
      ratelimit.limit = res.headers['x-ratelimit-limit'];
      ratelimit.remaining = res.headers['x-ratelimit-remaining'];
      ratelimit.reset = res.headers['x-ratelimit-reset'];
    }

    res.on('data', function buffer (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        json = body; // fall back to plain text
      }

      done(res.statusCode === 200 ? null : json, {
        status_code: res.statusCode || 'Unknown',
        rate: ratelimit,
        file: file,
        body: json
      });
    });
  });
}

module.exports = function (key) {
  return {
    upload: upload.bind(null, key)
  };
};
