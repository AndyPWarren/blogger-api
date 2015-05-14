module.exports = function(grunt) {

    grunt.config.set('aglio', {
        api:{
            files:{
                "<%= config.docsDir %>/api/index.html": ["blueprint.apib"]
            },
            options: {
                theme: "default"
            }
        }
    });

    grunt.loadNpmTasks('grunt-aglio');
};
