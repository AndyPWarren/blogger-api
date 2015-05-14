module.exports = function (grunt) {

    var _ = require('lodash');

    var devFiles = _.flatten(_.map(grunt.file.expand('./tests/**/*.spec.dev.js')));

    grunt.registerTask("checkRemainingDevTests", function(){
        if (devFiles.length > 0) {
            grunt.log.error('You still have development test files they are: ' + devFiles);
            return false;
        }
    });
};
