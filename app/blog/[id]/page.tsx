import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

// Mock blog post data - In production, fetch based on [id] param
const blogPost = {
  id: 1,
  title: 'Building Distributed Systems That Scale',
  date: '2024-01-15',
  readingTime: '8 min',
  tags: ['Architecture', 'Microservices', 'Scale'],
  content: `
Distributed systems are hard. Anyone who tells you otherwise is selling something. But they're also necessary at scale, and when done right, they enable capabilities that monoliths simply cannot achieve.

## The Fundamental Truth

The CAP theorem isn't just academic theory—it's a forcing function that shapes every architectural decision you'll make. You cannot have consistency, availability, and partition tolerance all at once. Choose wisely, because this choice cascades through your entire system.

## Designing for Failure

In distributed systems, failure is not an edge case—it's the normal operating condition. Network partitions will happen. Services will go down. Latency will spike. Your architecture must treat these as first-class concerns.

### Circuit Breakers Are Your Friend

Implementing circuit breakers isn't optional. They're the difference between a partial outage and a complete system collapse. When a downstream service starts failing, your circuit breaker should trip, preventing cascade failures from taking down the entire system.

\`\`\`typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
\`\`\`

## The Importance of Idempotency

Every operation in a distributed system should be idempotent. Network failures mean requests get retried. Without idempotency, retries can cause duplicate operations, data corruption, and subtle bugs that only appear at scale.

## Observability: Know Your System

You cannot debug a distributed system with print statements. You need structured logging, distributed tracing, and metrics that actually matter. Not vanity metrics—actionable signals that help you understand system behavior.

### The Golden Signals

1. **Latency**: How long does it take to serve a request?
2. **Traffic**: How much demand is being placed on your system?
3. **Errors**: What is the rate of failed requests?
4. **Saturation**: How "full" is your service?

These four metrics give you a clear picture of system health. Everything else is secondary.

## Event-Driven Architecture

Events are the natural communication pattern for distributed systems. They provide loose coupling, enable audit trails, and make it possible to add new consumers without changing producers.

But events come with their own challenges: ordering guarantees, exactly-once delivery, schema evolution. These aren't trivial problems.

## The Human Element

Architecture doesn't exist in a vacuum. The best technical solution means nothing if your team can't operate it. Consider cognitive load, operational complexity, and the on-call burden when making architectural decisions.

## Conclusion

Building distributed systems that scale requires a mindset shift. Embrace failure, design for resilience, and always think about the operational burden you're creating for your team. The best architecture is the one your team can actually operate in production.
  `.trim(),
}

export default function BlogPostPage() {
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
            </nav>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-6 py-16">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Writing
        </Link>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto mb-16 border-b border-border pb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95] text-balance">
            {blogPost.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex items-center gap-6 mb-6 font-mono text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{blogPost.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blogPost.readingTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2">
            {blogPost.tags.map((tag) => (
              <span
                key={tag}
                className="border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            {blogPost.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-4xl font-black tracking-tight mt-16 mb-6">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-2xl font-bold tracking-tight mt-12 mb-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              
              // Handle code blocks
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```typescript|```/g, '').trim()
                return (
                  <pre key={index} className="bg-secondary border border-border p-6 overflow-x-auto my-8">
                    <code className="font-mono text-sm leading-relaxed">{code}</code>
                  </pre>
                )
              }
              
              // Handle ordered lists
              if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split('\n').filter(line => line.trim())
                return (
                  <ol key={index} className="space-y-3 my-8 list-decimal list-inside">
                    {items.map((item, i) => (
                      <li key={i} className="text-lg leading-relaxed">
                        <span className="font-bold">{item.split(':')[0].replace(/^\d+\.\s\*\*/, '').replace('**', '')}:</span>
                        {item.split(':').slice(1).join(':')}
                      </li>
                    ))}
                  </ol>
                )
              }
              
              // Regular paragraphs
              return (
                <p key={index} className="text-lg leading-relaxed mb-6 text-foreground">
                  {paragraph}
                </p>
              )
            })}
          </div>
        </div>

        {/* Related Articles / CTA */}
        <div className="max-w-2xl mx-auto mt-24 pt-12 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Read More Articles
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </article>

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
