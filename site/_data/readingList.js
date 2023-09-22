const fetch = require('@11ty/eleventy-fetch');

const apiToken = process.env.API_TOKEN;
const url = 'https://admin.njfamirm.ir/api/reading-list-search/';

async function list() {
  const response = await fetch(url, {
    directory: '.cache',
    duration: '2h',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  })

  return response;
};

module.exports = list;
