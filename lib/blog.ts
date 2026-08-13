import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
  canonical?: string
  draft?: boolean
  cover?: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

/** URL form of a tag. Display casing varies ("AI", "LLM"), links must not. */
export function tagSlug(tag: string) {
  return tag.toLowerCase()
}

const coverExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif']

/**
 * Covers live at public/img/blog/<slug>/cover.<ext> by convention, so a post
 * gets one by dropping the file in. Frontmatter `cover` overrides the lookup.
 */
function findCover(slug: string, fromMatter?: string): string | undefined {
  if (fromMatter) return fromMatter

  for (const ext of coverExtensions) {
    const publicPath = `/img/blog/${slug}/cover.${ext}`
    if (fs.existsSync(path.join(process.cwd(), 'public', publicPath))) {
      return publicPath
    }
  }
}

function readPostFile(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const meta: PostMeta = {
    slug,
    title: data.title as string,
    summary: data.summary as string,
    // gray-matter parses unquoted YAML dates into Date objects
    date: data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : String(data.date),
    tags: (data.tags || []).map(String) as string[],
    canonical: data.canonical as string | undefined,
    draft: data.draft === true,
    cover: findCover(slug, data.cover as string | undefined),
  }

  return { meta, content }
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

/** Newest first. */
export function getSortedPostsData(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => readPostFile(slug).meta)
    .filter((meta) => !meta.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/**
 * Chronological number of each post, oldest = 1. Stable as new posts land,
 * which is why it counts up from the oldest rather than down from the newest.
 */
export function getPostNumbers(): Map<string, number> {
  const posts = getSortedPostsData()
  return new Map(posts.map((post, i) => [post.slug, posts.length - i]))
}

export interface TagInfo {
  slug: string
  label: string
  count: number
}

/** Every tag, most used first, then alphabetical. */
export function getAllTags(): TagInfo[] {
  const byslug = new Map<string, { label: string; count: number }>()

  for (const post of getSortedPostsData()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag)
      const existing = byslug.get(slug)
      if (existing) existing.count += 1
      else byslug.set(slug, { label: tag, count: 1 })
    }
  }

  return [...byslug.entries()]
    .map(([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}

export function getPostsByTag(slug: string): PostMeta[] {
  return getSortedPostsData().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug)
  )
}

/** Neighbours in reverse-chronological order. */
export function getAdjacentPosts(slug: string) {
  const posts = getSortedPostsData()
  const i = posts.findIndex((post) => post.slug === slug)
  if (i === -1) return { newer: undefined, older: undefined }
  return { newer: posts[i - 1], older: posts[i + 1] }
}

export async function getPostData(slug: string): Promise<Post> {
  const { meta, content } = readPostFile(slug)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content)

  return { ...meta, contentHtml: processedContent.toString() }
}
