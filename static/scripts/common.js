define(function (require, exports) {
	'use strict';
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
//		request = require('data/request'),
		commonLayout = require('components/common-layout');
//		oldSync = Backbone.sync;

	$.noConflict();
	_.noConflict();
	Backbone.noConflict();
//
//	Backbone.sync = function (method, model, options) {
//		options.beforeSend = function (xhr) {
//			xhr.setRequestHeader('X-CSRFToken', request.csrf);
//		};
//		return oldSync(method, model, options);
//	};
	exports.pageLayout = commonLayout();
});
