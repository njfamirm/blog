function trimer(content) {
  return content.trim();
}

function simpleDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function humanReadableDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function slugify(string) {
  // return encodeURIComponent(String(string).trim().toLowerCase().replace(/\s+/g, '-'));
  return String(string).trim().toLowerCase().replace(/\s+/g, '-').replace(/\'/g, '');
}

function normalizeKeyword(keyword) {
  if (!keyword || keyword.length === 0) return [];
  let keywordList = keyword;

  if (typeof keyword === 'string') {
    keywordList = keyword.split('\n');
  }

  return keywordList.map((keyword) => keyword.trim().toLowerCase()).join(', ');
}

function jsonParse(content) {
  return JSON.parse(content);
}

function jsonStringify(content) {
  return JSON.stringify(content);
}

module.exports = {
  trimer,
  humanReadableDate,
  simpleDate,
  slugify,
  normalizeKeyword,
  jsonParse,
  jsonStringify,
};
