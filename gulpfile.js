var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('css', function() {
  return sass('./src/css/', { sourcemap: false })
  .on('error', function (err) {
    console.error('Error', err.message);
  })
  .pipe(concat('main.css'))
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function() {
  return browserify({
    entries: './src/js/main.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(plumber({ handleError: function (err) {
    console.log(err);
    this.emit('end');
   }}))
  .pipe(source('main.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('templates', function() {
  return gulp.src('src/**/*.jade')
  .pipe(plumber({ handleError: function (err) {
    console.log(err);
    this.emit('end');
  }}))
  .pipe(jade({ pretty: true }))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
  browserSync({ server: { baseDir: "build", index: "index.html" } });
});

gulp.task('vendor', function() {
  return gulp.src('src/vendor/**', { base: "./src"})
  .pipe(plumber({ handleError: function (err) {
    console.log(err);
    this.emit('end');
   }}))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['vendor','js','css','templates']);

gulp.task('watch',['js','css','templates', 'browser-sync'], function () {
  gulp.watch("src/**/*.js", ['js', browserSync.reload]);
  gulp.watch("src/css/*.scss", ['css', browserSync.reload]);
  gulp.watch("src/*.jade", ['templates', browserSync.reload]);
});

