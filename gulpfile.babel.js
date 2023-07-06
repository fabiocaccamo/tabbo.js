'use strict';

import browser          from 'browser-sync';
import gulp             from 'gulp';
import minify           from 'gulp-minify';
import plugins          from 'gulp-load-plugins';
import { rimraf }       from 'rimraf';
import yargs            from 'yargs';

const $ = plugins();
const PATHS = {
    'dist': 'dist',
    'javascript': [
        'src/tabbo.js'
    ]
}
const PORT = 8000
const PRODUCTION = !!(yargs.argv.production);

function clean(done) {
    rimraf(PATHS.dist, {}).then(function() {
        done();
    });
}

function javascript() {
    return gulp.src(PATHS.javascript)
        .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
        .pipe($.concat('tabbo.js'))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(minify({ ext: { min: '.min.js' } }))
        .pipe(gulp.dest(PATHS.dist));
}

function server(done) {
    browser.init({
        server: PATHS.dist,
        port: PORT
    });
    done();
}

function reload(done) {
    browser.reload();
    done();
}

function watch() {
    gulp.watch('src/**/*.js').on('all',
        gulp.series(javascript, browser.reload));
}

gulp.task('build',
    gulp.series(clean, javascript));

gulp.task('default',
    gulp.series('build', server, watch));
