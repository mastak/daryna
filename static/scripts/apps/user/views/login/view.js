define(function (require) {
	'use strict';
	var Marionette = require('marionette'),
		template = require('hbs!./templates/view'),
		Vkontakte = require('components/vk');

	return Marionette.ItemView.extend({
		template: template,
		className: 'authorization',

		events: {
			'click .authorization__social__vk': 'authorizationVk'
		},

		authorizationVk: function () {
			var vkontakte = new Vkontakte();
			vkontakte.auth();
			return this;
		}
	});
});
