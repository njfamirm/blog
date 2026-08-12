import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground text-center md:text-left">
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
