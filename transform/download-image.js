const {basename} = require('path');
const {writeFileSync} = require('fs');
const fetch = require('@11ty/eleventy-fetch');

async function download(url, path) {
  let buffer = await fetch(url, {
    duration: "1d",
    type: "buffer",
  });

  writeFileSync(path, Buffer.from(buffer));
}

async function downloadImage(markdown) {
  const regex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
  const matches = markdown.matchAll(regex);
  for (const match of matches) {
    const url = match[1];
    const path = 'dist/img/' + basename(url);
    await download(url, path);
    markdown = markdown.replace(url, path);
  }

  return markdown;
}

module.exports = {downloadImage};
