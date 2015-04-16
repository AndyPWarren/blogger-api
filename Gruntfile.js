"use strict";

var _ = require('lodash');
var path = require('path');

module.exports = function (grunt){

    var devFiles = _.flatten(_.map(grunt.file.expand('./tests/**/*.spec.dev.js')));

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        config: {
            appDir: "api/",
            testDir: "tests/",
            nodeDir: "node_modules/",
            docsDir: "docs/",
            coverageDir: "coverage/",
        },

        watch: {
            options: {
                nospawn: false,
                livereload: true
            },
            javascript: {
                files: [
                    "<%= config.appDir %>*.js",
                    "<%= config.appDir %>**/*.js",
                    "<%= config.appDir %>**/**/*.js",
                    "<%= config.testDir %>*.js",
                    "<%= config.testDir %>**/*.js",
                    "<%= config.testDir %>**/**/*.js"
                ],
                tasks: ["test:spec"]
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            dist: {
                src: ["<%= config.appDir %>**/*.js"]
            }
        },

        // testing
        mocha_istanbul: {
            options: {
                coverage: true,
                coverageFolder: "<%= config.coverageDir %>",
                reportFormats: ["cobertura","lcov"],
                root: "api/",
                timeout: 15000,
                mochaOptions: {
                    reporter: "spec",
                    growl: true,
                    recursive: true
                }
            },
            spec: {
                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.js"]
            },
            ci: {
                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.js"],
                options: {
                    reporter: "xunit-file",
                    print: "summary"
                }
            },
            dev: {
                src: ["<%= config.testDir %>bootstrap.spec.js", "<%= config.testDir %>**/*.spec.dev.js"]
            }
        },

        // documentation
        doxx: {
            all: {
                src: "<%= config.appDir %>",
                target: "<%= config.docsDir %>/js",
                options: {
                    template: "<%= config.docsDir %>doxx-tpl.jade",
                    readme: "README.md"
                }
            }
        },

        aglio: {
            api:{
                files:{
                    "<%= config.docsDir %>/api/index.html": ["blueprint.apib"]
                },
                options: {
                    theme: "default"
                }
            }
        },

        clean: {
            docs: {
                src: ["<%= config.docsDir %>/js", "<%= config.docsDir %>/api"]
            },
            test: {
                src: ["<%= config.coverageDir %>", "xunit.xml"]
            },
        },

        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            server: {
                livereload: true
            }
        },

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-istanbul");
    grunt.loadNpmTasks("grunt-doxx");
    grunt.loadNpmTasks('grunt-aglio');


    grunt.registerTask("docs", [
        "clean:docs",
        "doxx",
        "aglio"
    ]);

    grunt.registerTask("dev", [
        "connect:server",
        "watch:javascript"
    ]);

    grunt.registerTask("test", [
        "clean:test",
        "jshint",
        "checkRemainingDevTests",
        "mocha_istanbul:ci"

    ]);

    grunt.registerTask("test:spec", [
        "clean:test",
        "jshint",
        "checkRemainingDevTests",
        "mocha_istanbul:spec"
    ]);

    grunt.registerTask("test:dev", [
        "clean:test",
        "jshint",
        "mocha_istanbul:dev"
    ]);

    grunt.registerTask("build", [
        "docs",
        "test"
    ]);

    grunt.registerTask("checkRemainingDevTests", function(){
        if (devFiles.length > 0) {
            grunt.log.error('You still have development test files they are: ' + devFiles);
            return false;
        }
    });

    grunt.registerTask("default", ["dev"]);

};
