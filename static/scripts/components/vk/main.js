define(function (require, exports, module) {
	'use strict';

	var Marionette = require('marionette'),
		queryString = require('query-string'),
		config = module.config();

	return Marionette.Controller.extend({

		auth: function () {
			var popupWindow;

			console.log(config.urlAuth);
			console.log(config.paramsAuth);
			popupWindow = this.popup(config.urlAuth + '?' + queryString.stringify(config.paramsAuth));
			console.log(popupWindow);
		},

		popup: function(url) {
			var specs,
				w = 400,
				h = 150,
				windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
			    windowHight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
				left = (windowWidth/2)-(w/2),
  				top = (windowHight/2)-(h/2);

			specs = [
				'status=no',
				'resizable=no',
				'menubar=no',
				'width=' + w,
				'height=' + h,
				'top=' + top,
				'left=' + left
			].join(',');
			return window.open(url, 'Auth', specs);
		}

	});
});
