define(function (require) {
	'use strict';
	var _ = require('underscore'),
		$ = require('jquery'),
		rivets = require('rivets');
	rivets.binders['live-value'] = _.extend(rivets.binders.value, {
		bind: function (el) {
			$(el).on('keyup', this.publish);
		},
		unbind: function (el) {
			$(el).off('keyup', this.publish);
		}
	});

	return {};
});
