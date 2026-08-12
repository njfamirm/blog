import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
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
}

export interface Post extends PostMeta {
  contentHtml: string
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
    tags: (data.tags || []) as string[],
    canonical: data.canonical as string | undefined,
  }

  return { meta, content }
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

export function getSortedPostsData(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => readPostFile(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostData(slug: string): Promise<Post> {
  const { meta, content } = readPostFile(slug)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content)

  return { ...meta, contentHtml: processedContent.toString() }
}
