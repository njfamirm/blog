'use client'

import { useState } from 'react'
import type { PostMeta, TagInfo } from '@/lib/blog'
import { TagIndex } from '@/components/tag-index'
import { NodeGraph } from '@/components/node-graph'

interface TopicsSectionProps {
  posts: PostMeta[]
  tags: TagInfo[]
}

export function TopicsSection({ posts, tags }: TopicsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'graph'>('grid')

  return (
    <section className="md:col-span-12 bg-background border-t border-border">
      {/* Header bar with Mode Switcher */}
      <div className="p-4 md:p-5 border-b border-border bg-background flex items-center justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          [TOPICS & SYSTEM GRAPH]
        </h2>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 border border-border transition-none duration-0 ${
              viewMode === 'grid'
                ? 'bg-foreground text-background font-bold border-foreground'
                : 'text-muted-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            [GRID]
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1 border border-border transition-none duration-0 ${
              viewMode === 'graph'
                ? 'bg-foreground text-background font-bold border-foreground'
                : 'text-muted-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            [SYSTEM GRAPH]
          </button>
        </div>
      </div>

      {/* Body View */}
      <div className={viewMode === 'grid' ? 'p-5 md:p-6' : 'p-0'}>
        {viewMode === 'grid' ? (
          <TagIndex tags={tags} />
        ) : (
          <NodeGraph posts={posts} tags={tags} />
        )}
      </div>
    </section>
  )
}
