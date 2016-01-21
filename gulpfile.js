var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.uglify = require('gulp-uglify');
plugins.browserSync = require('browser-sync');
plugins.minifycss = require('gulp-minify-css');

var gulpAug = require('gulp-augments')(gulp);
var modula = require('modula-loader');
var _ = require('lodash');

var path = {
  styles      : { src: 'styles/',            dest: 'www/styles/' },
  scripts     : { src: 'scripts/',           dest: 'www/scripts/' },
  templates   : { src: 'views/',             dest: 'www/' },
  vendor: {
    scripts   : { src: 'vendor/scripts/',    dest: 'www/scripts/' },
    components: { src: 'vendor/components/', dest: 'www/styles/'}
  }
};

var tasks = modula('tasks', { gulp: gulp, path: path, $: plugins });

// Creates a task for each module mapped inside modules.build/deploy
// and returns an array of said modules.
var build  = _.keys(_.forIn(tasks.build,  createTask));
var deploy = _.keys(_.forIn(tasks.deploy, createTask));

gulp.task('build', build);
gulp.task('deploy', build.concat(deploy));

gulp.task('serve', build, function(){
  plugins.browserSync.init({ server: "./" });
  gulp.watch(path.styles.src    + '**/*.{sass,scss}', ['compile:sass']);
  gulp.watch(path.templates.src + '**/*.jade',        ['compile:jade']);
  gulp.watch(path.scripts.src   + '**/*.js',          ['compile:js']);
});

function createTask(func, name){
  gulp.task(name, func);
}
