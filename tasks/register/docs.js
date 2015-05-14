module.exports = function (grunt) {
    grunt.registerTask('docs', [
        "clean:docs",
        "doxx",
        "aglio"
    ]);
};
