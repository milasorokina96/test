const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const mincss = require('gulp-mini-css');
const del = require('del');
const watch = require('gulp-watch');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();

gulp.task('buildJS', () => {
    return gulp.src('./assets/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(sourcemaps.init())
        .pipe(babel({
            "presets": ["@babel/preset-env"]
        }))
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('buildCSS', () => {
    return gulp.src('./assets/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(mincss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/style'));
});

gulp.task('move', () => {
    return gulp.src(['./index.html'])
        .pipe(gulp.dest('./build'));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./build",
            routes: {
                "/node_modules": "node_modules"
            }
        },
        watch: true
    });
    watch('./assets/js/*.js', 'buildJS');
    watch('./assets/scss/*.scss', 'buildCSS');
    watch(['./index.html'], 'move');
});

gulp.task('deleteBuild', () => {
    return del('./build');
});

gulp.task('build', gulp.series('deleteBuild', gulp.parallel('buildJS', 'buildCSS', 'move'), 'browser-sync'));