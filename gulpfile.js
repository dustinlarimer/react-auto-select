var gulp = require('gulp');

var browserify = require('browserify'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream');

gulp.task('browserify', function() {
  return browserify()
    .transform(reactify)
    .add('./lib/index.js', {
      insertGlobals: true,
      debug: true
    })
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./app/'));
});

gulp.task('connect', function () {
  connect.server({
    root: [__dirname, '/app'],
    port: 9999
  });
});

gulp.task('watch', function() {
  gulp.watch(['./lib/**/*.js'], ['browserify']);
});

gulp.task('default', function(callback){
  runSequence('browserify', 'connect', 'watch', callback);
});
