function getHostname(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

module.exports = {getHostname};
