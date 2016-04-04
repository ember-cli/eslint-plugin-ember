'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var paths = {
  test: ['index.js', 'rules/**/*.js'],
  watch: ['rules/**/*.js', 'test/**/*.js']
};

var watching = false;

function handleError(error) {
  console.log(error.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

gulp.task('test', function(cb) {
  gulp.src(paths.test)
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      gulp.src(['test/**/*.js'])
        .pipe(mocha({ reporter: 'nyan' })
        .on('error', handleError))
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });
});

gulp.task('default', ['watch']);

gulp.task('watch', function() {
  watching = true;
  gulp.watch(paths.watch, ['test']);
});
