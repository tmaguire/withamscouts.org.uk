/* jshint esversion:8 */
const {
	src,
	dest,
	parallel,
	series
} = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const fileInclude = require('gulp-file-include');
const sriHash = require('gulp-sri-hash');
const htmlmin = require('gulp-html-minifier-terser');
const {
	version,
	appName,
	description,
	appUrl,
	author
} = require('./package.json');
const sass = require('gulp-sass')(require('sass'));
const {
	marked
} = require('marked');
const pages = require('./src/json/pages.json');

function licensePrep() {
	const licenses = require('./thirdparty-licenses.json');
	const array = [];
	let counter = 0;
	Object.keys(licenses).forEach(key => {
		counter++;
		const license = licenses[key];
		array.push({
			name: license.name,
			version: license.version,
			repo: license.repository,
			license: (String(license.licenseFile).endsWith('LICENSE') || String(license.licenseFile).endsWith('LICENSE.md') || String(license.licenseFile).endsWith('LICENSE.txt')) ? license.licenseText : '',
			counter
		});
	});
	return array;
}
const licenses = licensePrep();

function sri() {
	return src('dist/*.html', { encoding: false })
		.pipe(sriHash({
			algo: 'sha512',
			relative: true
		}))
		.pipe(dest('dist/'));
}

function bundledJs() {
	return src([
		'./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
		'./node_modules/navigo/lib/navigo.min.js',
		'./src/js/script.js'
	], { encoding: false })
		.pipe(concat(`main-${version}.min.js`))
		.pipe(uglify())
		.pipe(dest('dist/js/'));
}

function bundledCss() {
	return src('./src/css/style.scss', { encoding: false })
		.pipe(concat(`bundle-${version}.min.css`))
		.pipe(sass({
			style: 'compressed',
			quietDeps: true
		}))
		.pipe(dest('dist/css/'));
}

function copyImg() {
	return src([
		'./src/img/**/*'
	], { encoding: false })
		.pipe(dest('dist/img/'));
}

function copyIcons() {
	return src('./node_modules/bootstrap-icons/font/fonts/*', { encoding: false })
		.pipe(dest('dist/css/fonts/'));
}

function sitePages() {
	return src('./src/html/*.html', { encoding: false })
		.pipe(fileInclude({
			prefix: '@@',
			basepath: '@root',
			context: {
				version,
				licenses,
				appName,
				description,
				pages,
				appUrl,
				author
			},
			filters: {
				markdown: marked.options({ mangle: false, headerIds: false, headerPrefix: false }).parse
			}
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			continueOnParseError: true
		}))
		.pipe(dest('dist/'));
}

function copyJson() {
	return src('./src/json/*.json', { encoding: false })
		.pipe(dest('dist/'));
}

exports.default = parallel(series(parallel(bundledJs, bundledCss, sitePages, copyIcons, copyImg, copyJson), sri));