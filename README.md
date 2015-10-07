# postcss-color-rgba-fallback [![Travis Build Status](https://travis-ci.org/postcss/postcss-color-rgba-fallback.svg)](https://travis-ci.org/postcss/postcss-color-rgba-fallback)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform rgba() to hexadecimal.

## Installation

```bash
$ npm install postcss-color-rgba-fallback
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorRgbaFallback = require("postcss-color-rgba-fallback")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(colorRgbaFallback())
  .process(css)
  .css
```

Using this `input.css`:

```css
body {
  background: rgba(153, 221, 153, 0.8);
  border: solid 1px rgba(100,102,103,.3);
}

```

you will get:

```css
body {
  background: #99dd99;
  background: rgba(153, 221, 153, 0.8);
  border: solid 1px #646667;
  border: solid 1px rgba(100,102,103,.3);
}
```

## Node.js options

postcss-color-rgba-fallback accepts option

##### `properties`
default: `
[ "background-color",
  "background",
  "color",
  "border",
  "border-color",
  "outline",
  "outline-color ]
`

Allows you to specify your whitelist of properties.
**This option enables adding a fallback for one or a properties list**

Checkout [tests](test) for more examples.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/postcss/postcss-color-rgba-fallback.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
