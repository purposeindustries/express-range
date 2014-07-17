'use strict';

var contentRange = require('content-range');

module.exports = function middleware(options) {
  options = options || {};
  return function contentRange(req, res, next) {
    req.range = req.headers.range ? contentRange.parse(req.headers.range) : null;
    var available = [];
    res.range = function(opts) {
      if(available.indexOf(opts.name) === -1) {
        available.push(opts.name);
      }
      res.setHeader('Content-Range', contentRange.format(opts));
      res.setHeader('Accept-Ranges', available.join(', '));
    };
    next();
  };
};
