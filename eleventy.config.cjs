const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const {markdown} = require('./config/markdown.js');
const {downloadImage} = require('./config/download-image.js');
const {
  slugify,
  trim,
  jsonParse,
  jsonStringify,
  humanReadableDate,
  simpleDate,
  normalizeKeyword,
  getHostname,
} = require('./config/util.js');
const {esbuildFilter, esbuildBuild} = require('./config/esbuild.js');
const {postcssFilter, postcssBuild} = require('./config/postcss.js');
const {alwatrIcon} = require('./shortcode/alwatr-icon.js');
const {image} = require('./shortcode/image.js');
const {editOnGitHub} = require('./shortcode/edit-on-github.js');
const {minifyHtml} = require('./config/minify-html');
const {number} = require('./config/i18n.js');
const {countKeywords} = require('./config/blog.js');

const directoryOutputPluginConfig = {
  columns: {
    filesize: true,
    benchmark: true,
  },
  warningFileSize: 400 * 1000,
};

/**
 * 11ty configuration.
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    assets: '/',
    'assets/img/meta/favicon.ico': '/favicon.ico',
  });

  eleventyConfig.setQuietMode(true);
  eleventyConfig.addWatchTarget('./site/');

  eleventyConfig.on('eleventy.before', esbuildBuild);

  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(directoryOutputPlugin, directoryOutputPluginConfig);

  eleventyConfig.addFilter('slugify', slugify);
  eleventyConfig.addFilter('jsonParse', jsonParse);
  eleventyConfig.addFilter('jsonStringify', jsonStringify);
  eleventyConfig.addFilter('humanReadableDate', humanReadableDate);
  eleventyConfig.addFilter('simpleDate', simpleDate);
  eleventyConfig.addFilter('normalizeKeyword', normalizeKeyword);
  eleventyConfig.addFilter('countKeywords', countKeywords);
  eleventyConfig.addFilter('getHostname', getHostname);
  eleventyConfig.addAsyncFilter('downloadImage', downloadImage);
  eleventyConfig.addFilter('trim', trim);
  eleventyConfig.addFilter('number', number);
  eleventyConfig.addAsyncFilter('postcss', postcssFilter);
  eleventyConfig.addAsyncFilter('esbuild', esbuildFilter);

  eleventyConfig.addShortcode('alwatrIcon', alwatrIcon);
  eleventyConfig.addShortcode('image', image);
  eleventyConfig.addShortcode('editOnGitHub', editOnGitHub);

  eleventyConfig.addTransform('minifyHtml', minifyHtml);
  eleventyConfig.addTransform('trim', trim);

  eleventyConfig.on('eleventy.after', postcssBuild);

  return {
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', '11ty.js', 'md'],
    dir: {
      input: 'site',
      output: 'dist',
      includes: '_includes',
      data: '_data',
      layouts: '_layouts',
    },
  };
};
