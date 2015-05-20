module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
        'ngconstant',
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
