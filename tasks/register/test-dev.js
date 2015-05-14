module.exports = function (grunt) {
    grunt.registerTask('test:dev', [
        "clean:test",
        "jshint",
        "mocha_istanbul:dev"
    ]);
};
