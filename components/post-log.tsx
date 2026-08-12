import { PostCard } from '@/components/post-card'
import type { PostMeta } from '@/lib/blog'

/** Reverse-chronological list, grouped under monospace year rules. */
export function PostLog({
  posts,
  numbers,
}: {
  posts: PostMeta[]
  numbers: Map<string, number>
}) {
  // Posts arrive newest-first, so years come out descending.
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))]

  return (
    <>
      {years.map((year) => {
        const yearPosts = posts.filter((post) => post.date.startsWith(year))
        return (
          <section key={year} className="mb-10 md:mb-14 last:mb-0">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="font-mono text-sm font-bold tabular-nums tracking-widest">
                {year}
              </h3>
              <div className="flex-1 border-t border-border" />
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {yearPosts.length}
              </span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-border border border-border">
              {yearPosts.map((post) => (
                <PostCard key={post.slug} post={post} index={numbers.get(post.slug)} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
