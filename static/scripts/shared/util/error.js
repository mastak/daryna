define(function () {
	'use strict';

	window.onerror = function (message, file, line, column) {
		var about = [];

		if (file) {
			about.push('File: ' + file);
		}

		if (line) {
			about.push('Line: ' + line);
		}

		if (column) {
			about.push('Column: ' + column);
		}

		console.log(about.join('\n') + '\n\n' + message);
		return false;
	};

	/*
	 * error testing( Google Analytics )
	 */

	if (window.location.hash === '#test-error') {
		throw new Error('Test Error');
	}
});
