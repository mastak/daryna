define(function (require) {
	'use strict';
	var User = require('shared/user');

	return {

		/* переводим таймштамп в относительное время */

		relative: function (timestamp) {
			var now = (new Date().getTime() / 1000 - User.getTimestampOffset()) | 0,
				future = timestamp > now,
				delta = Math.abs(timestamp - now),

				formats = [
					[60, 'just now', 'just now'],
					[60 * 2, '1 minute ago', '1 minute from now'],
					[60 * 60, 'minutes', 60],
					[60 * 60 * 2, '1 hour ago', '1 hour from now'],
					[60 * 60 * 24, 'hours', 60 * 60],
					[60 * 60 * 24 * 2, 'yesterday', 'tomorrow'],
					[60 * 60 * 24 * 7, 'days', 60 * 60 * 24],
					[60 * 60 * 24 * 7 * 2, 'last week', 'next week'],
					[60 * 60 * 24 * 7 * 4, 'weeks', 60 * 60 * 24 * 7],
					[60 * 60 * 24 * 7 * 4 * 2, 'last month', 'next month'],
					[60 * 60 * 24 * 7 * 4 * 12, 'months', 60 * 60 * 24 * 7 * 4],
					[60 * 60 * 24 * 7 * 4 * 12 * 2, 'last year', 'next year'],
					[60 * 60 * 24 * 7 * 4 * 12 * 100, 'years', 60 * 60 * 24 * 7 * 4 * 12]
				],

				index = 0,
				length = formats.length,
				current;

			while (index < length) {
				if (delta < (current = formats[index++])[0]) {
					break;
				}
			}

			if (typeof current[2] === 'string') {
				return current[future ? 2 : 1];
			}

			return (delta / current[2] | 0) + ' ' + current[1] + ' ' + (future ? 'from now' : 'ago');
		},

		/* переводим таймштамп в точное время*/

		exact: function (timestamp) {
			return new Date(timestamp * 1000).toJSON().split(/[^\d\-:]/, 2).join(' ');
		}

	};
});
