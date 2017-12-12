const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('zip', function () {
    return gulp.src('./dist/**')
        .pipe(zip('fourDAdmin.zip'))
        .pipe(gulp.dest('./distribution'));
});