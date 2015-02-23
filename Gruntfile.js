module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-crx');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('app/manifest.json'),

        shell: {
            bower: {
                command: "./bower install"
            },
            bowerInstaller: {
                command: "./bower-installer"
            }
        },

        crx: {
            staging: {
                "src": "app/",
                "dest": "dist/staging/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
                "baseURL": "https://github.com/poxip/xkcd-today",
                "filename": "",
                "exclude": [
                    ".git", ".svn", "*.pem"
                ],
                "privateKey": "~/.ssh/chrome-apps.pem"
            },
            production: {
                "src": "app/",
                "dest": "dist/production/<%= pkg.name %>-<%= manifest.version %>.crx",
                "baseURL": "https://github.com/poxip/xkcd-today",
                "exclude": [
                    ".git", ".svn", "dev/**", "*.pem"
                ],
                "options": {
                    "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
                }
            }
        }
    });

    grunt.registerTask('install', ['shell:bower', 'shell:bowerInstaller']);
    grunt.registerTask('build', ['crx']);

    grunt.registerTask('default', ['install', 'build']);
};