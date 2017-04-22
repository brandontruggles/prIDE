var gulp = require('gulp');
var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var del = require('del');

var config = {
	js: {
		srcDir: './Front-End/',
		srcFile: './Front-End/app.js',
		outputDir: './Front-End/build/',
		outputFile: 'bundle.js'
	},
	img : {
		srcDir: './Front-End/image/'
	}	
};

function bundle(bundler)
{
	bundler
		.bundle()
		.pipe(source(config.js.src))
		.pipe(buffer())
		.pipe(rename(config.js.outputFile))
		.pipe(gulp.dest(config.js.outputDir))
		.pipe(livereload());
}

gulp.task('default', ['watch'], function() {
			
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(config.js.srcDir + '*.js', ['bundle']);
});

gulp.task('bundle', ['clean'],  function() {
	var bundler = browserify(config.js.src)
		.transform(babelify, {presets: ["es2015", "react"], plugins: ["transform-object-rest-spread"]});
	bundle(bundler);
});

gulp.task('clean', function() {
	return del(['./Front-End/build']);
});
