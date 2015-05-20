module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'linkAssets', 'watch:api', 'watch:assets']);
};
