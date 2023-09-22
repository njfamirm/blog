function keywordSplit(keyword) {
  return keyword.split('\n').map((word) => {
    return word.trim().toLowerCase();
  });
}

module.exports = {keywordSplit};
