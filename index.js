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

  var oldie = options.oldie
  if (oldie === true) {
    oldie = [
      "background-color",
      "background",
    ]
  }
  else if (!Array.isArray(oldie)) {
    oldie = false
  }

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

      var hex
      var alpha
      var value = valueParser(decl.value).walk(function(node) {
        var nodes = node.nodes
        if (node.type === "function" && node.value === "rgba") {
          try {
            hex = rgbToHex.apply(null, [
              parseInt(nodes[0].value, 10),
              parseInt(nodes[2].value, 10),
              parseInt(nodes[4].value, 10),
            ])
            node.type = "word"
            node.value = "#" + hex
            alpha = parseFloat(nodes[6].value)
          }
          catch (e) {
            return false
          }
          return false
        }
      }).toString()

      if (value !== decl.value) {
        decl.cloneBefore({value: value})

        if (
          oldie && oldie.indexOf(decl.prop) !== -1 &&
          0 < alpha && alpha < 1
        ) {
          hex = "#" + Math.round(alpha * 255).toString(16) + hex
          var ieFilter = [
            "progid:DXImageTransform.Microsoft.gradient(startColorStr=",
            hex,
            ",endColorStr=",
            hex,
            ")",
          ].join("")
          var gteIE8 = postcss.decl({
            prop: "-ms-filter", value: "\"" + ieFilter + "\"",
          })
          var ltIE8 = postcss.decl({
            prop: "filter", value: ieFilter,
          })

          decl.parent.insertBefore(decl, gteIE8)
          decl.parent.insertBefore(decl, ltIE8)
        }
      }
    })
  }
})
