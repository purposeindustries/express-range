'use strict';

var parse = require('http-range-parse');
var format = require('http-content-range-format');

module.exports = function middleware(options) {
  options = options || {};
  var accept = options.accept || ['items'];
  if(typeof accept == 'string') {
    accept = [accept];
  }
  var limit = options.limit || 10;
  var lengthFn = typeof options.length == 'number'
               ? function(cb) { cb(null, options.length); }
               : typeof options.length == 'undefined'
               ? function(cb) { cb(); }
               : options.length;
  return function contentRange(req, res, next) {
    var parsed = req.headers.range
               ? parse(req.headers.range)
               : accept.length == 1
               ? {
                   unit: accept[0],
                   first: 0,
                   last: limit - 1
                 }
               : null;
    req.range = parsed;
    res.setHeader('Accept-Ranges', accept.join(', '));
    if(req.headers.range) {
      res.status(206);
    }
    lengthFn(function(err, length) {
      if(err) {
        return next(err);
      }
      if(accept.length == 1 && typeof parsed.first == 'number'
                            && typeof parsed.last == 'number') {
        res.setHeader('Content-Range', format({
          first: parsed.first,
          last: parsed.last,
          unit: accept[0],
          length: length
        }));
      }
      res.range = function(opts) {
        if(!opts.unit && !parsed && accept.length > 1) {
          throw new Error('Content-Range unit is ambigous');
        }
        res.setHeader('Content-Range', format({
          unit: opts.unit || parsed.unit || accept[0],
          first: opts.hasOwnProperty('first') ? opts.first : parsed.first,
          last: opts.hasOwnProperty('last') ? opts.last : parsed.last,
          length: opts.hasOwnProperty('length') ? opts.length : parsed.length,
        }));
      };
      next();
    });
  };
};
