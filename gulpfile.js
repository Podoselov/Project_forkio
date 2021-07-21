const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const fileinclude = require("gulp-file-include");
const del = require("del");
const uglify = require("gulp-uglify");
const ttfToWoff2 = require("gulp-ttf2woff2");
const ttfToWoff = require("gulp-ttf2woff");
const rename = require("gulp-rename");

function serv() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

function html() {
  return src("./src/html/index.html")
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .pipe(dest("./dist"))
    .pipe(browserSync.reload({ stream: true }));
}

function imagesDev() {
  return src("./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}")
    .pipe(imagemin())
    .pipe(dest("./dist/img"))
    .on("end", browserSync.reload);
}

function stylesDev() {
  return src("./src/scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 3 versions"], grid: true })
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(sourcemaps.write())
    .pipe(rename({ basename: "styles", suffix: ".min", extname: ".css" }))
    .pipe(dest("./dist/css/"))
    .pipe(browserSync.reload({ stream: true }));
}

function scriptsDev() {
  return src("./src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest("./dist/js"))
    .pipe(browserSync.reload({ stream: true }));
}

function imagesBuild() {
  return src("./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}")
    .pipe(imagemin())
    .pipe(dest("./dist/img"));
}

function stylesBuild() {
  return src("./src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 3 versions"], grid: true })
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(rename({ basename: "styles", suffix: ".min", extname: ".css" }))
    .pipe(dest("./dist/css/"));
}

function scriptsBuild() {
  return src("./src/js/*.js")
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(dest("./dist/js"));
}

function watcher() {
  watch("*.html").on("change", browserSync.reload);
  watch("./src/js/*.js").on("change", parallel(scriptsDev));
  watch("./src/scss/*.scss").on("change", parallel(stylesDev));
  watch("./src/img/**/*.{jpg,jpeg,png,gif,tif,svg").on(
    "change",
    parallel(imagesDev)
  );
}

function delDist() {
  return del("./dist/**/*");
}

function fonts() {
  src("./src/fonts/*.ttf").pipe(ttfToWoff()).pipe(dest("./dist/fonts/"));
  return src("./src/fonts/*.ttf")
    .pipe(ttfToWoff2())
    .pipe(dest("./dist/fonts/"));
}

exports.build = series(
  delDist,
  html,
  fonts,
  imagesBuild,
  stylesBuild,
  scriptsBuild
);
exports.dev = parallel(
  serv,
  watcher,
  series(html, fonts, imagesDev, stylesDev, scriptsDev)
);
