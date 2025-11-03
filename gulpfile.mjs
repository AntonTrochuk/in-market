import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import gulpPug from 'gulp-pug';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import svgSprite from 'gulp-svg-sprite';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const sass = gulpSass(dartSass);
const server = browserSync.create();

const paths = {
  pug: 'source/pug/pages/**/*.pug',
  sass: 'source/sass/style.scss',
  allScss: 'source/sass/**/*.scss',
  js: 'source/js/**/*.js',
  images: ['source/img/**/*.{png,jpg,jpeg,webp,avif,svg}', '!source/img/icons/*.svg'],
  icons: 'source/img/icons/*.svg',
  fonts: 'source/fonts/**/*.{woff,woff2}',
  output: 'build',
};

// Очистка сборки
const clean = () => deleteAsync([paths.output]);

// Компиляция Pug
const compilePug = () => {
  console.log('Compiling Pug...');
  return src(paths.pug)
    .pipe(gulpPug({
      pretty: true,
      basedir: 'source/pug'
    }))
    .pipe(dest(paths.output));
};

// Компиляция SCSS
const compileScss = () => {
  console.log('Compiling SCSS...');
  return src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${paths.output}/css`));
};

// Сборка JS через Webpack (без watch!)
export const bundleJs = () => {
  return src('./source/js/main.js')
    .pipe(webpackStream(webpackConfig, require('webpack')))
    .pipe(dest('./build/js'));
};

// Копирование изображений
const copyImages = () => {
  console.log('Copying images...');
  return src(paths.images).pipe(dest(`${paths.output}/img`));
};

// Сборка SVG-спрайта
const svgSpriteBuild = () => {
  console.log('Building SVG sprite...');
  return src(paths.icons)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest(`${paths.output}/img/icons`));
};

// Копирование шрифтов
const copyFonts = () => {
  console.log('Copying fonts...');
  return src(paths.fonts).pipe(dest(`${paths.output}/fonts`));
};

// Копирование остальных ассетов
const copyAssets = () => {
  console.log('Copying assets...');
  return src(
    [
      'source/favicon/**',
      'source/*.ico',
      'source/manifest.webmanifest',
      'source/video/**',
      'source/downloads/**',
      'source/*.php',
    ],
    { base: 'source' }
  ).pipe(dest(paths.output));
};

// Перезагрузка Browsersync
const reload = (done) => {
  server.reload();
  done();
};

// Сервер и Watch
const startServer = () => {
  server.init({
    server: paths.output,
    index: 'index.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  watch('source/pug/**/*.pug', series(compilePug, reload));
  watch(paths.allScss, series(compileScss, reload));
  watch(paths.js, series(bundleJs, reload)); // Gulp следит за JS и пересобирает через Webpack
  watch(paths.images, series(copyImages, reload));
  watch(paths.icons, series(svgSpriteBuild, compilePug, reload));
  watch(paths.fonts, series(copyFonts, reload));
  watch('source/{favicon,video,downloads}/**', series(copyAssets, reload));
};

// Экспорт задач
export const build = series(
  clean,
  parallel(copyImages, copyAssets, svgSpriteBuild, copyFonts),
  parallel(compilePug, compileScss, bundleJs)
);

export const dev = series(build, startServer);
export default dev;
