/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

    var assets = grunt.file.readJSON("./assets/assets.json").files;
    var jsAssets = grunt.file.readJSON("./assets/assets.json").js;
    var cssAssets = grunt.file.readJSON("./assets/assets.json").css;
//    applicationFiles: grunt.file.readJSON("./scripts.json").application,

	grunt.config.set('copy', {
		dev: {
			files: [{
				expand: true,
				cwd: './assets',
				src: assets,
				dest: '.tmp/public'
			},{
                expand: true,
                cwd: './assets',
                src: jsAssets,
                dest: '.tmp/public/js/dependencies'
            },{
                expand: true,
                cwd: './assets',
                src: cssAssets,
                dest: '.tmp/public/styles',
                flatten: true
            }],

		},
		build: {
			files: [{
				expand: true,
				cwd: '.tmp/public',
				src: ['**/*'],
				dest: 'www'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
