# express-range

Express middleware for handling `Range`, `Content-Range`, and `Accept-Ranges` headers.

## Install

Install the [package](http://npmjs.org/package/express-range) with [npm](http://npmjs.org):

```sh
$ npm install express-range
```

## Usage

Create middleware:

```js
var app = express();
app.use(range({
  accept: 'items',
  defaultLimit: 10,
  maxLimit: 200
}));
```

Use it in your route:

```js
var items = [{
  name: 'foo',
  id: 1
}, {
  name: 'bar',
  id: 2
}, {
  name: 'baz'
}];

app.get('/foo', function(req, res) {
  res.range({
    first: 0,
    last: 1,
    length: items.length
  });
  res.json(items.slice(req.range.first, req.range.last + 1));
});
```

## API

### range(options)

Creates an `express` middleware.

- `options.accept` - accepted range unit
- `options.defaultLimit` - If range not specified, range `0-(defaultLimit-1)` is assumed
- `options.maxLimit` - If range is larger that `maxLimit`, `maxLimit is assumed`
- `options.length` - Collection length, or `Function` (with `function(cb(err, length))` signature)

### req.range

POJO, containing the requested range.

- `req.range.unit` - `Range` unit
- `req.range.first` - First items index (defaults to 0)
- `req.range.last` - Last items index (defaults to `defaultLimit`)

### res.range(options)

Set response headers (`Content-Range`).
