const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const path = require('path');

const entryFiles = [
  './src/content/content.js',
  './src/popup/popup.html',
];

const options = {
  hmr: false,
};

(async function () {
  const bundler = new Bundler(entryFiles, options);

  const bundle = await bundler.bundle();
})();