module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%=grunt.template.today("yyyy-mm-dd")%>*/'
			},
			dist: {
				src: ['src/timer.jquery.js'],
				dest: 'dist/timer.jquery.min.js'
			},
		},

		// Implement coding guidelines
		jscs: {
			src: ['src/timer.jquery.js', 'test/timer.jquery.spec.js'],
			options: {
				config: '.jscsrc'
			}
		},

		jshint: {
			all: {
				src: ['src/timer.jquery.js'],
				options: {
					jshintrc: '.jshintrc'
				},
				globals: {
					exports: true
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			continuous: {
				configFile: 'karma.conf.js',
				watch: false,
				singleRun: true,
				browsers: ['PhantomJS']
			}
		},

		watch: {
			scripts: {
				files: ['src/timer.jquery.js', 'test/timer.jquery.spec.js'],
				tasks: ['jscs', 'jshint', 'uglify'],
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks('grunt-contrib-watch');

	//register default task
	grunt.registerTask('default', 'watch');
	grunt.registerTask('test', ['karma:continuous']);
}
