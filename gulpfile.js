/**
 * precss and package css
 * @file webpack.config.js
 * @author Aidan
 * @mail webaidandai@gmail.com
 */
let gulp = require('gulp'),

  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),

  precss = require('precss'),
  autoprefixer = require('autoprefixer'),

  shell = require('gulp-shell');
  browserSync = require('browser-sync').create();

gulp.task('css', function () {
    let processors = [
        precss(),
        autoprefixer({browsers: ['last 1 version']})
    ];

    return gulp.src('./asset/style/dev/*.css')
        .pipe(postcss(processors))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('./asset/style/'));
});

// Task for building blog when something changed:
gulp.task('build', shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({server: {baseDir: '_site/'}});
    // Reloads page when some of the already built files changed:
    gulp.watch('./asset/style/dev/*.css', ['css']);
    gulp.watch('./_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['css', 'build', 'serve']);