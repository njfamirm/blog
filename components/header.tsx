'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isBlog = pathname?.startsWith('/en/blog')
  const isTools = pathname?.startsWith('/tools')

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto border-x-0 md:border-x border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold tracking-tight font-mono hover:bg-foreground hover:text-background transition-none duration-0 px-2 py-1 -ml-2 select-none uppercase"
          >
            @njfamirm
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 font-mono">
            <Link
              href="/tools"
              className={`text-xs sm:text-sm uppercase tracking-wider px-3 py-2 border border-transparent hover:border-foreground hover:bg-foreground hover:text-background transition-none duration-0 ${isTools ? 'bg-foreground text-background font-bold' : 'text-foreground'
                }`}
            >
              Tools
            </Link>
            <Link
              href="/en/blog"
              className={`text-xs sm:text-sm uppercase tracking-wider px-3 py-2 border border-transparent hover:border-foreground hover:bg-foreground hover:text-background transition-none duration-0 ${isBlog ? 'bg-foreground text-background font-bold' : 'text-foreground'
                }`}
            >
              Writing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
