module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                sourceMap: true
            },
            game: {
                src: ['bower_components/async/dist/async.js', 'js/v2/**'],
                dest: 'js/dist/game.js'
            }
        },

        watch: {
            files: ['js/v2/**'],
            tasks: ['concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'watch']);
};