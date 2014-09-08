define(function () {
	'use strict';

	return function (next) {
		next = next || window.location.href;
		window.location.href = '/profile/login/?next=' + next;
	};
});
