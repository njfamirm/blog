import Link from 'next/link'
import type { TagInfo } from '@/lib/blog'

export function TagIndex({ tags }: { tags: TagInfo[] }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/en/tag/${tag.slug}`}
          className="border border-border px-3 py-1.5 font-mono text-xs sm:text-sm font-medium text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-none duration-0"
        >
          #{tag.label}
          <span className="ml-2 opacity-50 tabular-nums">{tag.count}</span>
        </Link>
      ))}
    </div>
  )
}
