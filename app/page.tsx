import Link from 'next/link'
import { getSortedPostsData, getPostNumbers, getAllTags } from '@/lib/blog'
import { PostLog } from '@/components/post-log'
import { TagIndex } from '@/components/tag-index'
import { Footer } from '@/components/footer'
import { links } from '@/lib/site'

export default function Page() {
  const allPosts = getSortedPostsData()
  const latestPosts = allPosts.slice(0, 8)
  const numbers = getPostNumbers()
  const tags = getAllTags()
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
          Area: Topics
          Content: Every tag, linking into the tag pages.
          INTERACTION: PER-TAG HOVER (Hard Invert).
        */}
        <section className="md:col-span-12 bg-background border-t border-border">
          <div className="p-6 md:p-8 border-b border-border bg-background">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">[TOPICS]</h2>
          </div>
          <div className="p-6 md:p-8">
            <TagIndex tags={tags} />
          </div>
        </section>

        {/*
          Area: Writings Log / Feed
          Content: Latest 8 entries as a year-grouped log, same shape as /en/blog.
          INTERACTION: HOVER (Hard Invert).
        */}
        <section className="md:col-span-12 bg-background border-t border-border">
          <div className="p-6 md:p-8 border-b border-border bg-background flex items-center justify-between gap-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Writing</h2>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {latestPosts.length}/{allPosts.length}
            </span>
          </div>
          <div className="p-6 md:p-8">
            <PostLog posts={latestPosts} numbers={numbers} />
            <Link
              href="/en/blog"
              className="inline-flex items-center gap-2 mt-8 font-mono text-xs uppercase tracking-wider text-muted-foreground px-3 py-2 border border-border hover:bg-foreground hover:text-background hover:border-foreground transition-none duration-0"
            >
              All Writing →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
