module.exports = function(grunt) {

    grunt.config.set('doxx', {
        all: {
            src: "<%= config.appDir %>",
            target: "<%= config.docsDir %>/js",
            options: {
                template: "<%= config.docsDir %>doxx-tpl.jade",
                readme: "README.md"
            }
        }
    });

    grunt.loadNpmTasks('grunt-doxx');
};

