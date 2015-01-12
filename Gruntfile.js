module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

        /*uglify: {

         css: {
         files: {

         }
         }

         },*/
    });

    // grunt.registerTask('default', ['uglify']);
};