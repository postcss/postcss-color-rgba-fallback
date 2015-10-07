# PostCSS RGBA Fallback [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS RGBA Fallback] is a [PostCSS] plugin that transforms rgba() values into hexadecimals. This can be useful for outputting CSS for old browsers like Internet Explorer 8.

```css
/* before */

.hero {
    background: rgba(153, 221, 153, 0.8);
    border: solid 1px rgba(100,102,103,.3);
}

/* after */

.hero {
    background: #99dd99;
    border: solid 1px #646667;
}
```

## Usage

Follow these steps to use [PostCSS RGBA Fallback].

Add [PostCSS RGBA Fallback] to your build tool:

```bash
npm install postcss-color-rgba-fallback --save-dev
```

#### Node

```js
require('postcss-color-rgba-fallback')({ /* options */ }).process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [PostCSS RGBA Fallback] as a PostCSS plugin:

```js
postcss([
    require('postcss-color-rgba-fallback')({ /* options */ })
]);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [PostCSS RGBA Fallback] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
    return gulp.src('./css/src/*.css').pipe(
        postcss([
            require('postcss-color-rgba-fallback')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./css')
    );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [PostCSS RGBA Fallback] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
    postcss: {
        options: {
            processors: [
                require('postcss-color-rgba-fallback')({ /* options */ })
            ]
        },
        dist: {
            src: 'css/*.css'
        }
    }
});
```

### Options

#### `properties`

Type: `Array`  
Default: `['background', 'background-color', 'color', 'border', 'border-bottom', 'border-bottom-color', 'border-color', 'border-left', 'border-left-color', 'border-right', 'border-right-color', 'border-top', 'border-top-color', 'outline', 'outline-color']`

Specifies the properties which will convert rgba values.

#### `method`

Type: `String`  
Default: `'replace'`

##### `replace`
Replace any rgba values with hexadecimal values.
```css
/* before */

:root {
    color: red;
}

/* after */

html {
    color: red;
}
```

##### `copy`
Copy any rgba values to a cloned property as hexadecimal.
```css
/* before */

:root {
    color: red;
}

/* after */

html {
    color: red;
}

:root {
    color: red;
}
```

##### `warn`
Warn when an rgba value is used.

#### `filter`

Type: `Boolean`  
Default: `false`

Specifies the background rgba values will use the old Internet Explorer proprietary filter.

```css
/* before */

.background {
    background-color: rgba(255, 0, 0, .5);
}

/* after */

.background {
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#80ff0000',endColorstr='#80ff0000');
}
```

The `filter` option will be ignored if the `method` option is set as `warn`.

[ci]: https://travis-ci.org/postcss/postcss-color-rgba-fallback
[ci-img]: https://travis-ci.org/postcss/postcss-color-rgba-fallback.svg
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS RGBA Fallback]: https://github.com/postcss/postcss-color-rgba-fallback
