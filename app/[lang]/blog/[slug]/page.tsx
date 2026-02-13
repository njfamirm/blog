import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostData, getAllPostSlugs } from '@/lib/blog'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()
  return posts.map((post) => ({
    lang: 'en',
    slug: post.params.slug,
  }))
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
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await params
  const post = await getPostData(slug)

  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight font-mono">
              @njfamirm
            </Link>
            <nav className="flex items-center gap-4 sm:gap-8">
              <Link
                href="/en/blog"
                className="font-mono text-xs sm:text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground"
              >
                Writing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/en/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground mb-8 md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Writing
        </Link>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto mb-12 md:mb-16 border-b border-border pb-8 md:pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.95] text-balance font-mono">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm text-muted-foreground">
              <span>{post.date}</span>
            </div>
            {post.canonical && (
              <div className="font-mono text-[10px] sm:text-xs text-muted-foreground break-all sm:break-normal">
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

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-2 sm:px-3 py-1 sm:py-1.5 font-mono text-[10px] sm:text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="max-w-2xl mx-auto">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {/* Related Articles / CTA */}
        <div className="max-w-2xl mx-auto mt-16 md:mt-24 pt-8 md:pt-12 border-t border-border">
          <Link
            href="/en/blog"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-mono text-xs sm:text-sm uppercase tracking-wider hover:bg-background hover:text-foreground transition-none duration-0 border border-foreground"
          >
            Read More Articles
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground text-center md:text-left">
              © 2024 Amir Mohammad Najafi. Building systems that matter.
            </p>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              ARCHITECT → ENGINEER → HUMAN
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
