let path = require('path');
let gulp = require('gulp');
let less = require('gulp-less');
let shell = require('gulp-shell');
let browserSync = require('browser-sync').create();

function styles() {
    return gulp.src('./asset/style/dev-less/index.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./asset/style'));
}

// Task for building blog when something changed:
function jekyll() {
    return shell.task(['jekyll build --watch']);
}

// Task for serving blog with Browsersync
function server() {
    browserSync.init({ server: { baseDir: '_site/' } });
    // Reloads page when some of the already built files changed:
    gulp.watch('./asset/style/dev-less/*.less', gulp.parallel(styles, browserSync.reload));
    gulp.watch('./_site/**/*.*').on('change', browserSync.reload);
}

exports.styles = styles;
exports.jekyll = jekyll;
exports.server = server;

let build = gulp.series(gulp.parallel(styles, jekyll, server));

gulp.task('default', build);