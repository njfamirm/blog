---
pagination:
  data: blogPost
  size: 1
  alias: post
  reverse: true
  addAllPagesToCollections: true
permalink: /en/blog/{{post.attributes.title | slugify}}.html
eleventyComputed:
  publishedAt: '{{post.attributes.publishedAt}}'
  title: '{{post.attributes.title}}'
  description: '{{post.attributes.description}}'
  content: '{{post.attributes.content}}'
  keywords: '{{post.attributes.keywords}}'
  socialImage: 'https://admin.njfamirm.ir{{post.attributes.cover.data.attributes.url}}'
---

{{ content | downloadImage }}
