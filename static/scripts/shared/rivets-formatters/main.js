define(function (require) {
	'use strict';
	var rivets = require('rivets');
	rivets.formatters.date = require('templates/helpers/dateFormat');

	return rivets;
});
