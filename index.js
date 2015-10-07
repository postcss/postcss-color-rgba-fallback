var parser  = require('postcss-value-parser');
var postcss = require('postcss');

module.exports = postcss.plugin('postcss-color-rgba-fallback', function (opts) {
	var method = opts && /^(copy|warn)$/.test(opts.method) ? opts.method : 'replace';
	var props  = opts && opts.properties || ['background', 'background-color', 'color', 'border', 'border-bottom', 'border-bottom-color', 'border-color', 'border-left', 'border-left-color', 'border-right', 'border-right-color', 'border-top', 'border-top-color', 'outline', 'outline-color'];
	var filter = opts && opts.filter;

	return function (css, result) {
		css.walkRules(function (rule) {
			var cache = {};

			rule.nodes.filter(function (decl) {
				// assure property is cached
				cache[decl.prop] = cache[decl.prop] || 0;

				// count each time property is cached
				++cache[decl.prop];

				// keep valid, non-repeated, rgba-containing properties
				return cache[decl.prop] === 1 && props.indexOf(decl.prop) !== -1 && /rgba/i.test(decl.value);
			}).filter(function (decl) {
				// keep uncaught non-repeated properties
				return cache[decl.prop] === 1;
			}).forEach(function (decl) {
				// transpile rgba values
				var value = parser(decl.value).walk(function (node) {
					if (node.type === 'function' && node.value === 'rgba') {
						var rgba = node.nodes.filter(function (word) {
							return word.type === 'word';
						}).map(function (word, index) {
							return (0 + Math.round(word.value * (index > 2 ? 255 : 1)).toString(16)).slice(-2);
						});

						node.value = filter && /^background/i.test(decl.prop) ?
						'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'#@\',endColorstr=\'#@\')'.replace(/@/g, rgba.slice(-1).concat(rgba.slice(0, -1)).join('')) :
						'#' + rgba.slice(0, 3).join('');

						node.type  = 'word';
					}
				});

				if (value !== decl.value) {
					if (method === 'warn') result.warn('rgba() detected', { node: decl });
					else if (method === 'copy') decl = decl.cloneBefore({ value: value });
					else decl.value = value;

					if (filter && method !== 'warn' && /^background/.test(decl.prop)) decl.prop = 'filter';
				}
			});
		});
	};
});
