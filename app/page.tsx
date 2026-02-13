import Link from 'next/link'
import { getSortedPostsData } from '@/lib/blog'

export default function Page() {
  const latestPosts = getSortedPostsData().slice(0, 5)
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-foreground selection:text-background">
      {/* 
        Layout System: Bento Grid via strict CSS Grid.
        Spacing: 1px explicit borders (gap-px).
        Radius: Strict 0px.
        Max-width: 1536px (2xl).
      */}
      <main className="grid grid-cols-1 md:grid-cols-12 min-h-screen gap-px bg-border border-b border-border max-w-screen-2xl mx-auto border-x">

        {/* 
          Area: Hero Statement 
          Content: Architecting Clarity. Shipping Value. @njfamirm
          INTERACTION: STATIC (No hover effect).
        */}
        <section className="md:col-span-8 bg-background p-8 flex flex-col justify-between min-h-[50vh]">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-8 uppercase text-balance">
              Architecting <br /> Clarity.
            </h1>
          </div>
          <div className="border-t border-border pt-8 mt-8">
            <p className="text-xl md:text-2xl max-w-[60ch] leading-relaxed font-mono">
              Shipping Value.
              <br />
              Amir Mohammad Najafi (@njfamirm).
              <br />
              Software Architect & Tech Lead at Nexim.
            </p>
          </div>
        </section>

        {/* 
          Area: Identity Links
          Content: Minimalist grid of links. Monospace only.
          INTERACTION: INDIVIDUAL LINKS HOVER ONLY (Hard Invert).
        */}
        <section className="md:col-span-4 bg-background flex flex-col border-l border-border h-full">
          <div className="p-8 border-b border-border bg-background">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">[CONNECT]</span>
          </div>

          <nav className="flex-1 flex flex-col">
            {[
              { label: 'github.com/njfamirm', href: 'https://github.com/njfamirm' },
              { label: 'medium.com/@njfamirm', href: 'https://medium.com/@njfamirm' },
              { label: 'twitter.com/njfamirm', href: 'https://twitter.com/njfamirm' },
              { label: 'mailto:hi@example.com', href: 'mailto:hi@example.com' }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex-1 flex items-center p-8 font-mono text-base border-b border-border last:border-b-0 hover:bg-foreground hover:text-background transition-none duration-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        {/* 
          Area: Writings Log / Feed
          Content: Top 5 Architectural Essays. Technical logs with monospace metadata.
          INTERACTION: HOVER (Hard Invert).
        */}
        <section className="md:col-span-12 bg-background border-t border-border">
          <div className="p-8 border-b border-border bg-background">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Writing</h2>
          </div>
          <div className="grid grid-cols-1 divide-y divide-border">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-8 md:p-12 hover:bg-foreground hover:text-background transition-none duration-0"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
                  <div className="max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance group-hover:text-background">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-mono text-base md:text-lg leading-relaxed group-hover:text-background/80 max-w-2xl">
                      {post.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 font-mono text-sm md:text-base opacity-60 group-hover:opacity-100 group-hover:text-background whitespace-nowrap">
                    <time>{post.date}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
