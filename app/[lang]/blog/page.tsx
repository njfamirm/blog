import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSortedPostsData } from '@/lib/blog'

export default function BlogPage() {
  const blogPosts = getSortedPostsData()
  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background text-foreground">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground mb-8 md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-12 md:mb-16 border-b border-border pb-8 md:pb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] font-mono text-balance">
            Writing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Technical insights on architecture, leadership, and building systems that create business value.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 divide-y divide-border border border-border">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/en/blog/${post.slug}`}
              className="group block p-6 md:p-12 hover:bg-foreground hover:text-background transition-none duration-0"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
                <div className="max-w-4xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance group-hover:text-background">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm md:text-base lg:text-lg leading-relaxed group-hover:text-background/80 max-w-2xl">
                    {post.summary}
                  </p>
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border px-2 py-1 font-mono text-xs text-muted-foreground group-hover:border-background/30 group-hover:text-background/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 font-mono text-xs md:text-sm lg:text-base opacity-60 group-hover:opacity-100 group-hover:text-background whitespace-nowrap">
                  <time>{post.date}</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground text-center md:text-left">
              © 2026 Amir Mohammad Najafi.
            </p>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              ENGINEERED LOGIC → TEAM COLLABORATION → SHIPPED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
