define(function (require) {
	'use strict';

	var Marionette = require('marionette'),
		DarynaApp = require('app'),
		UserController = require('./controller'),
		UserRouter = require('./router'),
		app = new Marionette.Application();

	DarynaApp.addInitializer(function () {
		this.router = new UserRouter({
			controller: new UserController()
		});
	});

	DarynaApp.on('user:login', function () {
		DarynaApp.navigate('user/login/');
	});

	return app;
});
