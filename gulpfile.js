// Deps.
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const log = require('gulplog');

// Globs, etc.
const outDir = 'dist';
const assetSources = 'assets/**/*.*';
const htmlSources = 'index.html';
const javaScriptSources = 'src/**/*.js';

gulp.task('assets', function () {
  gulp
    .src(assetSources)
    .pipe(gulp.dest(outDir));
});

gulp.task('html', function () {
  return gulp
    .src(htmlSources)
    .pipe(inlinesource())
    .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
    .pipe(gulp.dest(path.resolve(outDir, 'assets')));
});

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  return browserify({ entries: './src/main.js', debug: true })
    .transform("babelify", { presets: ["env"] })
    .bundle()
    .pipe(source('src/main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['assets', 'html', 'javascript']);

gulp.task('watch', function () {
  gulp.watch([htmlSources, javaScriptSources], ['build']);
});

gulp.task('default', ['build']);