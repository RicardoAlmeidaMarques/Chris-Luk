module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig ({
    watch: {
      files: ['sass/**'],
      tasks: ['sass'],
    },
    sass: {
      dev: {
        files: {
          'public/stylesheets/styles.css' : 'sass/styles.scss'
        }
      }
    },
    browserSync: {
      dev: {
          bsFiles: {
              src : [
                  'public/stylesheets/*.css',
                  'views/*.html',
                  'public/js/*.js',
                  'routes/*.js'
              ]
          },
          options: {
            watchTask: true,
            proxy: "localhost:3000"  
          }
      }
    }
  });

 
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync','watch']);
}