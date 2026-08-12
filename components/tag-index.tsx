import Link from 'next/link'
import type { TagInfo } from '@/lib/blog'

export function TagIndex({ tags }: { tags: TagInfo[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/en/tag/${tag.slug}`}
          className="border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-none duration-0"
        >
          #{tag.label}
          <span className="ml-1.5 opacity-50 tabular-nums">{tag.count}</span>
        </Link>
      ))}
    </div>
  )
}
