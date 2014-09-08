define(function (require) {
	'use strict';

	function getCurrentPathname() {
		var fragment = Backbone.history.getFragment(),
			questionMarkIndex = fragment.indexOf('?');
		if (questionMarkIndex !== -1) {
			fragment = fragment.slice(0, questionMarkIndex);
		}
		return fragment;
	}

	function navigate(queryParams) {
		var fragment = getCurrentPathname(),
			url = [
				fragment,
				queryString.stringify(queryParams)
			].join('?');
		Backbone.history.navigate(url, {
			trigger: true
		});
	}

	var Backbone = require('backbone'),
		_ = require('underscore'),
		queryString = require('query-string');

	return {
		getParam: function (param) {
			var queryParams = queryString.parse(window.location.search);
			if (param) {
				return queryParams[param];
			}
			return queryParams;
		},

		/**
		 * Sets the query parameter or parameters to the current location
		 * and navigates history and triggers the Backbone.navigate event.
		 * @example
		 *   // sets query arg 'a' to 'b'
		 * query.setParam('a', 'b')
		 *   // sets query args 'a' to 'b' and 'c' to 'd'
		 * query.setParam({a: 'b', c: 'd'})
		 *   // if one argument is passed and it's a string, the result is the same
		 *   // as for the previous example:
		 * query.setParam('?a=b&c=d')
		 * @param {String|Object} key
		 * @param {String} [value]
		 */
		setParam: function (key, value) {
			var queryParams = this.getParam();
			if (arguments.length === 1) {
				if (_.isString(key)) {
					key = queryString.parse(key);
				}
				if (_.isObject(key)) {
					queryParams = _.extend(queryParams, key);
				}
			} else {
				queryParams[key] = value;
			}
			queryParams = _.omit(queryParams, function (value) {
				return _.isUndefined(value);
			});
			navigate(queryParams);
			return this;
		}
	};
});
