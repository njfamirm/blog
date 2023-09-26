const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const {postcssProcess} = require('./filter/postcss.js');
const {getHostname} = require('./filter/url.js');
const {date} = require('./filter/date.js');
const {keywordSplit} = require('./filter/keyword.js');

const {imageShortcode} = require('./shortcode/image.js');
const {editOnGitHub} = require('./shortcode/edit-on-github.js');

const {minifyHtml} = require('./transform/minify-html');
const {esbuildFilter, esbuildBuild} = require('./transform/esbuild.js');

/**
 * 11ty configuration.
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'assets': '/',
    'img': '/img',
    'img/meta/favicon.ico': '/favicon.ico',
  });

  eleventyConfig.setQuietMode(true);

  eleventyConfig.addWatchTarget('site');

  eleventyConfig.on("eleventy.before", esbuildBuild);

  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('editOnGitHub', editOnGitHub);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(directoryOutputPlugin, {
    columns: {
      filesize: true,
      benchmark: true,
    },
    warningFileSize: 400 * 1000,
  });

  eleventyConfig.addFilter('getHostname', getHostname);
  eleventyConfig.addFilter('humanReadableDate', date);
  eleventyConfig.addAsyncFilter('postcss', postcssProcess);
  eleventyConfig.addAsyncFilter('esbuild', esbuildFilter);
  eleventyConfig.addAsyncFilter('keywordSplit', keywordSplit);

  eleventyConfig.addTransform('minifyHtml', minifyHtml);
  eleventyConfig.addTransform('trimer', (content) => content.trim());

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
