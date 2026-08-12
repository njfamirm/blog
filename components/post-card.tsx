import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostCard({ post, index }: { post: PostMeta; index?: number }) {
  return (
    <Link
      href={`/en/blog/${post.slug}`}
      className="group block px-4 py-4 md:px-6 md:py-5 hover:bg-foreground hover:text-background transition-none duration-0"
    >
      <div className="flex gap-3 md:gap-5">
        {index !== undefined && (
          <span
            aria-hidden
            className="font-mono text-xs md:text-sm text-muted-foreground pt-1 tabular-nums group-hover:text-background/50"
          >
            {String(index).padStart(3, '0')}
          </span>
        )}
        <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6 min-w-0">
          <div className="max-w-3xl">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-balance group-hover:text-background">
              {post.title}
            </h2>
            <p className="mt-1.5 text-muted-foreground font-mono text-xs md:text-sm leading-relaxed line-clamp-2 group-hover:text-background/80">
              {post.summary}
            </p>
          </div>
          <time
            dateTime={post.date}
            className="font-mono text-[11px] md:text-xs text-muted-foreground whitespace-nowrap group-hover:text-background/70"
          >
            {post.date}
          </time>
        </div>
      </div>
    </Link>
  )
}
