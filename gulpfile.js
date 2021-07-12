let preprocessor = "sass", // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
  fileswatch = "html,htm,txt,json,md,woff2"; // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require("gulp"),
  gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  bssi = require("browsersync-ssi"),
  ssi = require("ssi"),
  webpack = require("webpack-stream"),
  sass = require("gulp-sass"),
  sassglob = require("gulp-sass-glob"),
  cleancss = require("gulp-clean-css"),
  group_media = require("gulp-group-css-media-queries"),
  autoprefixer = require("gulp-autoprefixer"),
  rename = require("gulp-rename"),
  imagemin = require("gulp-imagemin"),
  newer = require("gulp-newer"),
  rsync = require("gulp-rsync"),
  del = require("del"),
  webp = require("gulp-webp"),
  webpcss = require("gulp-webp-css"),
  ttf2woff = require("gulp-ttf2woff"),
  ttf2woff2 = require("gulp-ttf2woff2"),
  fonter = require("gulp-fonter");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
      middleware: bssi({ baseDir: "app/", ext: ".html" }),
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true,
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  });
}

function scripts() {
  return src(["app/js/*.js", "!app/js/*.min.js"])
    .pipe(
      webpack({
        mode: "production",
        performance: { hints: false },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              query: {
                presets: ["@babel/env"],
                plugins: ["babel-plugin-root-import"],
              },
            },
          ],
        },
      })
    )
    .on("error", function handleError() {
      this.emit("end");
    })
    .pipe(rename("app.min.js"))
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src([`app/scss/*.*`, `!app/scss/_*.*`])
    .pipe(eval(`${preprocessor}glob`)())
    .pipe(eval(preprocessor)())
    .pipe(group_media())
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(webpcss())
    .pipe(dest("app/css"))
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } } /* format: 'beautify' */,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function images() {
  return src(["app/images/src/**/*"])
    .pipe(newer("app/images/dist"))
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest("app/images/dist"))
    .pipe(src(["app/images/src/**/*"]))
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 3,
        svgoPlugins: [
          {
            removeViewBox: true,
          },
        ],
      })
    )
    .pipe(dest("app/images/dist"))
    .pipe(browserSync.stream());
}

gulp.task("ttf2woff2", function () {
  src("app/fonts/*.ttf").pipe(ttf2woff()).pipe(dest("app/fonts/"));
  return src("app/fonts/*.ttf").pipe(ttf2woff2()).pipe(dest("app/fonts/"));
});

gulp.task("otf2ttf", function () {
  return src(["app/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest("app/fonts/"));
});

function buildcopy() {
  return src(
    [
      "{app/js,app/css}/*.min.*",
      "app/images/**/*.*",
      "!app/images/src/**/*",
      "app/fonts/**/*",
    ],
    { base: "app/" }
  ).pipe(dest("dist"));
}

async function buildhtml() {
  let includes = new ssi("app/", "dist/", "/**/*.html");
  includes.compile();
  del("dist/parts", { force: true });
}

function cleandist() {
  return del("dist/**/*", { force: true });
}

function deploy() {
  return src("dist/").pipe(
    rsync({
      root: "dist/",
      hostname: "username@yousite.com",
      destination: "yousite/public_html/",
      // clean: true, // Mirror copy with file deletion
      include: [
        /* '*.htaccess' */
      ], // Included files to deploy,
      exclude: ["**/Thumbs.db", "**/*.DS_Store"],
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    })
  );
}

function startwatch() {
  watch(`app/scss/**/*`, { usePolling: true }, styles);
  watch(
    ["app/js/**/*.js", "!app/js/**/*.min.js"],
    { usePolling: true },
    scripts
  );
  watch(
    "app/images/src/**/*.{jpg,jpeg,png,webp,svg,gif}",
    { usePolling: true },
    images
  );
  watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on(
    "change",
    browserSync.reload
  );
}

exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.deploy = deploy;
exports.assets = series(scripts, styles, images);
exports.build = series(
  cleandist,
  scripts,
  styles,
  images,
  buildcopy,
  buildhtml
);
exports.default = series(
  scripts,
  styles,
  images,
  parallel(browsersync, startwatch)
);
