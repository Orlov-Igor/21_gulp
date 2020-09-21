const {task, src, dest, series, watch} = require('gulp');
const gulpSass = require('gulp-sass');
const mainCssPath = './main.scss';
const removeFiles = require('gulp-remove-files');
const babel =require('gulp-babel');
const connect = require("gulp-connect");

task('clean', (done) => {
    src('./dist/*')
    .pipe(removeFiles())
done();    
})

task('build styles', (done) => {
    src(mainCssPath)
    .pipe(gulpSass())
    .pipe(dest('./dist'))
done();        
})

task('build', (done) => {
   src('./src/*.js')
      .pipe(babel())
      .pipe(dest('./dev'))
done();
});

task('watch', () => {
   watch('./src/*.js', series('build'));
});

task("connect", function () {
   connect.server({
      root: ".",
      livereload: true
   });
});

task('watch', () => {
    watch(mainCssPath, series('build styles'));
}) 

task('default', series('clean', 'build styles', 'build', 'watch', 'connect'));

