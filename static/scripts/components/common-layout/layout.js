define(function (require) {
	'use strict';
	var Marionette = require('marionette');

	return Marionette.LayoutView.extend({
//		regions: {
//			content: '.site-content',
//			sidebar: '#widget',
//			modal: '.modal-container'
//		},

		titleRoot: ':: Daryna',
		currentTitle: '',

		setTitle: function (title) {
			this.currentTitle = title;
			this.setDocumentTitle();
			this.trigger('set:title', title);
		},

		setDocumentTitle: function () {
			document.title = [this.currentTitle, this.titleRoot].join('');
		}
	});
});
