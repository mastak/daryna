define(function (require) {
	'use strict';
	var requestUser = require('shared/user'),
		redirectLogin = require('./redirect-login');

	return function (func) {
		return function () {
			if (requestUser.get('isAuthenticated')) {
				return func.apply(this, arguments);
			}
			return redirectLogin();
		};
	};
});
