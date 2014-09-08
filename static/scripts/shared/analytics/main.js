define(function (require, exports, module) {
	'use strict';
	function gaLoaded(exportedGa) {
		ga = exportedGa;
		isReady = true;
		_(queue).each(function (args) {
			gaWrapper.apply(null, args);
		});
	}

	function gaOperation(operation) {
		return gaWrapper.bind(null, operation);
	}

	function gaWrapper() {
		var args = Array.prototype.slice.apply(arguments),
			gaCall;
		if (!isReady) {
			queue.push(args);
			return;
		}
		if (checkio.debug) {
			gaCall = 'ga(' + _(args).filter().map(JSON.stringify).join(', ') + ');';
			console.log('Google Analytics:', gaCall);
		} else {
			ga.apply(null, arguments);
		}
	}
	var _ = require('underscore'),
		checkio = require('checkio'),
		config = module.config(),
		isReady = false,
		queue = [],
		ga = null,
		Analytics = {
			ga: gaWrapper,
			create: gaOperation('create'),
			variable: gaOperation('set'),
			send: gaOperation('send'),
			require: gaOperation('require'),

			trackEvent: function (options) {
				return this.send('event', options.category, options.action, options.optLabel, options.optValue);
			},

			social: function (options) {
				var params = _.extend({
					hitType: 'social'
				}, options);
				return this.send(params);
			},

			pageView: function () {
				var args = Array.prototype.slice.apply(arguments);
				args.unshift('pageview');
				return this.send.apply(this, args);
			},

			dimension: function (dimensionNumber, value) {
				return this.variable('dimension' + dimensionNumber, value);
			},

			setUserId: function (userId) {
				return this.dimension(config.dimensions.userId, userId);
			},

			setLevel: function (level) {
				return this.dimension(config.dimensions.level, level);
			},

			beforeStart: function (beforeStartCallback) {
				this.beforeStartCallback = beforeStartCallback;
			},

			start: function (options) {
				this.create(config.accountId, options || 'auto');
				if (_.isFunction(this.beforeStartCallback)) {
					this.beforeStartCallback();
				}
				this.pageView();
				this.require('displayfeatures');
				this.require('linkid', 'linkid.js');
			}
		};
	if (checkio.debug) {
		gaLoaded();
	} else {
		requirejs(['//www.google-analytics.com/analytics.js'], gaLoaded);
	}
	module.exports = Analytics;

});
