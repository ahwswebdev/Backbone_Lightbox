module.exports = function (grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'css/backbone-lightbox.css': 'sass/lightbox.scss'
        }
      }
    },
    jshint: {
      options: {
        globals: {
          'jQuery': true,
          'Backbone': true,
          '_': true
        }
      },
      all: ['backbone-lightbox.js']
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
      }
    },
    watch: {
      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass:dist']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['sass', 'jshint']);
  grunt.registerTask('unit', ['karma:unit']);
};
