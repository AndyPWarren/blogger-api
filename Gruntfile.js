"use strict";

var _ = require('lodash');
var path = require('path');

module.exports = function (grunt){

    var devFiles = _.flatten(_.map(grunt.file.expand('./tests/**/*.spec.dev.js')));

    // Load the include-all library in order to require all of our grunt
    // configurations and task registrations dynamically.
    var includeAll;
    try {
        includeAll = require('include-all');
    } catch (e0) {
        try {
            includeAll = require('sails/node_modules/include-all');
        }
        catch(e1) {
            console.error('Could not find `include-all` module.');
            console.error('Skipping grunt tasks...');
            console.error('To fix this, please run:');
            console.error('npm install include-all --save`');
            console.error();

            grunt.registerTask('default', []);
            return;
        }
    }


    /**
	 * Loads Grunt configuration modules from the specified
	 * relative path. These modules should export a function
	 * that, when run, should either load/configure or register
	 * a Grunt task.
	 */
    function loadTasks(relPath) {
        return includeAll({
            dirname: require('path').resolve(__dirname, relPath),
            filter: /(.+)\.js$/
        }) || {};
    }

    /**
	 * Invokes the function from a Grunt configuration module with
	 * a single argument - the `grunt` object.
	 */
    function invokeConfigFn(tasks) {
        for (var taskName in tasks) {
            if (tasks.hasOwnProperty(taskName)) {
                tasks[taskName](grunt);
            }
        }
    }




    // Load task functions
    var taskConfigurations = loadTasks('./tasks/config'),
        registerDefinitions = loadTasks('./tasks/register');

    // (ensure that a default task exists)
    if (!registerDefinitions.default) {
        registerDefinitions.default = function (grunt) { grunt.registerTask('default', []); };
    }

    // Run task functions to configure Grunt.
    invokeConfigFn(taskConfigurations);
    invokeConfigFn(registerDefinitions);

//    grunt.initConfig({
//
//        pkg: grunt.file.readJSON("package.json"),
//
//        config: {
//            appDir: "api/",
//            testDir: "tests/",
//            nodeDir: "node_modules/",
//            docsDir: "docs/",
//            coverageDir: "coverage/",
//        },
//
//        watch: {
//            options: {
//                nospawn: false,
//                livereload: true
//            },
//            javascript: {
//                files: [
//                    "<%= config.appDir %>*.js",
//                    "<%= config.appDir %>**/*.js",
//                    "<%= config.appDir %>**/**/*.js",
//                    "<%= config.testDir %>*.js",
//                    "<%= config.testDir %>**/*.js",
//                    "<%= config.testDir %>**/**/*.js"
//                ],
//                tasks: ["test:dev"]
//            }
//        },
//
//        jshint: {
//            options: {
//                jshintrc: ".jshintrc"
//            },
//            dist: {
//                src: ["<%= config.appDir %>**/*.js"]
//            }
//        },
//
//        // testing
//        mocha_istanbul: {
//            options: {
//                coverage: true,
//                coverageFolder: "<%= config.coverageDir %>",
//                reportFormats: ["cobertura","lcov"],
//                root: "api/",
//                timeout: 15000,
//                mochaOptions: {
//                    reporter: "spec",
//                    growl: true,
//                    recursive: true
//                }
//            },
//            spec: {
//                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.js"]
//            },
//            ci: {
//                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.js"],
//                options: {
//                    reporter: "xunit-file",
//                    print: "summary"
//                }
//            },
//            dev: {
//                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.dev.js"]
//            }
//        },
//
//        // documentation
//        doxx: {
//            all: {
//                src: "<%= config.appDir %>",
//                target: "<%= config.docsDir %>/js",
//                options: {
//                    template: "<%= config.docsDir %>doxx-tpl.jade",
//                    readme: "README.md"
//                }
//            }
//        },
//
//        aglio: {
//            api:{
//                files:{
//                    "<%= config.docsDir %>/api/index.html": ["blueprint.apib"]
//                },
//                options: {
//                    theme: "default"
//                }
//            }
//        },
//
//        clean: {
//            docs: {
//                src: ["<%= config.docsDir %>/js", "<%= config.docsDir %>/api"]
//            },
//            test: {
//                src: ["<%= config.coverageDir %>", "xunit.xml"]
//            },
//        },
//
//        connect: {
//            options: {
//                port: 8080,
//                hostname: '0.0.0.0'
//            },
//            server: {
//                livereload: true
//            }
//        },
//
//    });

//    grunt.loadNpmTasks("grunt-contrib-clean");
//    grunt.loadNpmTasks("grunt-contrib-watch");
//    grunt.loadNpmTasks('grunt-contrib-connect');
//    grunt.loadNpmTasks("grunt-contrib-jshint");
//    grunt.loadNpmTasks("grunt-mocha-istanbul");
//    grunt.loadNpmTasks("grunt-doxx");
//    grunt.loadNpmTasks('grunt-aglio');
//
//
//    grunt.registerTask("docs", [
//        "clean:docs",
//        "doxx",
//        "aglio"
//    ]);
//
//    grunt.registerTask("dev", [
//        "connect:server",
//        "watch:javascript"
//    ]);
//
//    grunt.registerTask("test", [
//        "clean:test",
//        "jshint",
//        "checkRemainingDevTests",
//        "mocha_istanbul:ci"
//
//    ]);
//
//    grunt.registerTask("test:spec", [
//        "clean:test",
//        "jshint",
//        "checkRemainingDevTests",
//        "mocha_istanbul:spec"
//    ]);
//
//    grunt.registerTask("test:dev", [
//        "clean:test",
//        "jshint",
//        "mocha_istanbul:dev"
//    ]);
//
//    grunt.registerTask("build", [
//        "docs",
//        "test"
//    ]);
//
//    grunt.registerTask("checkRemainingDevTests", function(){
//        if (devFiles.length > 0) {
//            grunt.log.error('You still have development test files they are: ' + devFiles);
//            return false;
//        }
//    });

//    grunt.registerTask("default", ["dev"]);

};
