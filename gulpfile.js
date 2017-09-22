// load everything
var gulp = require('gulp');

var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var fs = require('fs');

// Now define some tasks

// a task to delete all css files in dist folder
gulp.task('css:clean', function(){
    return del([
        'dist/*.css',
        'dist/*.map'
    ], { force: true });
});

// CSS compilation (also deletes css files first using previously defined task)
gulp.task('css:compile', ['css:clean'], function(){
    return gulp
        .src('src/scss/bootstrap.scss') // this is the source of for compilation
        .pipe(sourcemaps.init()) // initalizes a sourcemap
        .pipe(sass().on('error', sass.logError)) // compile sass to css and also tell us about a problem if happens
        .pipe(postcss([autoprefixer( // supported browsers (from Bootstrap 4 beta: https://github.com/twbs/bootstrap/blob/v4-dev/build/postcss.config.js)
            //
            // Official browser support policy:
            // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
            //
            'Chrome >= 45', // Exact version number here is kinda arbitrary
            'Firefox ESR',
            // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
            // NOT the Edge app version shown in Edge's "About" screen.
            // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
            // See also https://github.com/Fyrd/caniuse/issues/1928
            'Edge >= 12',
            'Explorer >= 10',
            // Out of leniency, we prefix these 1 version further back than the official policy.
            'iOS >= 9',
            'Safari >= 9',
            // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
            'Android >= 4.4',
            'Opera >= 30'
        ), require('postcss-flexbugs-fixes')]))
        .pipe(csso()) // compresses CSS
        .pipe(sourcemaps.write('.')) // writes the sourcemap
        .pipe(gulp.dest('./dist/css')) // destination of the resulting css
});

// set develop as a default task (gulp runs this when you don't specify a task)
gulp.task('default', ['css:compile']);
