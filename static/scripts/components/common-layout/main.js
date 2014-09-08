define(function (require) {
	'use strict';
	var Layout = require('./layout');
//		MenuSlider = require('components/menu-slider'),
//		ShareWidget = require('components/share-widget-base');

	return function (el) {
		var layout = new Layout({
			el: el || 'body'
		});
//		layout.menuSlider.show(new MenuSlider(), {
//			preventDestroy: true
//		});
//		layout.shareWidget.show(new ShareWidget(), {
//			preventDestroy: true
//		});
		return layout;
	};
});
