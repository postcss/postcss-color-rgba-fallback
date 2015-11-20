var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) {
  return "test/" + name + ".css"
}
function read(name) {
  return fs.readFileSync(name, "utf8")
}

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var actual = postcss().use(plugin(opts)).process(read(postcssOpts.from)
  , postcssOpts).css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual, expected, msg)
}

test("hex", function(t) {
  compareFixtures(t, "rgba-fallback", "should transform rgba")
  compareFixtures(t, "rgba-double-fallback", "should transform rgba")
  compareFixtures(t, "no-rgba-fallback", "should not transform rgba")
  compareFixtures(t, "rgba-fallback-option", "should transform rgba in shadow",
    {
      properties:["box-shadow"],
    })
  compareFixtures(t, "rgba-background-fallback", "should transform background",
    {
      backgroundColor:[255,255,255],
    })
  compareFixtures(t, "rgba-oldie-fallback", "should add old IE filters",
    {
      oldie: true,
    })
  t.end()
})
