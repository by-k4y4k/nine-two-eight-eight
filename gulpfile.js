// SETTINGS ====================================================================
// Toggle on and off features --------------------------------------------------

const settings = {
  // Pug => HTML
  pug: false,

  // Pug w/ data =>
  pugData: false,

  // Sass => CSS
  sass: true,

  // JS (concat, babel)
  js: true,

  // Do I need cachebusting?
  cachebust: false,

  // Browsersync?
  bs: true,

  // Images?
  img: true,
};

// Requires ====================================================================

// General
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');

// Pug
const pug = settings.pug ? require('gulp-pug') : null;

// Pug data
const wrap = settings.pugData ? require('gulp-wrap') : null;
const rename = settings.pugData ? require('gulp-rename') : null;
const fs = settings.pugData ? require('fs') : null;

// Sass
const sass = settings.sass ? require('gulp-sass') : null;
const autoprefixer = settings.sass ? require('autoprefixer') : null;
const cssnano = settings.sass ? require('cssnano') : null;
const postcss = settings.sass ? require('gulp-postcss') : null;
const purgecss = settings.sass ? require('gulp-purgecss') : null;

sass.compiler = settings.sass ? require('node-sass') : null;

// JS
const concat = settings.js ? require('gulp-concat') : null;
const babel = settings.js ? require('gulp-babel') : null;
const uglify = settings.js ? require('gulp-uglify') : null;

// Cachebusting
const cachebust = settings.cachebust ? require('gulp-cache-bust') : null;

// Browsersync
const browserSync = settings.bs ? require('browser-sync').create() : null;

// Image
const imagemin = settings.img ? require('gulp-imagemin') : null;

// Paths =======================================================================
const the = {
  pug: {
    inFolder: './src/pug/*.pug',
    outFolder: './public/',
    watchFolder: './src/pug/**/*.pug',
  },
  sass: {
    inFolder: './src/scss/*.scss',
    outFolder: './public/css',
    watchFolder: './src/scss/**/*.scss',
  },
  img: {
    inFolder: './src/img/*.png',
    outFolder: './public/img',
    watchFolder: './src/img/*.png',
  },
  js: {
    inFolder: './src/js/*.js',
    outFolder: './public/js',
    watchFolder: './src/js/**/*.js',
  },
};

// Tasks =======================================================================

gulp.task('del', function() {
  return del(['./dest', './public']);
});

gulp.task('pugData', function(done) {
  if (!settings.pugData) {
    done();
    return;
  }
  return gulp
      .src('./src/data/work.json')
      .pipe(plumber())

      .pipe(
          wrap(
              function(data) {
                const template = './src/pug/index.pug';
                return fs.readFileSync(template).toString();
              },
              {},
              {engine: 'pug'}
          )
      )
      .pipe(rename({extname: '.html', basename: 'index'}))
      .pipe(gulp.dest('./dest'))
      .pipe(browserSync.stream());
});

gulp.task('pug', function(done) {
  if (!settings.pug) {
    done();
    return;
  }
  return gulp
      .src(the.pug.inFolder)
      .pipe(plumber())
      .pipe(pug())
      .pipe(gulp.dest(the.pug.outFolder))
      .pipe(browserSync.stream());
});

const webpack = require('webpack-stream');


gulp.task('js', function(done) {
  // 1. wipe existing js folder
  del('./public/js');
  // 2. copy scanner worker
  gulp.src('./src/js/qr-scanner-worker.min.js').pipe(gulp.dest('./public/js'));

  // 3 webpack
  gulp.src('src/js/browser.js')
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(gulp.dest('./cache'));

  // 4. regular JS processing
  gulp.src('./cache/*.js')
      .pipe(plumber())
      .pipe(
          babel({
            presets: ['@babel/env'],
          })
      )
      .pipe(uglify({toplevel: true}))
      .pipe(gulp.dest('./public/js'));

  // 5. clear cache
  del(['./processing/', './qq/', './cache/']);

  done();
});

gulp.task('scss', function() {
  const plugins = [autoprefixer(), cssnano()];

  if (!settings.sass) {
    return;
  }
  return gulp
      .src(the.sass.inFolder)
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss(plugins))
      .pipe(gulp.dest(the.sass.outFolder))
      .pipe(browserSync.stream());
});

gulp.task('img', function() {
  if (!settings.img) {
    return;
  }
  return gulp
      .src('./src/img/*.png')
      .pipe(plumber())
      .pipe(gulp.dest('./dest/img'));
});

gulp.task('bs', function(done) {
  browserSync.init({
    server: './dest',
    localOnly: true,
    open: false,
  });
  gulp.watch(the.sass.watchFolder, gulp.series('scss'));
  gulp.watch(the.pug.watchFolder, gulp.series('pug', 'pugData'));
  gulp.watch(the.img.watchFolder, gulp.series('img'));
  gulp.watch('./src/data/*.json', gulp.series('pugData'));
  gulp.watch(the.js.watchFolder, gulp.series('js'));
});

// Default =====================================================================

gulp.task(
    'default',
    gulp.series('del', 'img', 'js', 'pug', 'pugData', 'scss', 'bs')
);
