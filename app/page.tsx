import Link from 'next/link'

// Mock blog posts data - limiting to 5 as requested
const latestPosts = [
  {
    id: 1,
    title: 'Building Distributed Systems That Scale',
    summary: 'Lessons learned from architecting microservices at enterprise scale.',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Technical Debt: Investment, Not Failure',
    summary: 'Reframing technical debt as strategic investment.',
    date: '2024-01-10',
  },
  {
    id: 3,
    title: 'Event-Driven Architecture: Beyond the Hype',
    summary: 'Practical implementation patterns for event-driven systems.',
    date: '2024-01-05',
  },
  {
    id: 4,
    title: 'The Myth of Zero-Config',
    summary: 'Why abstraction layers often leak and cost more than they save.',
    date: '2024-01-02',
  },
  {
    id: 5,
    title: 'Team Topologies in Practice',
    summary: 'Aligning software architecture with organizational structure.',
    date: '2023-12-28',
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      {/* 
        Layout System: Bento Grid via strict CSS Grid.
        Spacing: 1px gap system (bg-border with gap-px).
        Radius: Sharp edges (default/explicit rounded-none).
      */}
      <main className="grid grid-cols-1 md:grid-cols-12 min-h-screen gap-px bg-border border-b border-border max-w-screen-2xl mx-auto border-x">

        {/* 
          Area: Statement 
          Content: Short, punchy architectural statement.
          Placement: Top Left, spanning significant width.
        */}
        <section className="md:col-span-8 bg-background p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
              Signal <br /> Over <br /> Noise.
            </h1>
            <p className="text-lg md:text-xl max-w-[65ch] leading-relaxed font-mono">
              Amir Mohammad Najafi (@njfamirm). Senior Architect.
              <br />
              Focusing on shipping value, managing complexity, and calm technology.
              <br />
              Form follows pure function.
            </p>
          </div>
        </section>

        {/* 
          Area: Connect
          Content: Raw links using @njfamirm identity. No icons.
          Placement: Sidebar area.
        */}
        <section className="md:col-span-4 bg-background p-6 md:p-8 flex flex-col justify-end">
          <nav className="flex flex-col gap-px bg-border border border-border">
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
                className="block bg-background p-4 font-mono text-sm hover:bg-foreground hover:text-background transition-none duration-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        {/* 
          Area: 3D_Canvas
          Instruction: Empty container with id='canvas-container'.
          Future behavior: undulating 3D object.
        */}
        <section className="md:col-span-12 h-64 md:h-96 bg-background relative border-t border-b border-border">
          <div id="canvas-container" className="absolute inset-0 w-full h-full" />
          {/* Visual placeholder to indicate area if empty */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-xs uppercase text-muted-foreground/30">[3D_Context_Layer_v1.0]</span>
          </div>
        </section>

        {/* 
          Area: Writings_Feed
          Content: Raw, border-separated list of 5 most recent articles.
          Strict: Title, description, monospace date ONLY.
        */}
        <section className="md:col-span-12 bg-background">
          <div className="grid grid-cols-1 divide-y divide-border">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block p-6 md:p-8 hover:bg-foreground hover:text-background transition-none duration-0"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 group-hover:text-background">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-mono text-sm leading-relaxed group-hover:text-background/80">
                      {post.summary}
                    </p>
                  </div>
                  <time className="font-mono text-sm whitespace-nowrap opacity-60 group-hover:opacity-100">
                    {post.date}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
