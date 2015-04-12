'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js','**/*.js', '!node_modules/**']
};
var createTestData = require('./createTestData');

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint', 'validate']);
  //validate task.
  grunt.registerTask('validate', ['env:test', 'jshint']);

  grunt.registerTask('createtestdata', function() {
    var done = this.async();
    createTestData.initData(done);
  });
};