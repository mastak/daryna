define(['common'], function(common) {
	'use strict';

	var Backbone = require('backbone'),
		Marionette = require('marionette'),
		_ = require('underscore'),
		pageLayout = common.pageLayout,
		DarynaApp = new Marionette.Application();

	pageLayout.addRegions({
		headerRegion: '#header-region',
		mainRegion: '#main-region',
		footerRegion: '#main-region'
	});

	DarynaApp.navigate = function(route,  options){
		Backbone.history.navigate(route, _.extend({trigger: true}, options));
	};

	DarynaApp.getCurrentRoute = function () {
		return Backbone.history.fragment;
	};

	DarynaApp.startSubApp = function (appName, args) {
		var currentApp = appName ? DarynaApp.module(appName) : null;
		if (DarynaApp.currentApp === currentApp) {
			return;
		}

		if (DarynaApp.currentApp){
			DarynaApp.currentApp.stop();
		}

		DarynaApp.currentApp = currentApp;
		if(currentApp){
			currentApp.start(args);
		}
	};

	DarynaApp.on('start', function() {
		if(Backbone.history) {
			require(['apps/user'], function () {
				Backbone.history.start({
					pushState: true
				});
				if(DarynaApp.getCurrentRoute() === ''){
					DarynaApp.trigger('user:login');
				}
		  });
		}
	});

	DarynaApp.reqres.setHandler('pageLayout', function () {
		return pageLayout;
	});

	return DarynaApp;
});
