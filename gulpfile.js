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
const path = require('path');
const bro = require('gulp-bro');
const cached = require('gulp-cached');
const babelify = require('babelify');

// Globs, etc.
const outDir = path.resolve(__dirname, 'dist');
const assetSources = [
  'node_modules/phaser-ce/build/phaser.min.js',
  'node_modules/babel-polyfill/dist/polyfill.min.js',
  'assets/**/*.png',
  'assets/**/*.mp3',
  'assets/**/*.ogg',
  'assets/**/*.ttf',
  'assets/**/*.woff',
  'assets/**/*.woff2',
  '.nojekyll'
];
const htmlSources = 'index.html';
const javaScriptSources = 'src/**/*.js';

gulp.task('assets', function () {
  return gulp
    //.src(assetSources, { base: '.', since: gulp.lastRun('assets') })
    .src(assetSources, { base: '.' })
    .pipe(cached('assets'))
    .pipe(gulp.dest(outDir));
});

gulp.task('html', function () {
  return gulp
    .src(htmlSources)
    .pipe(cached('html'))
    .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true }))
    .pipe(gulp.dest(outDir));
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  return gulp.src('src/main.js', {base: '.'})
    //.pipe(cached('javascript'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(bro({
      transform: [
        babelify.configure({presets: ['env'],
        plugins: [
          'transform-async-to-generator', 'transform-class-properties'
        ]})
      ]
    }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    //.on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outDir));
});

gulp.task('build', ['assets', 'html', 'javascript'], function () {
  console.info('Build done!');
});

gulp.task('watch', function () {
  const sources = assetSources.concat(htmlSources).concat(javaScriptSources);
  gulp.watch(sources, ['build']);
});

gulp.task('default', ['build']);