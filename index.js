/**
 * Module dependencies.
 */
var postcss = require("postcss")
var valueParser = require("postcss-value-parser")
var rgbToHex = require("rgb-hex")

/**
 * PostCSS plugin to transform rgba() to hexadecimal
 */
module.exports = postcss.plugin("postcss-color-rgba-fallback",
function(options) {
  options = options || {}

  var properties = options.properties || [
    "background-color",
    "background",
    "color",
    "border",
    "border-color",
    "outline",
    "outline-color",
  ]

  return function(style) {
    style.walkDecls(function(decl) {
      if (!decl.value ||
          decl.value.indexOf("rgba") === -1 ||
          properties.indexOf(decl.prop) === -1
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

      var value = transformRgba(decl.value)
      if (value !== decl.value) {
        decl.cloneBefore({value: value})
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
  return valueParser(string).walk(function(node) {
    var nodes = node.nodes
    if (node.type === "function" && node.value === "rgba") {
      node.type = "word"
      node.value = "#" + rgbToHex.apply(null, [
        parseInt(nodes[0].value, 10),
        parseInt(nodes[2].value, 10),
        parseInt(nodes[4].value, 10),
      ]).toUpperCase()
      return false
    }
  }).toString()
}
