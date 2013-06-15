var path = require('path'),
    fs = require('fs');


// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // The jshint option
    jshint: { // grunt-contrib-jshint
      all: ['index.js', 'Gruntfile.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jsvalidate: { // grunt-jsvalidate
      files: ['index.js']
    },

    jsonlint: { // grunt-jsonlint
      package: {
        src: [ 'package.json' ]
      }
    },

    simplemocha: { // grunt-simple-mocha
      options: {
        compilers: 'coffee:coffee-script',
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: { src: ['test/**/*.spec.coffee'] }
    },

    mochacov: { // grunt-mocha-cov
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci',
            repoToken: 'MFH5LUD9VUE4AVhyu3QWHvdnrecI5377W'
          }
        }
      },
      coverage: {
        options: {
          coverage: true,
          reporter: 'html-cov'
        }
      },
      test: {
        options: {
          reporter: 'spec'
        }
      },
      all: { src: ['test/**/*.spec.coffee'] },
      options: {
        ui: 'bdd',
        timeout: 3000,
        ignoreLeaks: false,
        compilers: ['coffee:coffee-script']
      }
    }

  });

  // Grunt task for development
  grunt.registerTask('default', ['jsvalidate']);

  // Run server-side tests
  grunt.registerTask('test', ['jshint', 'jsvalidate', 'jsonlint', 'mochacov:test']);
  grunt.registerTask('travis', ['mochacov:test', 'mochacov:coveralls']);
};
