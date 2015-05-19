module.exports = function(grunt) {

    var env = grunt.option("env") || "development";

    grunt.config.set('ngconstant', {
        env: grunt.file.readJSON("./env.json")[env],
        options: {
            name: "config",
            dest: "./assets/js/config/config.js",
            constants: {
                bower: "<%= bower %>",
                pkg: "<%= pkg %>",
                env: "<%= env %>"
            }
        },
        dist: {}
    });

    grunt.loadNpmTasks('grunt-ng-constant');
};
