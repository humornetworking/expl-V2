"use strict";


var gulp = require('gulp');
var jasmine     = require('gulp-jasmine');
var source      = require('vinyl-source-stream'); // makes browserify bundle compatible with gulp
var browserify  = require('browserify');
var glob = require('glob');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');


gulp.task('clean-src', function(cb) {
    return gulp.src('build/js', {read: false})
        .pipe(clean());
});

gulp.task('clean-test', function(cb) {
    return gulp.src('build/test', {read: false})
        .pipe(clean());
});

gulp.task('test', function () {
    return gulp.src('test/*.js')
        .pipe(jasmine());
});


gulp.task('script', function() {

    var scrFiles = glob.sync('./public/app/**/*.js');

    return browserify({
        entries: scrFiles
    } ).bundle()
        .pipe(source('script.js'))
        .pipe(gulp.dest('./public/build/js/'));
});

gulp.task('script-test', function() {
    return browserify({ entries: ['./test/prettifier-spec'] } ).bundle()
        .pipe(source('prettifier-spec-script.js'))
        .pipe(gulp.dest('./build/test/'));
});


gulp.task('default', ['test','script-test', 'script', 'clean-src', 'clean-test' ]);