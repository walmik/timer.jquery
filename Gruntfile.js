module.exports = function(grunt) {
	var commonTasks = ['jscs', 'jshint', 'concat', 'uglify'];
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jscs: {
			src: ['Gruntfile.js', 'src/*.js', 'test/utils-test.js', 'test/basicTimerSpec', 'test/timedFuncSpec.js']
		},

		jshint: {
			all: ['Gruntfile.js', 'src/*.js', 'test/utils-test.js', 'test/basicTimerSpec', 'test/timedFuncSpec.js']
		},

		concat: {
			options: {
				banner: [
					'/*! <%= pkg.name %> <%= pkg.version %> <%=grunt.template.today("yyyy-mm-dd")%>*/\n',
					'(function($) {\n'
				].join(''),
				footer: '} (jQuery));'
			},
			dist: {
				src: [
					'src/constants.js',
					'src/utils.js',
					'src/Timer.js',
					'src/index.js'
				],
				dest: 'dist/timer.jquery.js'
			}
		},

		uglify: {
			dist: {
				src: 'dist/timer.jquery.js',
				dest: 'dist/timer.jquery.min.js'
			}
		},

		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: commonTasks,
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', commonTasks);
};
