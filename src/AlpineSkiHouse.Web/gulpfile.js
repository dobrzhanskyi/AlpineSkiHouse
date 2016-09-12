﻿/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    typescript = require("gulp-typescript"),
    rename = require("gulp-rename2"),
    watch = require("gulp-watch");

var webroot = "./wwwroot/";
var sourceroot = "./Scripts/"

var paths = {
    loader: "jspm_packages/**/*.js",
    loaderConfig: "Scripts/jspmconfig.js",
    ts: sourceroot + "**/*.ts",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    jsDest: webroot + "js/",
    concatCssDest: webroot + "css/site.min.css"
};

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("stage-loader", function () {
    gulp.src(paths.loaderConfig)
        .pipe(gulp.dest(paths.jsDest));
    return gulp.src(paths.loader)
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task("typescript", function(){
    return gulp.src([paths.ts, "!" + paths.minJs], { base: "." })
        .pipe(typescript({
            module: "system"
        }))
        .pipe(rename((pathObj, file) => {
            return pathObj.join(
                pathObj.dirname(file).replace(/^Scripts\/?\\?/, ''),
                pathObj.basename(file));
        }))
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task("min:js", function () {
    return gulp.src([paths.ts, "!" + paths.minJs], { base: "." })
        .pipe(typescript())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("default", ["stage-loader", "typescript"]);

gulp.task("watch", ["default"], function () {
    return gulp.watch(paths.ts, ["typescript"]);
});