define(function (require) {
	'use strict';
	var Marionette = require('marionette');

	return Marionette.Region.extend({
		attachHtml: function () {},

		show: function (view) {
			if (!this.$el || !this.$el.length) {
				return this;
			}
			view.setElement(this.el);
			return Marionette.Region.prototype.show.apply(this, arguments);
		}
	});
});
