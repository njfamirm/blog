import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostData, getAllPostSlugs, getAdjacentPosts, tagSlug } from '@/lib/blog'
import { Footer } from '@/components/footer'
import { PostNav } from '@/components/post-nav'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ lang: 'en', slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostData(slug)

  return {
    title: post.title,
    description: post.summary,
    alternates: post.canonical ? {
      canonical: post.canonical,
    } : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `/en/blog/${slug}`,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await params
  const post = await getPostData(slug)
  const { newer, older } = getAdjacentPosts(slug)

  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background text-foreground">
      <article className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Link
          href="/en/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground mb-8 md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Writing
        </Link>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto mb-12 md:mb-16 border-b border-border pb-8 md:pb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight text-balance font-mono">
            {post.title}
          </h1>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm text-muted-foreground">
              <time dateTime={post.date}>{post.date}</time>
            </div>
            {post.canonical && (
              <div className="font-mono text-xs text-muted-foreground break-all sm:break-normal">
                Originally published at:{' '}
                <a
                  href={post.canonical}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:bg-foreground hover:text-background transition-none duration-0 px-1"
                >
                  {new URL(post.canonical).hostname}
                </a>
              </div>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/en/tag/${tagSlug(tag)}`}
                  className="border border-border px-2.5 sm:px-3 py-1 font-mono text-xs sm:text-sm text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-none duration-0"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-3xl mx-auto">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {/* Neighbouring posts */}
        <div className="max-w-3xl mx-auto mt-16 md:mt-24 pt-8 md:pt-12 border-t border-border">
          <PostNav newer={newer} older={older} />
          <Link
            href="/en/blog"
            className="inline-flex items-center gap-2 mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground px-3 py-2 border border-transparent hover:bg-foreground hover:text-background hover:border-foreground transition-none duration-0"
          >
            <ArrowLeft className="h-3 w-3" />
            All Writing
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}
