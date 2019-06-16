let path = require('path');
let gulp = require('gulp');
let less = require('gulp-less');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let uglify = require('gulp-uglify');
// let shell = require('gulp-shell');
let browserSync = require('browser-sync').create();

function styles() {
    return gulp.src('./asset/style/dev-less/index.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(postcss([
            autoprefixer(),
            cssnano({
                preset: 'default',
            }),
        ]))
        .pipe(gulp.dest('./asset/style'));
}

function javascrit() {
    return gulp.src('./asset/javascript/dev/index.js')
        .pipe(uglify())
        .pipe(gulp.dest('./asset/javascript'));
}

// Task for serving blog with Browsersync
function server() {
    browserSync.init({ server: { baseDir: '_site/' } });
    // Reloads page when some of the already built files changed:
    gulp.watch('./asset/style/**/*.less').on('change', gulp.parallel(styles));
    gulp.watch('./_site/**/*.*').on('change', browserSync.reload);
}

exports.styles = styles;
exports.javascrit = javascrit;

let build = gulp.series(gulp.parallel(styles, javascrit));

gulp.task('default', build);
