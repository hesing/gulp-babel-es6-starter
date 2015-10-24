'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')()
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buff = require('vinyl-buffer')

gulp.task('build', function () {
    browserify({
        entries: './client/app/main.js',
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.bundle.js'))
    .pipe(buff())
    .pipe($.uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copyCSS', function () {
    gulp.src('client/css/*.css')
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy', function () {
    gulp.src('client/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('client/**/*.js', ['build']);
    gulp.watch('client/*.html', ['copy']);
    gulp.watch('client/css/*.css', ['copyCSS']);
});

gulp.task('default', ['copy', 'copyCSS', 'build', 'watch']);
