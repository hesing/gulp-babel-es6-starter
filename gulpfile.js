'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')()
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSource = require('vinyl-source-stream');
var buff = require('vinyl-buffer');
var pkg = require('./package.json');
var del = require('del');

process.env.NODE_ENV = 'development';
// file locations
var
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),

    source = 'client/',
    dest = 'build/',

    html = {
        in: source + '*.html',
        watch: [source + '*.html', source + 'views/**/*'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version
        }
    },

    images = {
        in: source + 'images/*.*',
        out: dest + 'images/'
    },

    imguri = {
        in: source + 'images/inline/*',
        out: source + 'scss/images/',
        filename: '_datauri.scss',
        namespace: 'img'
    },

    css = {
        in: source + 'sass/main.scss',
        watch: [source + 'sass/**/*', '!' + imguri.out + imguri.filename],
        out: dest + 'css/',
        compassOpts:{
          style: 'expanded',
          css: dest + 'css/',
          sass: source+"sass/",
          image: 'images',
          sourcemap: true
        }, 
        pleeeaseOpts: {
            autoprefixer: { browsers: ['last 2 versions', '> 2%'] },
            rem: ['16px'],
            pseudoElements: true,
            mqpacker: true,
            minifier: !devBuild
        }
    },

    fonts = {
        in: source + 'fonts/*.*',
        out: dest + 'fonts/'
    },

    js = {
        in: source + 'app/main.js',
        watch: source+'**/*.js',
        out: dest + 'js/',
        filename: 'main.min.js'
    };
    // vendor ={
    //     in: source + 'vendor/**/*',
    //     out: dest + 'vendor/'
    // },

    // syncOpts = {
    //     server: {
    //         baseDir: dest,
    //         index: 'index.html'
    //     },
    //     open: false,
    //     notify: true
    // };

// build HTML files
gulp.task('html', function() {
    var page = gulp.src(html.in).pipe($.preprocess({ context: html.context }));
    if (!devBuild) {
        page = page
            .pipe($.size({ title: 'HTML in' }))
            .pipe($.htmlclean())
            .pipe($.size({ title: 'HTML out' }));
    }
    return page.pipe(gulp.dest(html.out));
});

gulp.task('compass', function() {
    if (!devBuild) {
        css.compassOpts.style = 'compressed';
        css.compassOpts.sourcemap = false;
    }

  return gulp.src(css.in)
    //.pipe(sourcemaps.init())
    .pipe($.compass(css.compassOpts))
    .on('error', $.notify.onError(function (error) {
        return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
    }))
    //.pipe(sourcemaps.write())
    .pipe($.size({title: 'CSS in '}))
    .pipe($.pleeease(css.pleeeaseOpts))
    .pipe($.size({title: 'CSS out '}))
    .pipe(gulp.dest(css.out))
    .pipe($.notify({
        message: "Compilation Successful"
    }));
    //.pipe(browsersync.reload({ stream: true }));
});

gulp.task('script', function () {

    var bundle = browserify({
        entries: js.in,
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(vinylSource(js.filename))
    .pipe(buff());

    if (!devBuild) {
        bundle.pipe($.uglify());
    }    
    
    bundle.pipe(gulp.dest(js.out));
});

// copy fonts
gulp.task('fonts', function() {
    return gulp.src(fonts.in)
        .pipe($.newer(fonts.out))
        .pipe(gulp.dest(fonts.out));
});

// clean the build folder
gulp.task('clean', function() {
    del([
        dest + '*'
    ]);
});

// default task
// gulp.task('default', ['html', 'images', 'fonts', 'compass', 'script', 'browsersync', 'copy'], function() {
gulp.task('default', ['html', 'fonts', 'compass', 'script'], function() {


    // html changes
    gulp.watch(html.watch, ['html']);

    // image changes
    //gulp.watch(images.in, ['images']);

    // font changes
   gulp.watch(fonts.in, ['fonts']);

    // sass changes
    gulp.watch([css.watch, imguri.in], ['compass']);

    // javascript changes
    gulp.watch(js.watch, ['script']);

});


// gulp.task('watch', function () {
//     gulp.watch('client/**/*.js', ['build']);
//     gulp.watch('client/*.html', ['copy']);
//     gulp.watch('client/css/*.css', ['copyCSS']);
// });

// gulp.task('default', ['copy', 'copyCSS', 'build', 'watch']);
