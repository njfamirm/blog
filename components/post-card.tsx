import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostCard({ post, index }: { post: PostMeta; index?: number }) {
  return (
    <Link
      href={`/en/blog/${post.slug}`}
      className="group block px-5 py-5 md:px-8 md:py-6 hover:bg-foreground hover:text-background transition-none duration-0"
    >
      <div className="flex gap-4 md:gap-6">
        {index !== undefined && (
          <span
            aria-hidden
            className="font-mono text-sm md:text-base text-muted-foreground pt-0.5 tabular-nums group-hover:text-background/50"
          >
            {String(index).padStart(3, '0')}
          </span>
        )}
        {post.cover ? (
          /* eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized */
          <img
            src={post.cover.thumb}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="hidden sm:block size-16 md:size-20 shrink-0 object-cover border border-border group-hover:border-background/25"
          />
        ) : (
          /* Keeps rows aligned; echoes the 45-degree hatch in the page background. */
          <div
            aria-hidden
            className="hidden sm:block size-16 md:size-20 shrink-0 border border-border text-muted-foreground opacity-40 group-hover:border-background/25 group-hover:text-background"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, currentColor 0, currentColor 0.5px, transparent 0, transparent 4px)',
            }}
          />
        )}
        <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-8 min-w-0">
          <div className="max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-balance group-hover:text-background">
              {post.title}
            </h2>
            <p className="mt-2 text-muted-foreground font-sans text-sm md:text-base leading-relaxed line-clamp-2 group-hover:text-background/90">
              {post.summary}
            </p>
          </div>
          <time
            dateTime={post.date}
            className="font-mono text-xs md:text-sm text-muted-foreground whitespace-nowrap group-hover:text-background/70"
          >
            {post.date}
          </time>
        </div>
      </div>
    </Link>
  )
}
