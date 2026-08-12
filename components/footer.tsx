import { site, links } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <nav className="flex flex-wrap gap-x-1 gap-y-2 mb-6 -ml-2">
          {[...links, { short: 'RSS', href: '/feed.xml' }].map((link) => (
            <a
              key={link.short}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground px-2 py-1 hover:bg-foreground hover:text-background transition-none duration-0"
            >
              {link.short}
            </a>
          ))}
        </nav>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}.
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
            ENGINEERED LOGIC → TEAM COLLABORATION → SHIPPED.
          </p>
        </div>
      </div>
    </footer>
  )
}
