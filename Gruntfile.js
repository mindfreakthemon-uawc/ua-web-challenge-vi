var path = require('path');

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			main: {
				options: {
					port: 9000,
					keepalive: true,
					base: 'root'
				}
			}
		},

		jshint: {
			main: [
				'Gruntfile.js',
				'src/js/**/*.js'
			]
		},

		clean: ['root'],

		jade: {
			main: {
				expand: true,
				cwd: 'src/html',
				src: ['**/*.jade'],
				dest: 'root',
				ext: '.html'
			},
			templates: {
				files: {
					'root/js/templates.js': 'src/templates/**/*.jade'
				},
				options: {
					amd: true,
					client: true,
					processName: function (name) {
						return path.basename(name, '.jade');
					}
				}
			}
		},
		stylus: {
			main: {
				expand: true,
				cwd: 'src/styles',
				src: ['**/*.styl'],
				dest: 'root/css',
				ext: '.css'
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: 'src/js',
				src: ['**/*.js'],
				dest: 'root/js'
			},
			img: {
				expand: true,
				cwd: 'src/img',
				src: ['**/*.*'],
				dest: 'root/img'
			},
			lib: {
				expand: true,
				cwd: 'lib',
				src: ['**'],
				dest: 'root/lib'
			}
		},

		watch: {
			styles: {
				files: ['src/styles/**/*.styl'],
				tasks: ['stylus:main']
			},
			img: {
				files: ['src/img/**/*.*'],
				tasks: ['copy:img']
			},
			html: {
				files: ['src/html/**/*.jade'],
				tasks: ['jade:main']
			},
			templates: {
				files: ['src/templates/**/*.jade'],
				tasks: ['jade:templates']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['copy:main']
			},
			livereload: {
				files: ['root/**'],
				options: {
					livereload: true
				}
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			build: {
				tasks: ['stylus:main', 'jade:main', 'jade:templates', 'copy:main', 'copy:lib', 'copy:img']
			},
			watch: {
				tasks: ['watch:styles', 'watch:html', 'watch:templates', 'watch:js', 'watch:img', 'watch:livereload']
			},
			run: {
				tasks: ['concurrent:watch', 'connect:main']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('test', 'jshint');
	grunt.registerTask('default', ['clean', 'concurrent:build', 'concurrent:run']);
};
