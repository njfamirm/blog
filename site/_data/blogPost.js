const fetch = require('@11ty/eleventy-fetch');

const apiToken = process.env.cmsApiToken;
const cmsDomain = process.env.cmsDomain ?? 'https://admin.njfamirm.ir';
const url = cmsDomain + '/api/blog-posts?populate=*';

async function list() {
  const response = await fetch(url, {
    directory: '.cache',
    duration: '1h',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  });

  return response.data;
}

module.exports = list;
