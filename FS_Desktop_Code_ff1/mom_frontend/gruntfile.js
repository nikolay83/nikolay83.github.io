/*
 * Copyright (c) 2015 TopCoder, Inc. All rights reserved.
 */
/**
 * Represents the grunt file
 * @author TCSASSEMBLER
 * @version 1.0
 */
"use strict";

module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({

        concat: {
            lib: {
                src: [
                    "app/lib/jquery/*.js",
                    "app/lib/angular/angular.js",
                    "app/lib/angular/angular-*.js",
                    "app/lib/angular/ng-*.js",
                    "app/lib/oauth.min.js",
                    "app/lib/underscore-min.js",
                    "app/lib/moment.min.js"
                ],
                dest: "app/prod/lib.js"
            },
            app: {
                src: ["app/js/**/*.js"],
                dest: "app/prod/app.js"
            }
        },

        jshint: {
            files: ["app/js/**/*.js"],
            options: {
                jshintrc: true
            }
        },
        
        watch: {
            scripts: {
                files: ["app/js/**/*.js"],
                tasks: [/*"jshint",*/ "concat"],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Tasks
    //uncomment jshint if you fix all errors
    //currently there is too many errors
    grunt.registerTask("default", [/*"jshint",*/ "concat"]);
    grunt.registerTask("dev", [/*"jshint",*/ "concat", "watch"]);
};

