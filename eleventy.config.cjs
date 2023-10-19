const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const {countKeywords} = require('./config/blog.js');
const {downloadImage} = require('./config/download-image.js');
const {esbuildFilter, esbuildBuild} = require('./config/esbuild.js');
const {number} = require('./config/i18n.js');
const {markdown} = require('./config/markdown.js');
const {minifyHtml} = require('./config/minify-html');
const {indexContent} = require('./config/pagefind.js');
const {postcssFilter, postcssBuild} = require('./config/postcss.js');
const {
  trim,
  dateString,
  timeString,
  slugify,
  jsonParse,
  jsonStringify,
  simpleDate,
  normalizeKeyword,
  getHostname,
} = require('./config/util.js');
const {alwatrIcon} = require('./shortcode/alwatr-icon.js');
const {editOnGitHub} = require('./shortcode/edit-on-github.js');
const {image} = require('./shortcode/image.js');

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

  eleventyConfig.on('eleventy.before', esbuildBuild);

  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(directoryOutputPlugin, directoryOutputPluginConfig);

  eleventyConfig.addFilter('trim', trim);
  eleventyConfig.addFilter('number', number);
  eleventyConfig.addFilter('slugify', slugify);
  eleventyConfig.addFilter('jsonParse', jsonParse);
  eleventyConfig.addFilter('countKeywords', countKeywords);
  eleventyConfig.addFilter('jsonStringify', jsonStringify);
  eleventyConfig.addFilter('simpleDate', simpleDate);
  eleventyConfig.addFilter('getHostname', getHostname);
  eleventyConfig.addFilter('normalizeKeyword', normalizeKeyword);
  eleventyConfig.addAsyncFilter('downloadImage', downloadImage);
  eleventyConfig.addAsyncFilter('postcss', postcssFilter);
  eleventyConfig.addAsyncFilter('esbuild', esbuildFilter);
  eleventyConfig.addFilter('dateString', dateString);
  eleventyConfig.addFilter('timeString', timeString);

  eleventyConfig.addShortcode('image', image);
  eleventyConfig.addShortcode('editOnGitHub', editOnGitHub);
  eleventyConfig.addAsyncShortcode('alwatrIcon', alwatrIcon);

  eleventyConfig.addTransform('minifyHtml', minifyHtml);
  eleventyConfig.addTransform('trim', trim);

  eleventyConfig.on('eleventy.after', postcssBuild);
  eleventyConfig.on('eleventy.after', indexContent);

  eleventyConfig.setServerOptions({
    liveReload: true,
    port: 8080,
    showAllHosts: true,

    /**
     * Whether DOM diffing updates are applied where possible instead of page reloads
     */
    domDiff: false,
  });

  eleventyConfig.addWatchTarget('./site/');
  eleventyConfig.addWatchTarget('./shortcode/');

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
