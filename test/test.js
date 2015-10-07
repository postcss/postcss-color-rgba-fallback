var path    = require('path');
var postcss = require('postcss');
var expect  = require('chai').expect;
var fs      = require('fs');
var debug   = false;

var plugin = require('../');

function test(name, opts, done, warnings) {
	var fixtureDir = './test/fixtures/';
	var baseName   = name.split(':')[0];
	var testName   = name.split(':').join('.');
	var inputPath  = path.resolve(fixtureDir + baseName + '.css');
	var expectPath = path.resolve(fixtureDir + testName + '.expect.css');
	var actualPath = path.resolve(fixtureDir + testName + '.actual.css');

	var inputCSS  = fs.readFileSync(inputPath, 'utf8');
	var expectCSS = fs.readFileSync(expectPath, 'utf8');

	warnings = warnings || 0;

	postcss([plugin(opts)]).process(inputCSS, {
		from: inputPath
	}).then(function (result) {
		var actualCSS = result.css;

		if (debug) fs.writeFileSync(actualPath, actualCSS);

		expect(actualCSS).to.eql(expectCSS);
		expect(result.warnings()).to.have.length(warnings);

		done();
	}).catch(function (error) {
		done(error);
	});
}

describe('postcss-color-rgba-fallback', function () {
	it('supports basic usage', function (done) {
		test('basic', {}, done);
	});

	it('supports "filter" option', function (done) {
		test('basic:filter', { filter: true }, done);
	});

	it('supports "properties" array', function (done) {
		test('basic:properties', { properties: ['background-color'] }, done);
	});

	it('supports "filter" option and "properties" array', function (done) {
		test('basic:filter.properties', { filter: true, properties: ['background-color'] }, done);
	});

	it('supports "copy" method', function (done) {
		test('basic:copy', { method: 'copy' }, done);
	});

	it('supports "warn" method', function (done) {
		test('basic:warn', { method: 'warn' }, done, 13);
	});
});
