var express = require('express');
var req = require('supertest');
var middleware = require('../');


describe('Range parsing', function() {
  it('should parse range', function(done) {
    var app = express();

    app.use(middleware({
      accept: 'items',
    }));

    app.get('/', function(req, res) {
      res.json(req.range);
    });

    req(app)
      .get('/')
      .set('Range', 'items=0-4')
      .expect(206)
      .expect('Content-Range', 'items 0-4/*')
      .end(done);
  });
  it('should accept static length', function(done) {
    var app = express();

    app.use(middleware({
      accept: 'items',
      length: 10
    }));

    app.get('/', function(req, res) {
      res.json(req.range);
    });

    req(app)
      .get('/')
      .set('Range', 'items=0-4')
      .expect(206)
      .expect('Content-Range', 'items 0-4/10')
      .end(done);
  });
  it('should accept dynamic length', function(done) {
    var app = express();

    app.use(middleware({
      accept: 'items',
      length: function(cb) {
        cb(null, 10)
      }
    }));

    app.get('/', function(req, res) {
      res.json(req.range);
    });

    req(app)
      .get('/')
      .set('Range', 'items=0-4')
      .expect(206)
      .expect('Content-Range', 'items 0-4/10')
      .end(done);
  });
  it('should fall back to defaults', function(done) {
    var app = express();

    app.use(middleware({
      accept: 'items',
    }));

    app.get('/', function(req, res) {
      res.json(req.range);
    });

    req(app)
      .get('/')
      .expect(200)
      .expect('Content-Range', 'items 0-9/*')
      .end(done);
  });
  it('should allow overrides', function(done) {
    var app = express();

    app.use(middleware({
      accept: 'items',
    }));

    app.get('/', function(req, res) {
      res.range({
        unit: 'foo',
        first: 1,
        last: 2,
        length: 8
      })
      res.json(req.range);
    });

    req(app)
      .get('/')
      .expect(200)
      .expect('Content-Range', 'foo 1-2/8')
      .end(done);
  });
});
