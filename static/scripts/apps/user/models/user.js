define(function (require) {
	'use strict';
	var RelationalModel = require('shared/relational-model');
	return RelationalModel .extend({
		getTimestampOffset: function () {
			return (new Date().getTime() / 1000 - this.get('timestamp')) | 0;
		}
	});
});
