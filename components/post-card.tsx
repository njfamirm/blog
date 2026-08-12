import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
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
          {post.tags.length > 0 && (
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
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </div>
    </Link>
  )
}
