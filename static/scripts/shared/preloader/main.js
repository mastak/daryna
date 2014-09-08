define(function (require) {
	'use strict';
	var Marionette = require('marionette'),
		template = require('hbs!./templates/preloader');

	return Marionette.ItemView.extend({
		template: template
	});
});
