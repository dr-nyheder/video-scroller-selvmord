import gulp from 'gulp';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
// import removeLog from 'gulp-remove-logging';
import clean from 'gulp-clean';
import stripDebug from 'gulp-strip-debug';
import inject from 'gulp-inject';
import prompt from 'gulp-prompt';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import webpackDevConfig from './webpack.dev.config.babel';
import WebpackDevServer from 'webpack-dev-server';
import config from './config';


const pathArray = __dirname.split('/');
const folder = pathArray[pathArray.length -1];

gulp.task('default', ['watch'], () => {

});

gulp.task('stage', ['stage:clean','assets:dev', 'index:dev'], () => {

  return gulp.src('dev/**/*')
  .pipe(gulp.dest(config.stagingFolder + folder + ''));

})
gulp.task('deploy', ['dist:clean','assets:dist', 'index:dist'], () => {

  const msg = 'Vil du deploye "' + folder + '" til produktion i mappen ' + config.deployFolder + '?'

  return gulp.src(['dist/**/*', 'src/webdok.html'])
  .pipe(prompt.confirm({
        message: msg,
        default: true
  }))
  .pipe(gulp.dest(config.deployFolder + folder + ''));

})

// DEV: ------------------------------------------------------

gulp.task('assets:dev', () => {
  gulp.src('src/assets/**/*')
  .pipe(gulp.dest('dev/assets'))
})
gulp.task('stage:clean', () =>{
    gulp.src(config.stagingFolder + folder, {read:false})
    .pipe(clean({force: true}));
})
   
gulp.task('index:dev', ['webpack:dev'], function () {
  var target = gulp.src('src/index.html');
  var sources = gulp.src(['**/*.js'], {read: false, cwd: __dirname + '/dev'});
  return target.pipe(inject(sources, {addRootSlash:false}))
    .pipe(gulp.dest('dev'));
});

gulp.task('webpack:dev', ['babel:dev'], (callback) =>{
    const myConfig = Object.create(webpackDevConfig);
    myConfig.plugins = [
        new webpack.DefinePlugin(config.staging)
    ];
    webpack(myConfig, (err, stats)=>{
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors:true,
            progress:true
        }));

        callback();
    })
});

gulp.task('babel:dev', () => {
    gulp.src('src/**/*.scss')
        .pipe(gulp.dest('temp'));

    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('temp'));
});

// DIST: ------------------------------------------------------

gulp.task('assets:dist', () => {
  gulp.src('src/assets/**/*')
  .pipe(gulp.dest('dist/assets'))

})
gulp.task('dist:clean', () =>{
    gulp.src(config.deployFolder + folder, {read:false})
    .pipe(clean({force: true}));
})

gulp.task('index:dist', ['webpack:dist'], function () {
  var target = gulp.src('src/index.html');
  var sources = gulp.src(['**/*.js'], {read: false, cwd: __dirname + '/dist'});
  return target.pipe(inject(sources, {addRootSlash:false}))
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack:dist', ['babel:dist'], (callback) =>{
    const myConfig = Object.create(webpackConfig);
    myConfig.plugins = [
        // new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin(config.deploy),
        new webpack.optimize.UglifyJsPlugin()
    ];

    return webpack(myConfig, (err, stats)=>{
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors:true,
            progress:true
        }));
        callback();
    })
});

gulp.task('babel:dist', () => {
    gulp.src('src/**/*.scss')
        .pipe(gulp.dest('temp'));

    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(stripDebug())
        .pipe(gulp.dest('temp'));
});

// WATCH: ------------------------------------------------------

gulp.task('webpack-dev-server', ['index:dev'], function(callback) {

    const myConfig = Object.create(webpackDevConfig);
    myConfig.plugins = [
        new webpack.DefinePlugin(config.local)
    ];

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: '/',
        stats: {
            colors: true
        },
        contentBase: 'dev/'
    }).listen(8080, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
        //proxy.run();
    });
});

gulp.task('watch', () => {
    gulp.start('webpack-dev-server');
    gulp.watch(['src/assets/**'], ['assets:dev']);
    return gulp.watch(['src/**'], ['webpack-dev-server']);
});