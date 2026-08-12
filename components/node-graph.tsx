'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PostMeta, TagInfo } from '@/lib/blog'

interface NodeItem {
  id: string
  type: 'tag' | 'post'
  label: string
  fullTitle: string
  url: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: Set<string>
}

interface EdgeItem {
  source: string
  target: string
}

interface NodeGraphProps {
  posts: PostMeta[]
  tags: TagInfo[]
}

export function NodeGraph({ posts, tags }: NodeGraphProps) {
  const router = useRouter()
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const [nodes, setNodes] = useState<NodeItem[]>([])
  const [edges, setEdges] = useState<EdgeItem[]>([])
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [zoom, setZoom] = useState<number>(1)

  const width = 1000
  const height = 540

  // Initialize node topology with generous radial distribution
  useEffect(() => {
    const newNodes: NodeItem[] = []
    const newEdges: EdgeItem[] = []
    const nodeMap = new Map<string, NodeItem>()

    // 1. Create Tag Nodes (Inner Orbit)
    tags.forEach((tag, idx) => {
      const angle = (idx / tags.length) * Math.PI * 2
      const radius = 170
      const node: NodeItem = {
        id: `tag-${tag.slug}`,
        type: 'tag',
        label: `#${tag.label}`,
        fullTitle: `Topic: #${tag.label} (${tag.count} entries)`,
        url: `/en/tag/${tag.slug}`,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 26,
        connections: new Set<string>(),
      }
      newNodes.push(node)
      nodeMap.set(node.id, node)
    })

    // 2. Create Post Nodes (Outer Orbit)
    posts.forEach((post, idx) => {
      const angle = (idx / posts.length) * Math.PI * 2 + 0.2
      const radius = 290
      const postId = `post-${post.slug}`
      const node: NodeItem = {
        id: postId,
        type: 'post',
        label: post.title.length > 20 ? `${post.title.slice(0, 20)}...` : post.title,
        fullTitle: post.title,
        url: `/en/blog/${post.slug}`,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 20,
        connections: new Set<string>(),
      }
      newNodes.push(node)
      nodeMap.set(postId, node)

      // Connect Post to its Tags
      post.tags.forEach((t) => {
        const tagNodeId = `tag-${t.toLowerCase()}`
        if (nodeMap.has(tagNodeId)) {
          newEdges.push({ source: postId, target: tagNodeId })
          node.connections.add(tagNodeId)
          nodeMap.get(tagNodeId)?.connections.add(postId)
        }
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [posts, tags])

  // Physics animation simulation loop with anti-overlap collision forces
  useEffect(() => {
    if (nodes.length === 0) return

    let animFrame: number
    const simulate = () => {
      setNodes((prevNodes) => {
        if (prevNodes.length === 0) return prevNodes

        const updated = prevNodes.map((n) => ({ ...n }))
        const kRepel = 12000
        const kAttract = 0.03
        const damping = 0.8
        const centerForce = 0.012
        const centerX = width / 2
        const centerY = height / 2

        // 1. Strong Repulsion & Collision Prevention between all node pairs
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const n1 = updated[i]
            const n2 = updated[j]
            const dx = n2.x - n1.x
            const dy = n2.y - n1.y
            const distSq = dx * dx + dy * dy + 1
            const dist = Math.sqrt(distSq)
            const minDistance = 110 // Minimum clear spacing

            let force = kRepel / distSq
            if (dist < minDistance) {
              force += (minDistance - dist) * 0.5 // Strong anti-collision push
            }

            const fx = (dx / dist) * force
            const fy = (dy / dist) * force

            if (n1.id !== draggedNodeId) {
              n1.vx -= fx
              n1.vy -= fy
            }
            if (n2.id !== draggedNodeId) {
              n2.vx += fx
              n2.vy += fy
            }
          }
        }

        // 2. Attraction along connected edges
        edges.forEach((edge) => {
          const n1 = updated.find((n) => n.id === edge.source)
          const n2 = updated.find((n) => n.id === edge.target)
          if (!n1 || !n2) return

          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (dist - 190) * kAttract

          const fx = (dx / dist) * force
          const fy = (dy / dist) * force

          if (n1.id !== draggedNodeId) {
            n1.vx += fx
            n1.vy += fy
          }
          if (n2.id !== draggedNodeId) {
            n2.vx -= fx
            n2.vy -= fy
          }
        })

        // 3. Center gravity & Boundary padding
        updated.forEach((node) => {
          if (node.id === draggedNodeId) return

          node.vx += (centerX - node.x) * centerForce
          node.vy += (centerY - node.y) * centerForce

          node.vx *= damping
          node.vy *= damping

          node.x += node.vx
          node.y += node.vy

          // Clamp inside padding
          node.x = Math.max(60, Math.min(width - 60, node.x))
          node.y = Math.max(60, Math.min(height - 60, node.y))
        })

        return updated
      })

      animFrame = requestAnimationFrame(simulate)
    }

    animFrame = requestAnimationFrame(simulate)
    return () => cancelAnimationFrame(animFrame)
  }, [edges, draggedNodeId, nodes.length])

  // Pointer dragging handlers
  const handlePointerDown = (node: NodeItem, e: React.PointerEvent) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDraggedNodeId(node.id)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId) return
    const svgRect = canvasRef.current?.getBoundingClientRect()
    if (!svgRect) return

    const newX = (e.clientX - svgRect.left) / zoom
    const newY = (e.clientY - svgRect.top) / zoom

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggedNodeId
          ? {
              ...n,
              x: Math.max(50, Math.min(width - 50, newX)),
              y: Math.max(50, Math.min(height - 50, newY)),
              vx: 0,
              vy: 0,
            }
          : n
      )
    )
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNodeId) {
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch {}
      setDraggedNodeId(null)
    }
  }

  const handleNodeClick = (node: NodeItem) => {
    if (!draggedNodeId) {
      router.push(node.url)
    }
  }

  const isConnected = useCallback(
    (nodeId: string) => {
      if (!hoveredNodeId) return true
      if (nodeId === hoveredNodeId) return true
      const hoveredNode = nodes.find((n) => n.id === hoveredNodeId)
      return hoveredNode?.connections.has(nodeId) ?? false
    },
    [hoveredNodeId, nodes]
  )

  const isEdgeConnected = useCallback(
    (edge: EdgeItem) => {
      if (!hoveredNodeId) return true
      return edge.source === hoveredNodeId || edge.target === hoveredNodeId
    },
    [hoveredNodeId]
  )

  const resetLayout = () => {
    setNodes((prev) =>
      prev.map((n, i) => {
        const angle = (i / prev.length) * Math.PI * 2
        return {
          ...n,
          x: width / 2 + Math.cos(angle) * (n.type === 'tag' ? 170 : 290),
          y: height / 2 + Math.sin(angle) * (n.type === 'tag' ? 170 : 290),
          vx: 0,
          vy: 0,
        }
      })
    )
  }

  const hoveredNode = nodes.find((n) => n.id === hoveredNodeId)

  return (
    <div className="relative w-full border border-border bg-background overflow-hidden select-none">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-foreground animate-pulse" />
          <span className="uppercase tracking-wider font-bold">[SYSTEM ARCHITECTURE TOPOLOGY]</span>
          <span className="text-muted-foreground hidden md:inline">
            ({nodes.length} NODES / {edges.length} LINKS)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.4))}
            className="px-2.5 py-1 border border-border hover:bg-foreground hover:text-background transition-none duration-0 text-xs font-bold"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
            className="px-2.5 py-1 border border-border hover:bg-foreground hover:text-background transition-none duration-0 text-xs font-bold"
          >
            -
          </button>
          <button
            onClick={resetLayout}
            className="px-3 py-1 border border-border hover:bg-foreground hover:text-background transition-none duration-0 text-xs font-bold uppercase"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Floating Active Node Preview Card HUD */}
      {hoveredNode && (
        <div className="absolute top-14 left-4 z-10 p-3 max-w-xs sm:max-w-sm border border-foreground bg-background shadow-md font-mono text-xs pointer-events-none">
          <div className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1">
            [{hoveredNode.type.toUpperCase()} NODE SELECTED]
          </div>
          <div className="font-bold text-sm text-foreground break-words">{hoveredNode.fullTitle}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {hoveredNode.connections.size} Connected Links • Click to inspect
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={canvasRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[400px] sm:h-[500px] cursor-grab active:cursor-grabbing"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Background Blueprint Grid Lines */}
        <defs>
          <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graph-grid)" opacity={0.35} />

        <g transform={`scale(${zoom})`} style={{ transformOrigin: 'center' }}>
          {/* Edges */}
          {edges.map((edge, i) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)
            if (!sourceNode || !targetNode) return null

            const active = isEdgeConnected(edge)
            return (
              <line
                key={`${edge.source}-${edge.target}-${i}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="hsl(var(--foreground))"
                strokeWidth={active ? (hoveredNodeId ? 2 : 1.2) : 0.4}
                strokeDasharray={hoveredNodeId && active ? undefined : '4 4'}
                opacity={active ? (hoveredNodeId ? 0.95 : 0.4) : 0.08}
                className="transition-all duration-150"
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const active = isConnected(node.id)
            const isHovered = hoveredNodeId === node.id

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onPointerDown={(e) => handlePointerDown(node, e)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer"
                style={{ opacity: active ? 1 : 0.15 }}
              >
                {/* Node Shape */}
                {node.type === 'tag' ? (
                  // Diamond shape for tags
                  <g>
                    <polygon
                      points="0,-22 22,0 0,22 -22,0"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--foreground))"
                      strokeWidth={isHovered ? 3 : 1.5}
                      className="transition-all duration-150"
                    />
                    {isHovered && (
                      <polygon
                        points="0,-28 28,0 0,28 -28,0"
                        fill="none"
                        stroke="hsl(var(--foreground))"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}
                  </g>
                ) : (
                  // Circle shape for posts
                  <g>
                    <circle
                      r={node.radius}
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--foreground))"
                      strokeWidth={isHovered ? 3 : 1.5}
                      className="transition-all duration-150"
                    />
                    <circle
                      r={node.radius - 6}
                      fill={isHovered ? 'hsl(var(--foreground))' : 'none'}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* Label Badge with Background Pill to avoid line collisions */}
                <g transform={`translate(0, ${node.radius + 14})`}>
                  <rect
                    x={-((node.label.length * 7) / 2) - 4}
                    y="-10"
                    width={node.label.length * 7 + 8}
                    height="16"
                    fill="hsl(var(--background))"
                    stroke={isHovered ? 'hsl(var(--foreground))' : 'hsl(var(--border))'}
                    strokeWidth="1"
                    rx="0"
                  />
                  <text
                    y="2"
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    className={`font-mono text-[10px] pointer-events-none ${
                      isHovered ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {node.label}
                  </text>
                </g>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Footer Info HUD */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/10 font-mono text-[11px] text-muted-foreground">
        <span>💡 DRAG NODES TO RESTRUCTURE TOPOLOGY</span>
        <span>CLICK NODE TO OPEN SPECIFICATION</span>
      </div>
    </div>
  )
}
