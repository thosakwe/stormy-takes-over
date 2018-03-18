// Deps.
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const log = require('gulplog');
const bro = require('gulp-bro');

// Globs, etc.
const outDir = './dist';
const assetSources = [
  'node_modules/phaser-ce/build/phaser.min.js',
  'node_modules/babel-polyfill/dist/polyfill.min.js',
  'assets/**/*.*',
  '.nojekyll'
];
const htmlSources = 'index.html';
const javaScriptSources = 'src/**/*.js';

gulp.task('assets', function () {
  return gulp
    .src(assetSources, { base: '.', since: gulp.lastRun('assets') })
    .pipe(gulp.dest(outDir));
});

gulp.task('html', function () {
  return gulp
    .src(htmlSources, { since: gulp.lastRun('html') })
    .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
    .pipe(gulp.dest(outDir));
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  return gulp.src('./src/main.js', { since: gulp.lastRun('javascript') })
    .pipe(bro({
      presets: ['env'],
      plugins: [
        'transform-async-to-generator', 'transform-class-properties'
      ]
    })
      .pipe(sourcemaps.init({ loadMaps: true }))
      // Add transformation tasks to the pipeline here.
      //.pipe(uglify())
      .on('error', log.error)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(outDir));
});

gulp.task('build', ['assets', 'html', 'javascript']);

gulp.task('watch', function () {
  gulp.watch([htmlSources, javaScriptSources], ['build']);
});

gulp.task('default', ['build']);