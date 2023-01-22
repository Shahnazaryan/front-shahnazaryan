const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const srcset = require('gulp-responsive-imgzz');
const uglify = require('gulp-uglify-es').default;
const sharpResponsive = require("gulp-sharp-responsive");

/**
 * Convert/move HTML files
 * 1 step - Concat all html template parts
 * 2 step - Change img tag on all html files set attribute srcset
 * 3 step - Output converted files to dist dir
 */
function html() {
    return src('src/**.html')
    .pipe(include({
        prefix: '@@'
    }))
    .pipe(srcset({
        suffix: {
            '1x':'',
            '768w': '-md',
            '640w': '-sm',
        }
      }))
    .pipe(dest('dist'))
}

/**
 * Convert SCSS to CSS
 * 1 step - convert scss to css
 * 2 step - Add prefixes to styles
 * 3 step - Minify
 * 4 step - Create/write converted css styles to single file
 * 5 step - Output converted files to dist dir
 */
function scss(){
    return src('src/scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(dest('dist'))
}
// Concatenate js files and minify output file
function scripts() {

	return src( 'src/js/**/*' )
		.pipe( concat( 'main.min.js' ) )
		.pipe( dest('dist/js') )
		.pipe( uglify() )
		.pipe( dest('dist/js') );
}
/**
 * Copy images to dist dir, create new img files by size (for srcset)
 * 1 step - Create responsive images
 * 2 step - Output created files to dist dir
 */
function images(){
    return src('src/images/**/*.{jpg,png}')
        .pipe(sharpResponsive({
            formats: [
                { width: 1024, rename: { suffix: "" } },
                { width: 768, rename: { suffix: "-md" } },
                { width: 640, rename: { suffix: "-sm" } }
              ],
            includeOriginalFile: true,
          }))
        .pipe(dest('dist/images'))
}
/**
 * Copy fonts to dist dir
 */
 function fonts(){
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'))
}
/**
 * Clean dist dir, delete all files
 */
function clean() {
    return del('dist/*');
}

/**
 * Init server
 * Watch chanages in files/folders 
 */

function serve(){
    sync.init({
        server: './dist'
    })
    watch('src/**/*.html', series(clean, fonts, scss, scripts, html, images)).on('change', sync.reload)
    watch('src/scss/**.scss', series(fonts, scss)).on('change', sync.reload)
}

exports.build = series(clean, fonts, scss, scripts, html, images)
exports.serve = series(clean, fonts, scss, scripts, html, images, serve)