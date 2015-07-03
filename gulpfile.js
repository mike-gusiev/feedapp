var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('default', function() {
    connect.server({
        root: __dirname,
        livereload: false,
        port: 8889
    });
    opn('http://localhost:8889/');
});