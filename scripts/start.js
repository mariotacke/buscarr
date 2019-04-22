const Bundler = require('parcel-bundler');

const entryFiles = [
  './src/content/content.js',
  './src/popup/popup.html',
  './src/background/background.js',
];

const options = {
  hmr: false,
};

(async function () {
  const bundler = new Bundler(entryFiles, options);

  const bundle = await bundler.bundle();
})();