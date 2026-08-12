import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

function NavLink({
  post,
  direction,
}: {
  post: PostMeta
  direction: 'newer' | 'older'
}) {
  const alignRight = direction === 'newer'
  return (
    <Link
      href={`/en/blog/${post.slug}`}
      className={`group flex-1 block p-4 md:p-5 border border-border hover:bg-foreground hover:text-background transition-none duration-0 ${
        alignRight ? 'md:text-right' : ''
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-background/60">
        {direction === 'newer' ? 'Newer ↑' : 'Older ↓'}
      </span>
      <span className="block mt-2 font-bold tracking-tight text-balance group-hover:text-background">
        {post.title}
      </span>
    </Link>
  )
}

export function PostNav({
  newer,
  older,
}: {
  newer?: PostMeta
  older?: PostMeta
}) {
  if (!newer && !older) return null

  return (
    <nav className="flex flex-col md:flex-row gap-3">
      {older && <NavLink post={older} direction="older" />}
      {newer && <NavLink post={newer} direction="newer" />}
    </nav>
  )
}
