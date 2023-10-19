function trim(content) {
  return content.trim();
}

function simpleDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function dateString(date, locale) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function timeString(time, locale) {
  return new Date(time).toLocaleTimeString(locale);
}

function slugify(string) {
  // return encodeURIComponent(String(string).trim().toLowerCase().replace(/\s+/g, '-'));
  return String(string).trim().toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
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

function getHostname(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

module.exports = {
  trim,
  simpleDate,
  normalizeKeyword,
  getHostname,
  dateString,
  timeString,
  slugify,
  jsonParse,
  jsonStringify,
};
