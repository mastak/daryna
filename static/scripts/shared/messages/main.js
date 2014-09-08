define(function (require, exports) {
	'use strict';
	function message(type) {
		return function (text) {
			noty({
				text: text ? text.toString() : '',
				type: type,
				timeout: 3000
			});
		};
	}
	var noty = require('noty'),
		$ = require('jquery');
	$.noty.defaults.layout = 'topRight';

	exports.success = message('success');
	exports.error = message('error');
	exports.warning = message('warning');
});
