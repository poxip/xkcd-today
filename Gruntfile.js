module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-crx');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('app/manifest.json'),

        shell: {
            bower: {
                command: "./bower install"
            }
        },

        copy: {
            main: {
                files: [
                    // Jquery
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist/',
                        src: [
                            'jquery.js'
                        ],
                        dest: 'app/vendor/jquery/'
                    },
                    // Semantic
                    {
                        expand: true,
                        cwd: 'bower_components/semantic-ui/dist/',
                        src: [
                            'themes/**',
                            'semantic.css',
                            'semantic.js'
                        ],
                        dest: 'app/vendor/semantic-ui'
                    }
                ]
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

    grunt.registerTask('install', ['shell:bower', 'copy']);
    grunt.registerTask('build', ['crx']);

    grunt.registerTask('default', ['install', 'build']);
};