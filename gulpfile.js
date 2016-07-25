var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var panini = require('panini');
var sass = require('gulp-sass');

gulp.task('default', ['serve', 'template', 'sass', 'watch']);

gulp.task('serve', ['template', 'sass'], function serve(cb) {

    browserSync.init({
        server: {
            baseDir: "./public"
        }
    }, function() {
        cb();
    });
});

gulp.task('template', function template() {
    return gulp.src('src/pages/**/*.html')
        .pipe(panini({
            root: 'src/pages/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            helpers: 'src/helpers/',
            data: 'src/data/'
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('sass', ['template'], function() {
    return gulp.src("src/**/*.scss")
        .pipe(sass({
            sourceComments: true
        }))
        .on('error', handleError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("public/"))
        .pipe(browserSync.stream());

    function handleError(error){
        console.log('error.formatted: ', error.formatted);
        this.emit('end');
    }
});



gulp.task('watch', ['serve'], function() {
    gulp.watch("src/**/*.scss", ['sass', browserSync.reload]);
    gulp.watch('src/{pages,layouts,partials,helpers,data}/**/*.html', ['template', browserSync.reload]);
});

