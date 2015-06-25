var gulp = require('gulp'),
	connect = require('gulp-connect'),
  inject = require('gulp-inject'),
  wiredep = require('wiredep'),
  runSequence = require('run-sequence'),
  angularFilesort = require('gulp-angular-filesort');

gulp.task('connect', function(){
	connect.server({
		livereload: true
	});
});

gulp.task('html', function(){
  gulp.src('index.html', {read: false})
    .pipe(connect.reload());
});

gulp.task('css', function(){
	gulp.src('./assets/css/*.css', {read: false})
		.pipe(connect.reload());
});

gulp.task('js', function(){
	gulp.src('index.html', {read: false})
		.pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch(['index.html', 'app/**/*.html'], ['html']);
	gulp.watch(['./assets/css/*.css'], ['css']);
	gulp.watch(['./app/**/*.js'], ['js']);
  gulp.watch(['bower.json'], ['inject-bower']);

  gulp.watch(['app/*.js'], function(event, callback){
    if(event.type === 'added'){
      gulp.start('inject');
    }
  });
});

gulp.task('inject-css', function(){
  return gulp.src('./index.html')
    .pipe(inject(gulp.src('assets/css/*.css', {read: false}), {name: 'assets'}))
    .pipe(gulp.dest(''));
});

gulp.task('inject-lib', function(){
  return gulp.src('./index.html')
    .pipe(inject(gulp.src('assets/lib/*.js', {read: false}), {name: 'assets'}))
    .pipe(gulp.dest(''));
});

gulp.task('inject-bower', function(){
  return gulp.src('./index.html')
    .pipe(wiredep.stream())
    .pipe(gulp.dest('./'))
});

gulp.task('inject-app', function(){
  return gulp.src('./index.html')
    .pipe(inject(gulp.src(['./app/*.js']).pipe(angularFilesort()), {name: 'app', relative: 'true'}))
    .pipe(gulp.dest('./'));
});

gulp.task('inject-app-components', function(){
  return gulp.src('./index.html')
    .pipe(inject(gulp.src(['./app/*/*.js']).pipe(angularFilesort()), {name: 'appcomponents', relative: 'true'}))
    .pipe(gulp.dest('./'));
});

gulp.task('inject', function(callback){
  runSequence(
    'inject-css',
    'inject-lib',
    'inject-bower',
    'inject-app',
    'inject-app-components',
    callback
  );
});

gulp.task('default', [
  'inject',
  'connect',
  'watch']);
