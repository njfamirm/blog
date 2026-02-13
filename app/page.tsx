import Link from 'next/link'
import { ArrowRight, Github, Linkedin, ExternalLink } from 'lucide-react'
import { ThreeDElement } from '@/components/three-d-element'

// Mock blog posts data
const latestPosts = [
  {
    id: 1,
    title: 'Building Distributed Systems That Scale',
    summary: 'Lessons learned from architecting microservices at enterprise scale. How to handle failure, design for resilience, and maintain team velocity.',
    date: '2024-01-15',
    readingTime: '8 min',
    tags: ['Architecture', 'Microservices', 'Scale'],
  },
  {
    id: 2,
    title: 'Technical Debt: Investment, Not Failure',
    summary: 'Reframing technical debt as strategic investment. When to incur it, how to measure it, and why your business stakeholders should care.',
    date: '2024-01-10',
    readingTime: '6 min',
    tags: ['Leadership', 'Strategy', 'Engineering'],
  },
  {
    id: 3,
    title: 'Event-Driven Architecture: Beyond the Hype',
    summary: 'Practical implementation patterns for event-driven systems. Real-world examples, common pitfalls, and when NOT to use events.',
    date: '2024-01-05',
    readingTime: '10 min',
    tags: ['Architecture', 'Patterns', 'Integration'],
  },
]

const techStack = [
  'TypeScript',
  'Go',
  'Rust',
  'PostgreSQL',
  'Redis',
  'Kubernetes',
]

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              AMN
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="/blog"
                className="font-mono text-sm uppercase tracking-wider hover:text-primary transition-colors"
              >
                Writing
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-px bg-border">
          {/* Hero Block - Large */}
          <div className="md:col-span-6 lg:col-span-8 bg-background border border-border p-12 min-h-[400px] flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-balance mb-6 leading-[0.9]">
              Hi, I&apos;m Amir Mohammad Najafi
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Software Architect focused on <span className="text-foreground font-semibold">Business Value</span>, 
              <span className="text-foreground font-semibold"> Scalability</span>, and 
              <span className="text-foreground font-semibold"> Shipping Products</span>.
            </p>
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                Read My Writing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* The Human Touch Block - Medium with 3D Element */}
          <div className="md:col-span-6 lg:col-span-4 bg-background border border-border p-8 min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
            <ThreeDElement />
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-4 text-center">
              Engineering + Human Touch
            </p>
          </div>

          {/* Quick Links/Stack Block - Small */}
          <div className="md:col-span-6 lg:col-span-4 bg-background border border-border p-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
              Core Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="border border-border px-3 py-1.5 font-mono text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {tech}
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors group"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors group"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Latest Writings Block - Large, Wide */}
          <div className="md:col-span-6 lg:col-span-8 bg-background border border-border p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tight">Latest Writing</h2>
              <Link
                href="/blog"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-px">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block border border-border p-6 hover:border-primary transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                    <span>•</span>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">
              © 2024 Amir Mohammad Najafi. Building systems that matter.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              ARCHITECT → ENGINEER → HUMAN
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
