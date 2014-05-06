module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			main: [
				'Gruntfile.js',
				'js/app/**/*.js'
			]
		},
		stylus: {
			main: {
				expand: true,
				cwd: 'stylus',
				src: ['*.styl'],
				dest: 'css/app',
				ext: '.css'
			}
		},
		watch: {
			css: {
				files: ['stylus/**/*.styl'],
				tasks: ['stylus'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.registerTask('test', 'jshint');
	grunt.registerTask('default', []);
};
