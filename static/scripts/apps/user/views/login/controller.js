define(function (require) {
	'use strict';

	var DarynaApp = require('app'),
		UserLoginView = require('./view');

	return {
		login: function () {
			var pageLayout = DarynaApp.request('pageLayout'),
				userLoginView = new UserLoginView();
			pageLayout.mainRegion.show(userLoginView);
		}
	};
});
