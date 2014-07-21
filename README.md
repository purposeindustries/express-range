# express-range [![Build Status](https://travis-ci.org/purposeindustries/express-range.svg)](https://travis-ci.org/purposeindustries/express-range)

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
  limit: 10,
}));
```

Uses sane defaults:

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
      first: req.range.first,
      last: req.range.last,
      length: items.length
    });
  res.json(items.slice(req.range.first, req.range.last + 1));
});
```

## API

### range(options)

Creates an `express` middleware. The middleware parses the range `Range`
header, and sets response code `206` if present. It also sets the `Accept-Ranges`
header.

- `options.accept` - accepted range unit(s)
- `options.limit` - *optional* If range not specified in the request, range `0-(limit-1)` is assumed
- `options.length` - *optional* Collection length, or `Function` (with `function(cb(err, length))` signature).
  If not provided, unknown length (`*`) is assumed.

### req.range

POJO, containing the requested range.

- `req.range.unit` - `Range` unit
- `req.range.first` - First items index (defaults to 0 if no range is specified)
- `req.range.last` - Last items index (defaults to `limit-1` if no range is specified)
- `req.range.suffix` - If the range is suffix-style (`Range: items=-5` - the last 5 items)

### res.range(options)

Set custom response headers (`Content-Range`). By default, the middleware sets
the same response range, that was requested.

- `options.unit` - Specify range unit (it defaults to the requested unit)
- `options.first` - Specify the first items index (it defaults to the requested one)
- `options.last` - Specify the last items index(it defaults to the requested one)
. `options.length` - Specify the resource lenth (it defaults to middleware default, or `*`)

## License

MIT
