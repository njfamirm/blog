const imagePlugin = require('@11ty/eleventy-img');

const imageOptions = {
  hashLength: 8,
  urlPath: '/img/',
  outputDir: 'dist/img',
  widths: ['auto'],
  formats: ['avif', 'webp', 'jpeg'],
};

async function image(src, alt = '') {
  if (!imagePlugin.Util.isRemoteUrl(src)) {
    src = './assets/' + src;
  }

  const metadata = await imagePlugin(src, imageOptions);

  let imageAttributes = {
    alt,
    loading: 'lazy',
    decoding: 'async',
  };
  return imagePlugin.generateHTML(metadata, imageAttributes);
}

module.exports = {image, imageOptions};
