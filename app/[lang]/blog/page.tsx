import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSortedPostsData, getPostNumbers, getAllTags } from '@/lib/blog'
import { PostLog } from '@/components/post-log'
import { TagIndex } from '@/components/tag-index'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Technical insights on architecture, leadership, and building systems that create business value.',
  alternates: { canonical: '/en/blog' },
}

export default function BlogPage() {
  const posts = getSortedPostsData()
  const numbers = getPostNumbers()
  const tags = getAllTags()

  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background text-foreground">
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground mb-8 md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>

        <div className="mb-12 md:mb-16 border-b border-border pb-8 md:pb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] font-mono text-balance">
            Writing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Technical insights on architecture, leadership, and building systems that create business value.
          </p>
        </div>

        {/* Tag index */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            [TOPICS]
          </h2>
          <TagIndex tags={tags} />
        </div>

        <PostLog posts={posts} numbers={numbers} />
      </main>

      <Footer />
    </div>
  )
}
