import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface Post {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
  contentHtml: string
  canonical?: string
}

export function getSortedPostsData() {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the slug
    return {
      slug,
      title: matterResult.data.title as string,
      summary: matterResult.data.summary as string,
      date: matterResult.data.date instanceof Date 
        ? matterResult.data.date.toISOString().split('T')[0]
        : String(matterResult.data.date),
      tags: (matterResult.data.tags || []) as string[],
    }
  })
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the slug and contentHtml
  return {
    slug,
    contentHtml,
    title: matterResult.data.title as string,
    summary: matterResult.data.summary as string,
    date: matterResult.data.date instanceof Date 
      ? matterResult.data.date.toISOString().split('T')[0]
      : String(matterResult.data.date),
    tags: (matterResult.data.tags || []) as string[],
    canonical: matterResult.data.canonical as string | undefined,
  }
}
