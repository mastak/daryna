define(function (require) {
	'use strict';

	var Marionette = require('marionette');

	return Marionette.Controller.extend({

			login: function () {
				require(['apps/user/views/login/controller'], function (LoginController) {
					LoginController.login();
				});
			}

		});
});
