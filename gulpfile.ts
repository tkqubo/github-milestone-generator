'use strict';
import * as gulp from 'gulp';
import * as browserify from 'browserify';
const envify: any = require('envify/custom');
const source: any = require('vinyl-source-stream');

gulp.task('browserify', () => {
    process.env._ = 'purge';
    return browserify({ entries: ['index.js'] })
        .transform(envify(process.env))
        .bundle()
        .pipe(source('build/bundle.js'))
        .pipe(gulp.dest('.'))
    ;
});
