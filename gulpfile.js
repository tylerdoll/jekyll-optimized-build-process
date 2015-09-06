var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var runSequence = require('run-sequence');
var del         = require('del');
var minifyCss   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require("gulp-rename");

var messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var sources = {
	desktop: '~/Desktop/gulp_compling',
};

gulp.task(
	'jekyll',
	['jekyll:copy']
);

/**
 * Build the Jekyll Site
 */
gulp.task(
	'jekyll:compile',
	function (done) {
		browserSync.notify(messages.jekyllBuild);
		return cp.spawn('jekyll', ['build', '--source', 'app', '--destination', 'build/_jekyll'], {stdio: 'inherit'})
			.on('close', done);
	}
);

/**
 * Copy the jekyll build to our dist folder
 */
gulp.task(
	'jekyll:copy',
	['jekyll:compile'],
	function (done) {
		return gulp.src('build/_jekyll/**/*')
			.pipe(gulp.dest('dist/'));
	}
);

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll:recompile', function() {
	runSequence('jekyll', function() {
		browserSync.reload();
	});
});

/**
 * Wait for jekyll:compile, then launch the Server
 */
gulp.task(
	'browser-sync',
	function() {
		browserSync({
			server: {
				baseDir: 'dist'
			},
			notify: false
		});
	}
);

/**
 * Compile files from _scss into both dist/css (for live injecting) and app (for future jekyll builds)
 */
gulp.task(
	'sass',
	function() {
		return gulp.src('app/_sass/main.sass')
			.pipe(sass({
				includePaths: ['sass'],
				onError: browserSync.notify,
				indentedSyntax: true,
			}))
			.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
			.pipe(minifyCss({compatibility: 'ie8'}))
			.pipe(rename('styles.min.css'))
			//.pipe(gulp.dest('build/_sass/'))
			.pipe(gulp.dest('dist/css/'))
			.pipe(browserSync.reload({stream:true}));
	}
);

/**
 * Minimize our vendor assets
 */
gulp.task('vendors', ['vendors:js', 'vendors:css']);

/**
 * Combine, minify, and output our vendor JS
 */
gulp.task(
	'vendors:js',
	function() {
		return gulp.src([
				'app/_js/vendors/jquery-1.11.3.min.js',
				'app/_js/vendors/jquery-ui.min.js',
				'app/_js/vendors/**/*.js',
			])
			.pipe(concat('vendors.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('dist/js/'));
	}
);

/**
 * Combine, minify, and output our vendor CSS
 */
gulp.task(
	'vendors:css',
	function() {
		return gulp.src('app/_css/vendors/**/*.css')
			.pipe(concat('vendors.min.css'))
			.pipe(minifyCss({compatibility: 'ie8'}))
			.pipe(gulp.dest('dist/css/'));
	}
);

gulp.task('css', ['css:libs']);

/**
 * Combine, minify, and output our CSS libraries
 */
gulp.task(
	'css:libs',
	function() {
		return gulp.src([
				'app/_css/libs/**/*.css',
			])
			.pipe(minifyCss({compatibility: 'ie8'}))
			.pipe(gulp.dest('dist/css/libs/'));
	}
);


gulp.task('js', ['js:uglify', 'js:libs']);

/**
 * Combine, minify, and output our JS libraries
 */
gulp.task(
	'js:recompile',
	['js:uglify', 'js:libs'],
	function() {
		return gulp.src([
				'app/_js/libs/**/*.js',
			])
			.pipe(gulp.dest('dist/js/'))
			.pipe(browserSync.reload({stream:true}));
	}
);

/**
 * Combine, minify, and output our JS libraries
 */
gulp.task(
	'js:uglify',
	function() {
		return gulp.src([
				'app/_js/*.js'
			])
			.pipe(uglify())
			.pipe(concat('scripts.min.js'))
			.pipe(gulp.dest('dist/js/'));
	}
);

/**
 * Combine, minify, and output our JS libraries
 */
gulp.task(
	'js:libs',
	function() {
		return gulp.src([
				'app/_js/libs/**/*.js',
			])
			.pipe(uglify())
			.pipe(gulp.dest('dist/js/libs/'));
	}
);

/**
 * Combine, minify, and output our vendor JS
 */
gulp.task(
	'minimize:js',
	function() {
		return gulp.src([
				'!app/_js/vendors.min.js',
				'!app/_js/libs/',
				'app/_js/**/*.js',
			])
			.pipe(concat('scripts.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('dist/js/'));
	}
);

/**
 * Clean images from dist
 */
gulp.task('images:clean', del.bind(null, ['dist/images/']));

/**
 * Copy images from app to dist
 */
gulp.task(
	'images:copy',
	['images:clean'],
	function() {
		return gulp.src([
				'app/images/**/*',
			])
			.pipe(gulp.dest('dist/images/'))
			.pipe(browserSync.reload({stream:true}));
	}
);

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
	gulp.watch(
		[
			'app/_sass/**/*.scss',
			'app/_sass/**/*.sass'
		],
		['sass']
	);
	gulp.watch(
		[
			'app/index.html',
			'app/_includes/**/*.html',
			'app/_layouts/*.html',
			'app/_posts/*'
		],
		['jekyll:recompile']
	);
	gulp.watch(
		[
			'app/_js/**/*.js'
		],
		['js:recompile']
	);
	gulp.watch(
		[
			'app/images/**/*'
		],
		['images:copy']
	);
});

/**
 * Build task, running `gulp build` will clean our distribution folder,
 * compile the sass, compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('build', function(cb) {
	runSequence(
		'build:clean',
		'build:compile',
		['browser-sync', 'watch'],
		cb
	);
});

/**
 * Subtask of build, deletes everything from our dist folder
 */
gulp.task('build:clean', del.bind(null, ['dist']));

/**
 * Subtask of build, compiles project
 */
gulp.task('build:compile', ['jekyll', 'vendors', 'sass', 'css', 'js']);

/**
 * Default task, running just `gulp` will run the build task.
 */
gulp.task('default', ['build']);
