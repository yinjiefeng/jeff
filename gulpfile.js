/**
 * Created by jeff on 2017/2/15.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var isCompress = false;

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/",
            index: "./index.html"
        },
        port: 666
    });
});

gulp.task('watch', function () {
    gulp.watch(["src/js/**/*.js"]).on('change', function(){
        runSequence('min-js', browserSync.reload);
    });
    gulp.watch(['src/css/**/*.css', 'src/css/**/*.less']).on('change', function(){
        runSequence('min-css', browserSync.reload);
    });
    gulp.watch(['src/pug/**/*.pug']).on('change', function(){
        runSequence('pug', browserSync.reload);
    });
});

gulp.task('pug', function(){
    return gulp.src('src/pug/*.pug')
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
        .pipe(gulp.dest('dist/'));
});

gulp.task('min-js', function(){
    return gulp.src('src/**/*.js')
        .pipe($.babel({
            presets:['es2015']
        })) //conver es5 to es5
        .pipe($.if(isCompress, $.uglify()))
        .pipe(gulp.dest('dist/'));
});

gulp.task('lib-js', function(){
    return gulp.src([
        'lib/jquery-1.8.3/jquery.min.js',
        'lib/velocityjs/velocity.min.js',
        'lib/jQueryRotate.2.2.js'
    ])
    //.pipe($.if(isCompress, $.uglify()))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('min-css', function(){
    return gulp.src(['src/**/*.less', 'src/**/*.css'])
        .pipe($.less())
        .pipe($.if(isCompress, $.cleanCss({
                compatibility: 'ie8',//保留ie8及以下兼容写法
            })))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-image', function(){
    return gulp.src(['src/images/*.*'])
        .pipe($.rename(function (path) {
            path.dirname += "/images";
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function(){
    return del(['dist/*']);
});

gulp.task('dev:pug', ['clean'], function (callback) {

    isCompress = false;

    runSequence(['min-js', 'lib-js', 'min-css', 'copy-image', 'pug'], 'browser-sync', 'watch', callback);
});

gulp.task('prod:pug', ['clean-pc-chizi'], function (callback) {

    isCompress = true;

    runSequence(['min-js', 'lib-js', 'min-css', 'copy-image', 'pug'], 'browser-sync', 'watch', callback);
});