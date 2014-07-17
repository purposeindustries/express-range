var express = require('express');
var middleware = require('../');

var app = express();

app.use(middleware({
  accept: ['items'],
  limit: 10,
}));

app.get('/', function(req, res) {
  res.range(req.range)
  res.json(req.range);
});

describe('Range parsing', function() {
  it('should parse range');
  it('should return the first range if missing');
});
