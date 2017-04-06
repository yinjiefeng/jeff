/**
 * Created by jeff on 2017/2/15.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var isCompress = false;

gulp.task('browser-sync-chizi-pc', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/pc-chizi",
            index: "./index.html"
        },
        port: 666
    });
});

gulp.task('watch', function () {
    gulp.watch(["docs/pc-chizi/**/*.js"]).on('change', function(){
        runSequence('min-js', browserSync.reload);
    });
    gulp.watch(['docs/pc-chizi/**/*.css', 'docs/pc-chizi/**/*.less']).on('change', function(){
        runSequence('min-css', browserSync.reload);
    });
    gulp.watch(['pug-chizi/**/*.pug']).on('change', function(){
        runSequence('pug', browserSync.reload);
    });
});

gulp.task('pug', function(){
    return gulp.src('pug-chizi/*.pug')
        .pipe($.pug())
        .pipe($.htmlBeautify({
            indent_size: 4,
            indent_char: ' ',
            // 这里是关键，可以让一个标签独占一行
            unformatted: true,
            // 默认情况下，body | head 标签前会有一行空格
            extra_liners: []
        }))
        .pipe($.htmlmin())
        .pipe(gulp.dest('dist/pc-chizi'));
});

gulp.task('min-js', function(){
    return gulp.src('docs/pc-chizi/**/*.js')
        .pipe($.if(isCompress, $.uglify()))
        .pipe(gulp.dest('dist/pc-chizi'));
});

gulp.task('lib-js', function(){
    return gulp.src([
        'lib/jquery-1.8.3/jquery.min.js',
        'lib/velocityjs/velocity.min.js',
        'lib/jQueryRotate.2.2.js'
    ])
    //.pipe($.if(isCompress, $.uglify()))
    .pipe(gulp.dest('dist/pc-chizi/assets/js'));
});

gulp.task('min-css', function(){
    return gulp.src(['docs/pc-chizi/**/*.less', 'docs/pc-chizi/**/*.css'])
        .pipe($.less())
        .pipe($.if(isCompress, $.cleanCss({
                compatibility: 'ie8',//保留ie8及以下兼容写法
            })))
        .pipe(gulp.dest('dist/pc-chizi'));
});

gulp.task('copy-other', function(){
    return gulp.src(['docs/pc-chizi/**/*', '!docs/pc-chizi/**/*.js', '!docs/pc-chizi/**/*.css', '!docs/pc-chizi/**/*.less'])
        .pipe(gulp.dest('dist/pc-chizi'));
});

gulp.task('clean-pc-chizi', function(){
    return del([
        'dist/pc-chizi/**/*.js',
        'dist/pc-chizi/**/*.css',
        'dist/pc-chizi/**/*.less',
        'dist/pc-chizi/**/*.html']);
});

gulp.task('dev:pug', ['clean-pc-chizi'], function (callback) {

    isCompress = false;

    runSequence(['min-js', 'lib-js', 'min-css', 'copy-other', 'pug'], 'browser-sync-chizi-pc', 'watch', callback);
});

gulp.task('prod:pug', ['clean-pc-chizi'], function (callback) {

    isCompress = true;

    runSequence(['min-js', 'lib-js', 'min-css', 'copy-other', 'pug'], 'browser-sync-chizi-pc', 'watch', callback);
});