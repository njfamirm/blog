import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSortedPostsData } from '@/lib/blog'

export default function BlogPage() {
  const blogPosts = getSortedPostsData()
  return (
    <div className="min-h-screen selection:bg-foreground selection:text-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight font-mono">
              @njfamirm
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="/en/blog"
                className="font-mono text-sm uppercase tracking-wider text-primary"
              >
                Writing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-foreground hover:text-background transition-none duration-0 px-3 py-2 border border-transparent hover:border-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-16 border-b border-border pb-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] font-mono">
            Writing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Technical insights on architecture, leadership, and building systems that create business value.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 divide-y divide-border border border-border">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/en/blog/${post.slug}`}
              className="group block p-8 md:p-12 hover:bg-foreground hover:text-background transition-none duration-0"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
                <div className="max-w-4xl">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance group-hover:text-background">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground font-mono text-base md:text-lg leading-relaxed group-hover:text-background/80 max-w-2xl">
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
                <div className="flex flex-col items-end gap-2 font-mono text-sm md:text-base opacity-60 group-hover:opacity-100 group-hover:text-background whitespace-nowrap">
                  <time>{post.date}</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">
              © 2024 Amir Mohammad Najafi. Building systems that matter.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              ARCHITECT → ENGINEER → HUMAN
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
