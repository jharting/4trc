const gulp = require('gulp');
const jscs = require('gulp-jscs');
const browserify = require('gulp-browserify');
const replace = require('gulp-replace');
const config = require('../config');

gulp.task('default', ['lint', 'copy', 'browserify'], function () {});

gulp.task('lint', () => {
    return gulp.src([
        'main.js',
        './lib/**/**.js',
        'gulpfile.js'])
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('browserify', function () {
    gulp.src('main.js')
    .pipe(browserify({
        insertGlobals: true,
        debug: true
    }))
    .pipe(gulp.dest('./build'))
});

const src = [
    '*.html',
    '*.css',
    'icons/**/*',
    '*.ico'
]

gulp.task('copy', function () {
    if (!config.mapKey) {
        throw new Error('Map key not defined');
    }

    gulp.src(src, {
        base: '.'
    })
    .pipe(replace('${mapKey}', config.mapKey, {
        skipBinary: true
    }))
    .pipe(gulp.dest('./build'));
})
