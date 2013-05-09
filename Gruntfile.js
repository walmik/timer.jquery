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
        watch: {
          scripts: {
            files: ['src/timer.jquery.js'],
            tasks: ['uglify'],
            options: {
              nospawn: true
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //register default task
    grunt.registerTask('default', 'watch');
}