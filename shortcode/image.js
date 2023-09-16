const image = require('@11ty/eleventy-img');

async function imageShortcode(src, alt) {
  let metadata = await image('assets' + src, {
    hashLength: 8,
    urlPath: '/img/',
    outputDir: 'dist/img',
    widths: ['auto'],
    formats: ['avif', 'webp', 'jpeg'],
  });
  let imageAttributes = {
    alt,
    loading: 'lazy',
    decoding: 'async',
  };
  return image.generateHTML(metadata, imageAttributes);
}

module.exports = {imageShortcode};
