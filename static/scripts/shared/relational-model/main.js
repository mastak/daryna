define(function (require) {
	'use strict';
	var _ = require('underscore'),
		Backbone = require('backbone');
	require('backbone-relational');

	return Backbone.RelationalModel.extend({
		constructor: function () {
			Backbone.RelationalModel.apply(this, arguments);
			this.on('sync', this.storeState, this);
			this.storeState();
		},

		storeState: function () {
			this._revertAttributes = _.clone(this.attributes);
			return this;
		},

		restoreState: function () {
			this.set(this._revertAttributes);
			return this;
		},

		hasChangedAttr: function (attr) {
			if (_.isUndefined(attr)) {
				return !_.isEqual(this.attributes, this._revertAttributes);
			}
			return !_.isEqual(this.attributes[attr], this._revertAttributes[attr]);
		}
	});
});
