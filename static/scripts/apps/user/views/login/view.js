define(function (require) {
	'use strict';
	var Marionette = require('marionette'),
		template = require('hbs!./templates/view');

	return Marionette.ItemView.extend({
		template: template,

		events: {
			'click .authorization__buttons__login': 'authorization'
		},

		authorization: function () {
			return this;
		}
	});
});
