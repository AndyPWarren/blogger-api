module.exports = function (grunt) {
    grunt.registerTask('test:spec', [
        "clean:test",
        "jshint",
        "checkRemainingDevTests",
        "mocha_istanbul:spec"
    ]);
};
