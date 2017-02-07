let gulp = require('gulp'),

  less = require('gulp-less'),
  path = require('path'),
  cleanCSS = require('gulp-clean-css'),

  shell = require('gulp-shell');
  browserSync = require('browser-sync').create();

gulp.task('less', function () {
  return gulp.src('./asset/style/dev-less/index.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    // .pipe(cleanCSS())
    .pipe(gulp.dest('./asset/style'));
});

// Task for building blog when something changed:
gulp.task('build', shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({server: {baseDir: '_site/'}});
    // Reloads page when some of the already built files changed:
    gulp.watch('./asset/style/dev-less/*.less', ['less', browserSync.reload]);
    gulp.watch('./_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['less', 'build', 'serve']);