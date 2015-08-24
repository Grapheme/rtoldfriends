var gulp = require('gulp');
var watch = require('gulp-watch');

var connect = require('gulp-connect');
// var open = require('gulp-open');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
// var gulpIgnore = require('gulp-ignore');
// var concat = require('gulp-concat');
// var prefix = require('gulp-autoprefixer');
// var bowerMain = require('bower-main');
// var rev = require('gulp-rev');
var plumber = require('gulp-plumber');
var wrap = require("gulp-wrap");
// var preprocess = require('gulp-preprocess');
// var useref = require('gulp-useref');


var Project = {
  build: { path: './build' },
  src: { path: './src' }
};

Project.src.scripts = [Project.src.path + '/scripts/**/*.js'];
Project.src.views = [Project.src.path + '/views/*.jade'];


Project.src.styles = [Project.src.path + '/styles/**/*.scss'];
Project.src.sassFiles = [
  Project.src.path + '/styles/popup.scss',
  Project.src.path + '/styles/content.scss'
];

// Project.src.mainSass = 
Project.src.fonts = Project.src.path + '/fonts/**/*';
Project.src.images = Project.src.path + '/images/**/*';

Project.src.templates = Project.src.path + '/views/templates/**/*';

Project.src.static = [Project.src.fonts, Project.src.images, Project.src.path + '/*.json'];

Project.build.views = Project.build.path;
Project.build.index = Project.build.views + '/index.html';
Project.build.scripts = Project.build.path + '/scripts';
Project.build.styles = Project.build.path + '/styles';
Project.build.fonts = Project.build.path + '/fonts';
Project.build.images = Project.build.path + '/images';
Project.build.templates = Project.build.path;


var server_options = {
  root: Project.src.path,
  // livereload: true,
  // port: 8888,
  // https: true,
  // middleware: function() {
  //   return [cors()];
  // },
};

var DEV_SERVER_URL =  '//localhost:' + server_options.port + '/';

gulp.task('server', function() {
  connect.server(server_options);
  // connect.server(server_options);
//   gulp.src(Project.build.index)
//     .pipe(open('', { url: DEV_SERVER_URL }));
});

var all = Project.src + '/**/*';

gulp.task('reload_server', function() {
  gulp.src(all)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  watch(all, function () { 
    gulp.run('reload_server');
  });
});


gulp.task('default', [ 'watch', 'server']);