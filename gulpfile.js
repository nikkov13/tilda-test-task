// VARIABLES & PATHS

let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
	baseDir      = 'src', // Base directory path without «/» at the end
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true; // If «false» - Browsersync will work offline without internet connection

let paths = {

	styles: {
		src:  baseDir + '/' + preprocessor + '/style.*',
		dest: baseDir + '/css',
	},

	images: {
		src:  baseDir + '/original-img/**/*',
		dest: baseDir + '/img',
	},

	cssOutputName: 'style.css',

}

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp');
const sass         = require('gulp-sass');
const scss         = require('gulp-sass');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const newer        = require('gulp-newer');
const rsync        = require('gulp-rsync');
const imagemin     = require('gulp-imagemin');

function browsersync() {
	browserSync.init({
		server: { baseDir: baseDir + '/' },
		notify: false,
		online: online
	})
}

function styles() {
	return src(paths.styles.src)
	.pipe(eval(preprocessor)())
	.pipe(concat(paths.cssOutputName))
	.pipe(dest(paths.styles.dest))
	.pipe(browserSync.stream())
}


function images() {
	return src(paths.images.src)
	.pipe(newer(paths.images.dest))
	.pipe(imagemin())
	.pipe(dest(paths.images.dest))
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', { force: true })
}

function startwatch() {
	watch(baseDir  + '/' + preprocessor + '/**/*', {usePolling: true}, styles);
	watch(baseDir  + '/img/**/*.{' + imageswatch + '}', {usePolling: true}, images);
	watch(baseDir  + '/**/*.{' + fileswatch + '}', {usePolling: true}).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.assets      = series(styles, images);
exports.styles      = styles;
exports.images      = images;
exports.images      = cleanimg;
exports.default     = parallel(images, styles, browsersync, startwatch);