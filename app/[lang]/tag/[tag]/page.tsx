import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllTags, getPostsByTag, getPostNumbers } from '@/lib/blog'
import { PostCard } from '@/components/post-card'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ lang: 'en', tag: tag.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const info = getAllTags().find((t) => t.slug === tag)
  const label = info?.label ?? tag

  return {
    title: `#${label}`,
    description: `Posts tagged #${label}.`,
    alternates: { canonical: `/en/tag/${tag}` },
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const info = getAllTags().find((t) => t.slug === tag)
  const label = info?.label ?? tag
  const posts = getPostsByTag(tag)
  const numbers = getPostNumbers()

  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background text-foreground">
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-5xl">
        <Link
          href="/en/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground mb-8 md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          All Writing
        </Link>

        <div className="mb-8 md:mb-12 border-b border-border pb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-none font-mono break-all sm:break-normal">
            #{label}
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border border border-border">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} index={numbers.get(post.slug)} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
