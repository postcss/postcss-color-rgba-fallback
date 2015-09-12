/**
 * Module dependencies.
 */
var postcss = require("postcss")
var objectAssign = require("object-assign")
var rgbaRegex = require("rgba-regex")
var colorString = require("color-string")

/**
 * PostCSS plugin to transform rgba() to hexadecimal
 */
module.exports = postcss.plugin("postcss-color-rgba-fallback",
function(options) {
  options = objectAssign({}, {
    oldie: false,
    properties: [
      "background-color",
      "background",
      "color",
      "border",
      "border-color",
      "outline",
      "outline-color",
    ],
    oldieProperties: [
      "background-color",
      "background",
    ],
  }, options)

  return function(style) {
    style.walkDecls(function(decl) {
      if (!decl.value ||
          decl.value.indexOf("rgba") === -1 ||
          options.properties.indexOf(decl.prop) === -1
      ) {
        return
      }

      // if previous prop equals current prop
      // no need fallback
      if (
        decl.prev() &&
        decl.prev().prop === decl.prop
      ) {
        return
      }

      var fallback = transformRgba(decl.value)
      if (fallback) {
        decl.cloneBefore({value: fallback})
      }

      if (!options.oldie ||
          options.oldieProperties.indexOf(decl.prop) === -1
      ) {
        return
      }

      var ieFilter = formatIeFilter(decl.value, fallback)

      if (ieFilter) {
        var gteIE8 = postcss.decl({prop: "-ms-filter", value: quote(ieFilter)})
        var ltIE8 = postcss.decl({prop: "filter", value: ieFilter})

        decl.parent.insertBefore(decl, gteIE8)
        decl.parent.insertBefore(decl, ltIE8)
      }
    })
  }
})

/**
 * transform rgba() to hexadecimal.
 *
 * @param  {String} string declaration value
 * @return {String}        converted declaration value to hexadecimal
 */
function transformRgba(string) {
  var value = rgbaRegex().exec(string)

  if (!value) {
    return
  }

  var rgb = colorString.getRgb(value[0])
  var hex = colorString.hexString(rgb)
  hex = string.replace(rgbaRegex(), hex)

  return (hex)
}

/**
 * Format old IE filter value.
 *
 * @param  {String} value    rgba raw value
 * @param  {String} fallback hex converted value
 * @return {String}          formatted IE filter
 */
function formatIeFilter(value, fallback) {
  var matches = rgbaRegex().exec(value)

  if (!matches) {
    return
  }

  var alpha = matches[4]

  if (!alpha || alpha === "1") {
    return
  }

  var hex = fallback.replace("#", "#" + Math.round(255 * alpha).toString(16))

  return ("progid:DXImageTransform.Microsoft.gradient(startColorStr="
          + hex + ", endColorStr=" + hex + ")")
}

/**
 * Force double quote a string.
 *
 * @param  {String} str input string
 * @return {String}     double quoted string
 */
function quote(str) {
  return ("\"" + str + "\"")
}
