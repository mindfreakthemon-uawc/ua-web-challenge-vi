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
				cwd: 'src/jade',
				src: ['**/*.jade'],
				dest: 'root',
				ext: '.html'
			}
		},
		stylus: {
			main: {
				expand: true,
				cwd: 'src/stylus',
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
			lib: {
				expand: true,
				cwd: 'lib',
				src: ['**'],
				dest: 'root/lib'
			}
		},

		watch: {
			stylus: {
				files: ['src/stylus/**/*.styl'],
				tasks: ['stylus:main']
			},
			jade: {
				files: ['src/jade/**/*.jade'],
				tasks: ['jade:main']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['copy:main']
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			build: ['stylus:main', 'jade:main', 'copy:main', 'copy:lib'],
			watch: ['watch:stylus', 'watch:jade', 'watch:js'],
			run: ['concurrent:watch', 'connect:main']
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
