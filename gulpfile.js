'use strict';

var
  gulp    = require('gulp'),

  // http://www.browsersync.io
  browserSync = require('browser-sync').create(),
  reload      = browserSync.reload,
  modRewrite  = require('connect-modrewrite'),

  gulpJade    = require('gulp-jade'),
  jade        = require('jade'),

  sass        = require('gulp-sass'),
  sourcemaps  = require('gulp-sourcemaps'),

  plumber     = require('gulp-plumber'),

  dest = './dist/',
  src  = './src/',
  production = './production/',

  config = {
    dest: dest,
    src: src,
    production: {
      dest: production,
      js: production + 'js/',
      build: dest + 'js/build.js',
      fonts: dest + 'fonts*/**',
      html:  dest + '*.html',
      css:   dest + '/css*/**.css',
    },
    js:   {src: src + 'js/**/*.js', dest: dest + 'js/'},
    jade: {src: src + '**/*.jade', dest: dest},
    css:  {
      src: src + 'scss/*.scss',
      dest: dest + 'css/',
      watch: src + 'scss/**/*.scss',
      path: [
        './bower_components/bootstrap-sass/assets/stylesheets',
        './bower_components/datetimepicker',
        './bower_components/font-awesome/scss',
      ],
    },
    copy: {
      libs: {
        src:[
          './bower_components/backbone/backbone.js',
          './bower_components/jquery/dist/jquery.js',
          './bower_components/underscore/underscore.js',
          './bower_components/requirejs/require.js',
          './bower_components/requirejs-text/text.js',

          './bower_components/bootstrap-sass/assets/javascripts/bootstrap*/**',

          './bower_components/datetimepicker/jquery.datetimepicker.js',
          './bower_components/jquery.maskedinput/dist/jquery.maskedinput.js',
          './bower_components/Backbone.localStorage/backbone.localStorage.js',
        ],
      dest: dest + 'js/vendor/'
      },
      fonts: {
        src: [
          './bower_components/font-awesome/fonts/**',
          './bower_components/bootstrap-sass/assets/fonts/bootstrap/**',
          './bower_components/Lato/Lato*/**',
        ],
        dest: dest + 'fonts/'},
      css: {
        src: [
          './bower_components/datetimepicker/jquery.datetimepicker.css',
          './bower_components/font-awesome/css/font-awesome.min.css',
          ],
        dest: dest + 'css/'
      }
    },
    svg:  {src: src + 'images/**/*', dest: dest + 'images'},
    map: '.',
  };

sass.settings = {
  outputStyle: 'compressed', //expanded
  style: 'compressed', //expanded
  includePaths: config.css.path,
  errLogToConsole: true,
  // sourceMap: true,
  // sourceMapEmbed: true,
  // outFile: 'style.css',
}

// фильтр :sass для jade файлов
jade.filters.sass = function (str) {
  var result = sass.compiler.renderSync({data: str, outputStyle: 'compressed'});
  return result.css.toString();
  // нужна обработка ошибок!!!
},

//////////////////////////////////////
gulp.task('copy',['copy:libs','copy:fonts','copy:svg']);
gulp.task('copy:libs', function () {
  gulp
    .src(config.copy.libs.src)
    .pipe(plumber())
    .pipe(gulp.dest(config.copy.libs.dest));
});
gulp.task('copy:fonts', function () {
  gulp
    .src(config.copy.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(config.copy.fonts.dest));
});
gulp.task('copy:svg', function () {
  gulp
    .src(config.svg.src)
    .pipe(plumber())
    .pipe(gulp.dest(config.svg.dest));
});
//////////////////////////////////////
gulp.task('js',  function() {
  gulp
    .src(config.js.src)
    .pipe(plumber())
    .pipe(gulp.dest(config.js.dest));
});
gulp.task('jade', function () {
  var YOUR_LOCALS = {};
  gulp
    .src(config.jade.src)
    .pipe(plumber())
    .pipe(gulpJade({
      locals: YOUR_LOCALS,
      jade: jade,
      pretty: false
    }))
    .pipe(gulp.dest(config.dest));
});
gulp.task('css',  function () {
  gulp
    .src(config.css.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sass.settings))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.css.dest));
});
gulp.task('server', function () {
  browserSync.init({
    server: {
    //  proxy: '127.0.0.1:8010',
      port: 8080,
      open: true,
      notify: false,
      baseDir: config.dest,
      index: "index.html",
      middleware: [
        modRewrite(['!\\.\\w+$ /index.html [L]'])
      ],
    ghostMode: false,
    },
  });
});

//////////////////////////////////////
gulp.task('build',['copy','js','jade','css'], function () {
  //TODO
});
gulp.task('default',['js','jade','css','server'], function () {
  gulp.watch(config.js.src, ['js']).on('change', reload);
  gulp.watch(config.css.watch, ['css']).on('change', reload);
  gulp.watch(config.jade.src, ['jade']).on('change', reload);
});
