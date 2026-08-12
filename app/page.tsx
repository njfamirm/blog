import { getSortedPostsData } from '@/lib/blog'
import { PostCard } from '@/components/post-card'
import { Footer } from '@/components/footer'
import { links } from '@/lib/site'

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
        <section className="md:col-span-8 bg-background p-6 md:p-8 flex flex-col justify-between min-h-[50vh]">
          <div className="flex-1 flex flex-col justify-center">
            {/* Fluid size: a fixed 8rem overflowed this column between 1024px and ~1450px. */}
            <h1 className="text-[clamp(2.75rem,8.5vw,8rem)] font-black tracking-tighter leading-[0.8] mb-8 uppercase text-balance font-sans">
              NAVIGATING <br /> COMPLEXITY.
            </h1>
          </div>
          <div className="border-t border-border pt-8 mt-8">
            <p className="text-lg md:text-xl lg:text-2xl max-w-[60ch] leading-relaxed font-mono">
              Bridging the realities of system architecture with software automation. My focus is on designing stable B2B systems and shipping value alongside a driven team.
              <br />
              Amir Mohammad Najafi (@njfamirm) — Software Architect & Tech Lead at Nexim.
            </p>
          </div>
        </section>

        {/* 
          Area: Identity Links
          Content: Minimalist grid of links. Monospace only.
          INTERACTION: INDIVIDUAL LINKS HOVER ONLY (Hard Invert).
        */}
        <section className="md:col-span-4 bg-background flex flex-col border-t md:border-t-0 md:border-l border-border h-full">
          <div className="p-6 md:p-8 border-b border-border bg-background">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">[CONNECT]</span>
          </div>

          <nav className="flex-1 flex flex-col">
            {links.map((link) => (
              <a
                key={link.short}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex-1 flex items-center p-6 md:p-8 font-mono text-sm md:text-base border-b border-border last:border-b-0 hover:bg-foreground hover:text-background transition-none duration-0 break-all sm:break-normal"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        {/* 
          Area: Writings Log / Feed
          Content: Top 5 Architectural Essays. Technical logs with monospace metadata.
          INTERACTION: HOVER (Subtle fill + left accent bar).
        */}
        <section className="md:col-span-12 bg-background border-t border-border">
          <div className="p-6 md:p-8 border-b border-border bg-background">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Writing</h2>
          </div>
          <div className="grid grid-cols-1 divide-y divide-border">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
