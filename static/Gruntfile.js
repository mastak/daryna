'use strict';

/*jshint node:true*/

module.exports = function (grunt) {
	function getConfig(debug) {
		return function (fs, fd, done) {
			var requirejsConfig = require('./scripts/requirejs-config.json'),
				extend = require('extend');
			requirejsConfig = extend(true, {
				baseUrl: '/static/scripts/',
				config: {
					'shared/analytics/main': {
						debug: debug
					},

					'checkio': {
						static: debug ? '/static/' : STATIC_URL,
						debug: debug
					},

					'error': {
						debug: debug
					}
				}
			}, requirejsConfig);
			if (debug) {
				requirejsConfig.waitSeconds = 300;
				requirejsConfig.deps = requirejsConfig.deps || [];
				requirejsConfig.deps.push('//localhost:8001/livereload.js');
			} else {
				requirejsConfig.baseUrl = STATIC_URL;
			}
			fs.writeSync(fd, 'requirejs.config(\n' +
				JSON.stringify(requirejsConfig, null, '\t') +
			');\n');
			done();
		};
	}

	var BUILD = grunt.option('build') || grunt.template.today('yymmddHHMMss'),

		STATIC_URL = (grunt.option('hostname') ? '//' + grunt.option('hostname') : '') + '/static/' + BUILD + '/';

	/*
	 * configure tasks
	 */

	grunt.config.init({
		clean: {
			all: {
				src: [
					'<%= copy.production.dest %>',
					'styles/*.css'
				]
			}
		},

		jshint: {
			all: {
				options: {
					jshintrc: '.jshintrc',
					ignores: ['scripts/vendor/**', '<%= requirejs.production.options.mainConfigFile %>']
				},
				expand: true,
				src: [
					__filename,
					'scripts/**/*.js'
				]
			}
		},

		copy: {
			static: {
				expand: true,
				files: [
					{
						src: [
							'fonts/**',
							'images/**'
						],
						dest: '<%= copy.production.dest %>' + BUILD + '/'
					},
					{
						src: [
							'fonts/**',
							'images/**'
						],
						dest: '<%= copy.production.dest %>' + BUILD + '/styles/'
					}
				]
			},

			production: {
				src: [
					'crossdomain.xml',
					'robots.txt'
				],
				dest: 'build/'
			}
		},

		htmlmin: {
			production: {
				options: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true
				},
				src: 'index.html',
				dest: '<%= copy.production.dest %><%= htmlmin.production.src %>'
			}
		},

		stylus: {
			production: {
				options: {
					paths: ['styles', 'scripts/vendor/bootstrap-stylus/stylus']
				},
				files: [{
					expand: true,
					cwd: 'styles',
					dest: 'styles',
					src: ['main.styl'],
					ext: '.css'
				}]
			},

			development: {
				options: {
					compress: false,
					firebug: true,
					paths: '<%= stylus.production.options.paths %>'
				},
				files: '<%= stylus.production.files %>'
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Chrome >= 26',
					'Firefox >= 20',
					'Safari >= 6',
					'Opera >= 15',
					'IE >= 10'
				]
			},
			all: {
				src: 'styles/*.css'
			}
		},

		csso: {
			production: {
				options: {
					restructure: false
				},
				files: [{
					src: 'styles/*.css',
					dest: '<%= copy.static.files[0].dest %>',
					expand: true,
					ext: '.css'
				}]
			}
		},

		svgmin: {
			production: {
				expand: true,
				src: 'build/**/*.svg'
			}
		},

		concat: {
			html: {
				options: {
					process: function (src) {
						return src
							.replace(/\/static\/styles\//g, STATIC_URL + 'styles/')
							.replace(/\/static\/images\//g, STATIC_URL + 'images/')
							.replace(/\/static\/scripts\//g, STATIC_URL);
					}
				},
				src: '<%= htmlmin.production.dest %>',
				dest: '<%= htmlmin.production.dest %>'
			},

			styles: {
				options: {
					process: function (src) {
						return src
							.replace(/(url\()\.\.\//g, '$1');
					}
				},
				files: '<%= csso.production.files %>'
			}
		},

		python: {
			production: {
				dest: '../settings/cdn.py',
				options: {
					process: function () {
						return [
							'from settings.common import path',
							'',
							'STATIC_URL = "/static/"',
							'BUILD = ' + BUILD,
							'STATIC_PATH = path("static", "build")'
						].join('\n');
					}
				}
			},

			development: {
				dest: '<%= python.production.dest %>',
				options: {
					process: function () {
						return [
							'from settings.common import path',
							'',
							'STATIC_URL = "/static/"',
							'STATIC_PATH = path("static")'
						].join('\n');
					}
				}
			}
		},

		requirejs: {
			production: {
				options: {
					mainConfigFile: 'scripts/config.js',
					dir: '<%= copy.static.files[0].dest %>',

					modules: [
						{
							name: 'common',
							include: [
								'marionette',
								'moment',
								'rivets',
								'query-string',
								'hbs/handlebars',
								'shared/relational-model',
								'shared/user',
								'shared/messages',
								'shared/rivets-binders'
							]
						},
						{
							name: 'apps/user',
							exclude: ['common']
						}
					],

					baseUrl: 'scripts/',
					keepBuildDir: true,

					paths: {
						'data/request': 'empty:',
						'data/object': 'empty:',
						'data/config': 'empty:'
					}
				}
			}
		},

		'file-creator': {
			production: {
				'scripts/config.js': getConfig(false)
			},
			development: {
				'scripts/config.js': getConfig(true)
			}
		},

		bower: {
			all: {
				rjsConfig: '<%= requirejs.production.options.mainConfigFile %>',
				options: {
					exclude: [
						'requirejs',
						'underscore',
						'require-handlebars-plugin'
					],
					transitive: true
				}
			}
		},

		watch: {
			options: {
				interval: 250,
				livereload: {
					port: 8001
				}
			},

			livereload: {
				files: [
					'<%= htmlmin.production.src %>',
					'scripts/**.js'
				]
			},

			stylus: {
				files: ['styles/**/*.styl'],
				tasks: ['stylus:development', 'autoprefixer:all']
			},

			'file-creator': {
				files: 'scripts/requirejs-config.json',
				tasks: 'requirejs-config'
			}
		}
	});

	/*
	 * registration out tasks
	 */

	grunt.task.registerMultiTask('python', 'Saves variables to the python settings file', function () {
		grunt.file.write(this.data.dest, this.options().process());

	});

	/*
	 * загрузка внешних задач
	 */

	require('load-grunt-tasks')(grunt);

	/*
	 * регистрация внешних задач
	 */

	grunt.task.registerTask('requirejs-config', [
		'file-creator:development',
		'bower'
	]);

	grunt.task.registerTask('default', [
		'stylus:development', 'autoprefixer:all',
		'python:development',
		'requirejs-config'
	]);

	grunt.task.registerTask('development', [
		'clean',
		'jshint',
		'default',
		'watch'
	]);

	grunt.task.registerTask('production', [
		'clean',
		'jshint',
		'copy',
		'htmlmin:production',
		'stylus:production', 'autoprefixer:all', 'csso:production',
		'svgmin:production',
		'python:production',
		'file-creator:production',
		'bower',
		'requirejs:production',
		'concat'
	]);
};
