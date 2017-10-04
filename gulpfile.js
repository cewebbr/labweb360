'use strict';

/* GULP PLUGINS
========================================================================== */
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
 	livereload = require('gulp-livereload'),
	postcss = require('gulp-postcss'),
	cleanCSS = require('gulp-clean-css'),
	changed = require('gulp-changed'),
	sourcemaps = require('gulp-sourcemaps'),
	shell = require('gulp-shell'),
	clean = require('gulp-clean'),
	webp = require('gulp-webp'),
	imagemin = require('gulp-imagemin'),
	gulpCopy = require('gulp-copy'),
	requirejsOptimize = require('gulp-requirejs-optimize'),
	rev = require('gulp-rev'),
	revDel = require('rev-del'),
	uncss = require('gulp-uncss'),
	override = require('gulp-rev-css-url'),
	runSequence = require('run-sequence');

/* CONFS
========================================================================== */
livereload({ start: true });

/* JEKYLL
========================================================================== */
//Start a jekyll server
gulp.task('jekyllStart', shell.task([
  'jekyll serve --no-watch --limit_posts 1'
]));

//Build and compile Jekyll partials for development
gulp.task('jekyllBuild', shell.task([
  'jekyll build --incremental'
]));

//Build the website for production
gulp.task('jekyllProd', shell.task([
  'jekyll build --config _prod_config.yml'
]));

/* DEV TASKS
========================================================================== */

//Compile the Sass css, prefix the styles and create the sourceMap for the dev CSS
gulp.task('css', function() {

	return gulp.src('_site/sass/main-sass.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({ errLogToConsole:true }))
	.pipe(prefix('last 15 version'))
	.pipe(rename('main.css'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('_site/css'));

});

/* PROD TASKS
========================================================================== */

//Minify the dev CSS for production
gulp.task('minifyCSS', function () {

	return gulp.src('_site/sass/main-sass.scss')
	.pipe(sass({ errLogToConsole:true }))
	.pipe(prefix('last 15 version'))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(rename('main.css'))
	.pipe(gulp.dest('build/css'));

});

//Use RequireJS to concatenate the js assets for production
gulp.task('scripts', function () {
    return gulp.src('dev/js/main.js')
	    .pipe(requirejsOptimize(function(file) {
            return {
            	name: 'main',
            	mainConfigFile: 'dev/js/main.js',
                optimize: 'uglify2',
                useStrict: true,
                baseUrl: 'dev/js',
                //include: ['lib/require.js'] /* If the site uses requireJS external links manager */
                include: ['lib/almond.js'] /* If the site don't use any external links manager, we use almond.js for building */
            };
        }))
        .pipe(gulp.dest('assets/js'));
});

//Minify the images
gulp.task('imageMin', function () {

    return gulp.src('_site/img/**/*')
    	.pipe(changed('dev/img-min'))
        .pipe(imagemin({
            optimizationLevel : 7
           // use: [pngcrush()]
        }))
        .pipe(gulp.dest('build/img-min'));
});

//Clean the assets folder which will receive the rev'ed assets
gulp.task('clean', function () {
    return gulp.src('assets', {read: false})
    .pipe(clean());
});


/* DEV TASKS
========================================================================== */
//Creates a livereload Server and build static assets on the fly.
gulp.task('default', function() {

	//Star the liveReload Server
	livereload({ start: true });

	//Start the jekyllServer
	gulp.start('jekyllStart');

	//When a HTML Jekyll partial change, build the templates again
	gulp.watch(['**/*.html', '!_site/**/*.html'], ['jekyllBuild']);

	//When a SASS file change, build the CSS
	gulp.watch('_site/sass/**/*.*', ['css']);

	//When any CSS, HMTL, or JS files change, reload the browser
	gulp.watch(['_site/css/main.css', '_site/**/*.html', '_site/js/**/*.js']).on('change', function(file) {
		livereload.changed(file.path);
	});

});

//Build the complete site inside the "build" folder
gulp.task('build', function() {
 	runSequence('minifyCSS', 'imageMin', 'jekyllProd');
});