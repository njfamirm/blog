function countKeywords(posts) {
  const keywordCounts = {};

  posts.forEach((post) => {
    post.data.keywords.forEach((keyword) => {
      if (!keywordCounts[keyword]) {
        keywordCounts[keyword] = 1;
      } else {
        keywordCounts[keyword]++;
      }
    });
  });

  const keywordList = Object.keys(keywordCounts).map((keyword) => {
    return {keyword, count: keywordCounts[keyword]};
  });

  keywordList.sort((a, b) => b.count - a.count);

  return keywordList;
}

module.exports = {countKeywords};
