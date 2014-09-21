
module.exports = function(grunt){
    grunt.initConfig({
        bower: {install: {options: {targetDir: './build/'}}},
        jshint: {all: ['Gruntfile.js', 'element.js']},
        uglify: {js: {files: {'build/element.min.js': ['element.js']}}},
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['bower', 'jshint', 'uglify']);
};
