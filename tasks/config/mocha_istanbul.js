module.exports = function(grunt) {

    grunt.config.set('mocha_istanbul', {
        options: {
            coverage: true,
            coverageFolder: "coverage/",
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
            src: ["tests/bootstrap.spec.js", "tests/**/*.spec.js"]
        },
        ci: {
            src: ["tests/bootstrap.spec.js", "tests/**/*.spec.js"],
            options: {
                reporter: "xunit-file",
                print: "summary"
            }
        },
        dev: {
            src: ["tests/bootstrap.spec.js", "tests/**/*.spec.dev.js"]
        }
    });

    grunt.loadNpmTasks('grunt-mocha-istanbul');
};
