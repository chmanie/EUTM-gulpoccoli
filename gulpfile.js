'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify2');
var coffee = require('gulp-coffee');
var babelify = require('babelify');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var connect = require('gulp-connect');
var chokidar = require('chokidar');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
// var debug = require('gulp-debug');
// var gutil = require('gulp-util');

var SRC_DIR = 'src/app';
var DIST_DIR = 'dist';
var TMP_DIR = '.tmp';

var DIST = false;
var targetDir = TMP_DIR;

gulp.task('watch', ['scripts', 'html', 'sass'], function() {
	var watchScripts = chokidar.watch([SRC_DIR + '/js/*.js', SRC_DIR + '/coffee/*.coffee']);
	watchScripts.on('ready', function () {
    watchScripts.on('all', function () {
      gulp.start('scripts');
    });
  });
  var watchSass = chokidar.watch(SRC_DIR + '/sass/**/*.scss');
  watchSass.on('ready', function () {
    watchSass.on('all', function () {
      gulp.start('sass');
    });
  });
	chokidar.watch(SRC_DIR + '/*.html')
		.on('all', function () {
			gulp.src(SRC_DIR + '/index.html').pipe(connect.reload());
		});
});

gulp.task('scripts', function() {
    var jsFiles = gulp.src(SRC_DIR + '/js/index.js')
      .pipe(plumber({errorHandler: notify.onError('Browserify: <%= error.message %>')}))
      .pipe(browserify({ transform: babelify }));

    var coffeeFiles = gulp.src(SRC_DIR + '/coffee/*.coffee')
      .pipe(plumber({errorHandler: notify.onError('Coffeescript: <%= error.message %>')}))
      .pipe(cache('coffee'))
      // .pipe(debug())
      .pipe(coffee())
      .pipe(remember('coffee'));

    var scriptFiles = merge(jsFiles, coffeeFiles)
      .pipe(order([
        'loadMeFirst.js',
        'bundle.js',
        'loadAfterBundle.js'
      ]))
      .pipe(concat('bundle.js'));

    if (DIST) {
      scriptFiles = scriptFiles.pipe(uglify());
    }

    scriptFiles = scriptFiles.pipe(gulp.dest(targetDir + '/js'));

    if (!DIST) {
      scriptFiles = scriptFiles.pipe(connect.reload());
    }

});

gulp.task('sass', function () {
  var sassFiles = gulp.src(SRC_DIR + '/sass/*.scss')
    .pipe(plumber({errorHandler: notify.onError('Sass: <%= error.message %>')}))
    .pipe(sass({
      includePaths: [
        './bower_components',
        './node_modules'
      ]
    }));

  if (DIST) {
    sassFiles = sassFiles.pipe(minifyCss());
  }

  sassFiles = sassFiles.pipe(gulp.dest(targetDir + '/css'));

  if (!DIST) {
    sassFiles = sassFiles.pipe(connect.reload());
  }

});

gulp.task('html', function() {
    return gulp.src(SRC_DIR + '/*.html')
      .pipe(gulp.dest(targetDir));
});

gulp.task('serve', ['watch'], function () {
	connect.server({
		livereload: true,
		root: ['src/app', '.tmp', 'bower_components', 'node_modules']
	});
});

gulp.task('dist', function (done) {
  DIST = true;
  targetDir = DIST_DIR;
  runSequence(['html', 'scripts', 'sass'], done);
});

gulp.task('default', ['serve']);