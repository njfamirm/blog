'use client'

import { useState, useEffect, useRef } from 'react'
import { Footer } from '@/components/footer'
import { ScrambleText } from '@/components/scramble-text'

export interface ToolItem {
  id: string
  code: string
  title: string
  file: string
  category: string
  description: string
  tags: string[]
  icon: string
  previewType: 'radar' | 'pixels' | 'wave' | 'mesh' | 'matrix' | 'equalizer' | 'ascii'
}

const TOOLS: ToolItem[] = [
  {
    id: 'neural-pomodoro',
    code: 'TOOL-01',
    title: 'Neural Pomodoro',
    file: '/tools/neural-pomodoro.html',
    category: 'AI // FOCUS ENFORCER',
    description: 'AI-driven focus tracking pomodoro timer with webcam facial posture & landmark attention telemetry.',
    tags: ['AI', 'Pomodoro', 'MediaPipe', 'Focus'],
    icon: '🧠',
    previewType: 'radar'
  },
  {
    id: 'pixel-vault',
    code: 'TOOL-02',
    title: 'Pixel Vault',
    file: '/tools/pixel-vault.html',
    category: 'SECURITY // STEGANOGRAPHY',
    description: 'Client-side AES-256 encryption engine hiding secret payloads within image pixel channel bytes.',
    tags: ['Steganography', 'AES-256', 'Crypto', 'Canvas'],
    icon: '🔐',
    previewType: 'pixels'
  },
  {
    id: 'sonic-cypher',
    code: 'TOOL-03',
    title: 'Sonic Cypher',
    file: '/tools/sonic-cypher.html',
    category: 'AIR-GAPPED // ACOUSTIC DATA',
    description: 'Ultrasonic acoustic data transmission protocol for secure air-gapped device communication.',
    tags: ['Acoustic', 'Air-Gapped', 'Audio Data', 'Protocol'],
    icon: '📡',
    previewType: 'wave'
  },
  {
    id: 'void-mirror',
    code: 'TOOL-04',
    title: 'Void Mirror',
    file: '/tools/void-mirror.html',
    category: 'AI // BIOMETRIC ENGINE',
    description: 'Local real-time biometric analysis engine & facial 3D topology tracking via MediaPipe.',
    tags: ['Biometrics', 'AI Vision', 'MediaPipe', 'Holistic'],
    icon: '🪞',
    previewType: 'mesh'
  },
  {
    id: 'kinetic-v3',
    code: 'TOOL-05',
    title: 'Kinetic Bio Tracker V3',
    file: '/tools/kinetic-bio-tracker-v3.html',
    category: 'AUDIO-VISUAL // ASCII V3',
    description: 'Real-time camera feed transformation to kinetic ASCII art with motion contour tracking.',
    tags: ['ASCII Art', 'Camera', 'Motion', 'V3'],
    icon: '👾',
    previewType: 'matrix'
  },
  {
    id: 'kinetic-v2',
    code: 'TOOL-06',
    title: 'Kinetic ASCII Mirror V2',
    file: '/tools/kinetic-bio-tracker-v2.html',
    category: 'AUDIO-VISUAL // ASCII V2',
    description: 'Audio-reactive matrix visualizer responding to live microphone spectrum frequencies.',
    tags: ['Audio Reactive', 'ASCII', 'Microphone', 'V2'],
    icon: '🎙️',
    previewType: 'equalizer'
  },
  {
    id: 'ascii-v1',
    code: 'TOOL-07',
    title: 'Audio ASCII Mirror V1',
    file: '/tools/ascii-mirror-v1.html',
    category: 'AUDIO-VISUAL // ASCII V1',
    description: 'Minimalist audio-reactive live ASCII camera density filter and waveform generator.',
    tags: ['Audio Visualizer', 'ASCII', 'Canvas', 'V1'],
    icon: '🎵',
    previewType: 'ascii'
  }
]

// Animated Visual Preview Component
function ToolPreviewGraphic({ type }: { type: ToolItem['previewType'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let frame = 0

    const render = () => {
      frame++
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      if (type === 'radar') {
        // AI Focus Radar Preview
        const centerX = width / 2
        const centerY = height / 2
        const maxRadius = Math.min(width, height) * 0.4

        // Rings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.lineWidth = 1
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, (maxRadius / 3) * r, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Sweeping Beam
        const angle = (frame * 0.04) % (Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, maxRadius, angle - 0.4, angle)
        ctx.closePath()
        ctx.fill()

        // Target Points
        const px = centerX + Math.cos(angle - 0.2) * (maxRadius * 0.6)
        const py = centerY + Math.sin(angle - 0.2) * (maxRadius * 0.6)
        ctx.fillStyle = '#fff'
        ctx.fillRect(px - 2, py - 2, 4, 4)

      } else if (type === 'pixels') {
        // Steganography Pixel Grid
        const cols = 12
        const rows = 6
        const cellW = width / cols
        const cellH = height / rows

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const seed = Math.sin(r * 10 + c * 20 + frame * 0.05)
            const alpha = Math.abs(seed) * 0.35 + 0.05
            ctx.fillStyle = (r + c + frame) % 5 === 0 ? `rgba(255, 255, 255, ${alpha + 0.3})` : `rgba(255, 255, 255, ${alpha})`
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2)
          }
        }

      } else if (type === 'wave') {
        // Sonic Wave
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.beginPath()

        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin(x * 0.05 + frame * 0.1) * 18 * Math.cos(x * 0.02)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Freq Data Bars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        for (let i = 0; i < 16; i++) {
          const barH = (Math.sin(i + frame * 0.1) + 1) * 12 + 4
          ctx.fillRect(i * 12 + 10, height - barH - 6, 8, barH)
        }

      } else if (type === 'mesh') {
        // Biometric Face Wireframe
        const centerX = width / 2
        const centerY = height / 2
        const nodes = [
          { x: 0, y: -25 }, { x: -20, y: -10 }, { x: 20, y: -10 },
          { x: -10, y: 10 }, { x: 10, y: 10 }, { x: 0, y: 25 }
        ]

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1

        nodes.forEach((n1, idx) => {
          const oscX = Math.sin(frame * 0.05 + idx) * 3
          const oscY = Math.cos(frame * 0.05 + idx) * 3
          const x1 = centerX + n1.x + oscX
          const y1 = centerY + n1.y + oscY

          ctx.fillStyle = '#fff'
          ctx.fillRect(x1 - 1.5, y1 - 1.5, 3, 3)

          nodes.forEach((n2, idx2) => {
            if (idx < idx2) {
              const x2 = centerX + n2.x + Math.sin(frame * 0.05 + idx2) * 3
              const y2 = centerY + n2.y + Math.cos(frame * 0.05 + idx2) * 3
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          })
        })

      } else if (type === 'matrix') {
        // ASCII Digital Rain Matrix
        ctx.font = '10px monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        const chars = '01#@$%*<>'
        
        for (let col = 0; col < 14; col++) {
          const char = chars[(col + frame) % chars.length]
          const y = ((frame * 2 + col * 15) % height)
          ctx.fillText(char, col * 14 + 10, y)
        }

      } else if (type === 'equalizer') {
        // Audio Equalizer Columns
        const barWidth = 10
        const count = 14
        for (let i = 0; i < count; i++) {
          const h = (Math.sin(i * 0.5 + frame * 0.15) + 1.2) * 22
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)'
          ctx.fillRect(i * 14 + 12, height - h - 10, barWidth, h)
        }

      } else if (type === 'ascii') {
        // ASCII Density Matrix
        ctx.font = '10px monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        const asciiGrid = ['::--==++', '##%%@@**', '++==--::']
        asciiGrid.forEach((row, rIdx) => {
          const shifted = row.substring(frame % row.length) + row.substring(0, frame % row.length)
          ctx.fillText(shifted, 15, rIdx * 16 + 25)
        })
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [type])

  return (
    <div className="relative w-full h-24 bg-black/60 border border-border flex items-center justify-center overflow-hidden my-3">
      <canvas
        ref={canvasRef}
        width={220}
        height={90}
        className="w-full h-full object-contain"
      />
      <div className="absolute top-1 right-2 font-mono text-[9px] text-muted-foreground uppercase tracking-widest bg-background/80 px-1">
        LIVE PREVIEW
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null)

  const handleReload = () => {
    const iframe = document.getElementById('active-tool-iframe') as HTMLIFrameElement
    if (iframe) iframe.src = iframe.src
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="grid grid-cols-1 md:grid-cols-12 min-h-screen gap-px bg-border border-b border-border max-w-screen-2xl mx-auto border-x">
        
        {/* Header Hero Section */}
        <section className="md:col-span-8 bg-background p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center py-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6 uppercase font-sans">
              <ScrambleText lines={['LAB // UTILITIES', 'EXPERIMENTAL.']} />
            </h1>
            <p className="text-lg md:text-xl max-w-[60ch] leading-relaxed font-mono text-muted-foreground">
              A curated suite of single-file web utilities built for offline execution, AI vision tracking, steganography, and acoustic data transfer.
            </p>
          </div>
          <div className="border-t border-border pt-4 mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
            <span>[TOTAL TOOLS: {TOOLS.length}]</span>
            <span>[100% LOCAL & AIR-GAPPED]</span>
            <span>[ZERO SERVER DEPENDENCY]</span>
          </div>
        </section>

        {/* Quick Nav Panel */}
        <section className="md:col-span-4 bg-background flex flex-col border-t md:border-t-0 md:border-l border-border">
          <div className="p-4 md:p-5 border-b border-border bg-background">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">[DIRECT LAUNCHER]</span>
          </div>

          <nav className="flex-1 flex flex-col justify-between font-mono">
            {TOOLS.slice(0, 4).map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool)
                  setTimeout(() => {
                    document.getElementById('tool-workspace')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}
                className={`flex-1 flex items-center justify-between p-4 md:p-5 border-b border-border last:border-b-0 text-left hover:bg-foreground hover:text-background transition-none duration-0 group ${
                  activeTool?.id === tool.id ? 'bg-foreground text-background font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tool.icon}</span>
                  <div>
                    <span className={`block text-[10px] uppercase tracking-widest ${activeTool?.id === tool.id ? 'text-background/70' : 'text-muted-foreground group-hover:text-background/70'}`}>
                      [{tool.code}]
                    </span>
                    <span className="text-sm font-semibold">
                      {tool.title}
                    </span>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wider opacity-60 group-hover:opacity-100">
                  LAUNCH ↗
                </span>
              </button>
            ))}
          </nav>
        </section>

        {/* Live Interactive Workspace (If Active Tool Selected) */}
        {activeTool && (
          <section id="tool-workspace" className="md:col-span-12 bg-background border-t border-border p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeTool.icon}</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">
                    {activeTool.code} // {activeTool.category}
                  </span>
                  <h2 className="text-base font-bold uppercase tracking-wider">
                    {activeTool.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReload}
                  className="px-3 py-1.5 border border-border text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-none duration-0"
                  title="Reload tool"
                >
                  Reload 🔄
                </button>
                <a
                  href={activeTool.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-border text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-none duration-0"
                >
                  New Tab ↗
                </a>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-3 py-1.5 border border-border text-xs uppercase tracking-wider bg-destructive/10 text-destructive hover:bg-foreground hover:text-background transition-none duration-0"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="relative w-full border border-border bg-black h-[650px] md:h-[750px]">
              <iframe
                id="active-tool-iframe"
                src={activeTool.file}
                className="w-full h-full border-none"
                title={activeTool.title}
              />
            </div>
          </section>
        )}

        {/* Tools Bento Grid Section */}
        <section className="md:col-span-12 bg-background border-t border-border">
          <div className="p-4 md:p-5 border-b border-border bg-background flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">[INDEXED TOOLS GRID]</h2>
            <span className="font-mono text-xs text-muted-foreground">SELECT APP TO VIEW LIVE PREVIEW & LAUNCH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {TOOLS.map((tool) => {
              const isActive = activeTool?.id === tool.id
              return (
                <div
                  key={tool.id}
                  className={`bg-background p-6 flex flex-col justify-between transition-none duration-0 ${
                    isActive ? 'ring-1 ring-foreground z-10' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 font-mono text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{tool.icon}</span>
                        <span>[{tool.code}]</span>
                      </span>
                      <span className="uppercase tracking-wider text-[10px]">{tool.category}</span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1 font-mono">
                      {tool.title}
                    </h3>

                    {/* Visual Animated Preview */}
                    <ToolPreviewGraphic type={tool.previewType} />

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-mono">
                      {tool.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4 font-mono">
                      {tool.tags.map((t) => (
                        <span key={t} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs border-t border-border pt-4">
                      <button
                        onClick={() => {
                          setActiveTool(tool)
                          setTimeout(() => {
                            document.getElementById('tool-workspace')?.scrollIntoView({ behavior: 'smooth' })
                          }, 100)
                        }}
                        className="flex-1 py-2.5 px-3 border border-border text-center font-semibold uppercase tracking-wider hover:bg-foreground hover:text-background transition-none duration-0"
                      >
                        {isActive ? 'Active Workspace' : 'Launch Tool'}
                      </button>

                      <a
                        href={tool.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 border border-border text-center hover:bg-foreground hover:text-background transition-none duration-0"
                        title="Open in standalone browser window"
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
