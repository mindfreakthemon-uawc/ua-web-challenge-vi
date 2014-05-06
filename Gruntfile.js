module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {},
		jshint: {
			main: [
				'Gruntfile.js',
				'js/app/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.registerTask('test', 'jshint');
	grunt.registerTask('default', []);
};
