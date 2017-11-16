var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var bourbon = require('node-bourbon');

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./src/img/sprite/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('./app/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./app/css/')); // путь, куда сохраняем стили
});

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({includePaths: require("node-bourbon").includePaths})
            .on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions'])) //подключаем Autoprefixer
        .pipe(cleanCSS())
        .pipe(csscomb())
        .pipe(csso()) // минифицируем css, полученный на предыдущем шаге
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browserSync', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('watch', ['sass', 'browserSync'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
});





