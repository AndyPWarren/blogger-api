module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'linkAssets', 'ngconstant', 'watch:api', 'watch:assets']);
};
