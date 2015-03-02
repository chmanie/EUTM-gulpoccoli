'use strict';

var del = require('del');
var path = require('path');
var compileSass = require('broccoli-sass');
var filterCoffeeScript = require('broccoli-coffee');
var mergeTrees = require('broccoli-merge-trees');
var esTranspiler = require('broccoli-babel-transpiler');
var fastBrowserify = require('broccoli-fast-browserify');
var concat = require('broccoli-concat');
var pickFiles = require('broccoli-static-compiler');
var uglifyJavaScript = require('broccoli-uglify-js');
var csso = require('broccoli-csso');

del.sync(path.resolve('./' + process.argv[3]));

var root = 'src/app/';

var sassDir = root + 'sass';
var coffeeDir = root + 'coffee';
var jsDir = root + 'js';

var browserifyTree = esTranspiler(jsDir);
browserifyTree = fastBrowserify(browserifyTree, {
  bundles: {
    'js/bundle.js': {
      entryPoints: ['index.js']
    }
  }
});

var coffeeTree = filterCoffeeScript(coffeeDir);

var scriptTree = concat(mergeTrees([browserifyTree, coffeeTree]), {
  inputFiles: [
    'loadMeFirst.js',
    'js/bundle.js',
    'loadAfterBundle.js'
  ],
  outputFile: '/js/bundle.js'
});

scriptTree = uglifyJavaScript(scriptTree);

var styleTree = compileSass([sassDir], 'main.scss', 'css/main.css');

styleTree = csso(styleTree);

var staticTree = pickFiles(root, {
  srcDir: '/',
  files: ['index.html'],
  destDir: '/'
});

module.exports = mergeTrees([styleTree, scriptTree, staticTree]);
