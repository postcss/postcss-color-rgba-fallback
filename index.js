/**
 * Module dependencies.
 */
var postcss = require("postcss")
var parser = require("postcss-value-parser")

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

      decl.cloneBefore({
        value: parser(decl.value).walk(function(node) {
          if (node.type === "function" && node.value === "rgba") {
            node.value = "#" + node.nodes.filter(function(node) {
              return node.type === "word"
            }).slice(0, 3).map(function(node) {
              return ("0" + parseFloat(node.value).toString(16)).slice(-2)
            }).join("")
            node.type = "word"
          }
        }).toString(),
      })
    })
  }
})
