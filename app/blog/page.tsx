import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { getSortedPostsData } from '@/lib/blog'

export default function BlogPage() {
  const blogPosts = getSortedPostsData()
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              AMN
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="/blog"
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
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-16 border-b border-border pb-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            Writing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Technical insights on architecture, leadership, and building systems that create business value.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-px">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-border p-8 hover:border-primary transition-colors group bg-background"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {post.summary}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
              </div>
              <div className="flex gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
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
