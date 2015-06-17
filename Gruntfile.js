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
			src: ['src/timer.jquery.js', 'test/timer.jquery.test.js'],
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

		// Start a connect server for qunit tests
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},

		// Run qunit tests with PhantomJS
		qunit: {
			all: {
				options: {
					urls: [
						'http://localhost:8000/test/timer.jquery.html'
					]
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/timer.jquery.js', 'test/timer.jquery.test.js'],
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
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//register default task
	grunt.registerTask('default', 'watch');
	grunt.registerTask('test', ['connect', 'qunit']);
}
