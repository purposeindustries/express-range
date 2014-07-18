'use strict';

var contentRange = require('content-range');

function parse(str) {
  var parts = str.split('=');
  if(parts.length != 2) {
    throw new Error('Not valid HTTP range!');
  }
  var unit = parts[0];
  var range = parts[1].split('-');
  if(range[0] == '') {
    return {
      unit: unit,
      first: -parseInt(range[1], 10)
    };
  }
  return {
    unit: unit,
    first: parseInt(range[0], 10),
    last: parseInt(range[1], 10)
  };
}

function extend(obj) {
  [].slice.call(arguments, 1).forEach(function(o) {
    Object.keys(o).forEach(function(key) {
      obj[key] = o[key];
    });
  });
}

module.exports = function middleware(options) {
  options = options || {};
  var accept = options.accept || 'items';
  return function contentRange(req, res, next) {
    var parsed = req.headers.range
               ? parse(req.headers.range)
               : {};
    req.range = {
      first: parsed.first || 0,
      last: parsed.firs < 0 || ((parsed.first || 0) + options.defaultLimit - 1)
    };
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
