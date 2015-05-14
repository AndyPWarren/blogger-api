module.exports = function (grunt) {
    grunt.registerTask('test', [
        "clean:test",
        "jshint",
        "checkRemainingDevTests",
        "mocha_istanbul:spec"
    ]);
};
