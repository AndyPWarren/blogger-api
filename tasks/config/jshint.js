module.exports = function(grunt) {

    grunt.config.set('jshint', {
        options: {
            jshintrc: ".jshintrc"
        },
        dist: {
            src: ["api/**/*.js"]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
