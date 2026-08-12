import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/en/blog/${post.slug}`}
      className="group block px-4 py-4 md:px-6 md:py-5 hover:bg-foreground hover:text-background transition-none duration-0"
    >
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6">
        <div className="max-w-3xl">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-balance group-hover:text-background">
            {post.title}
          </h2>
          <p className="mt-1.5 text-muted-foreground font-mono text-xs md:text-sm leading-relaxed line-clamp-2 group-hover:text-background/80">
            {post.summary}
          </p>
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-hover:border-background/30 group-hover:text-background/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <time
          dateTime={post.date}
          className="font-mono text-[11px] md:text-xs text-muted-foreground whitespace-nowrap group-hover:text-background/70"
        >
          {post.date}
        </time>
      </div>
    </Link>
  )
}
