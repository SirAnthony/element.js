
module.exports = function(grunt){
    grunt.initConfig({
        bower: {install: {options: {targetDir: './build/'}}},
        jshint: {all: ['Gruntfile.js', 'element.js',
            'test/base.js', 'test/test.js']},
        uglify: {js: {files: {'package/element.js': ['element.js']}}},
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('package', ['uglify']);
    grunt.registerTask('default', ['bower', 'jshint', 'package']);
};
