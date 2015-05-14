module.exports = function(grunt) {

    grunt.config.set('connect', {
        options: {
            port: 8080,
            hostname: '0.0.0.0'
        },
        server: {
            livereload: true
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
};
