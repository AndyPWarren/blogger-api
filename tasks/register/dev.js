module.exports = function (grunt) {
    grunt.registerTask('dev', [
        "connect:server",
        "watch:tests"
    ]);
};
