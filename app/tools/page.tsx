'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  previewType: 'radar' | 'pixels' | 'wave' | 'matrix'
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
    id: 'kinetic-bio-tracker',
    code: 'TOOL-04',
    title: 'Kinetic Bio Tracker',
    file: '/tools/kinetic-bio-tracker.html',
    category: 'AUDIO-VISUAL // KINETIC ASCII',
    description: 'Real-time camera & audio feed transformation to kinetic ASCII art with motion contour tracking.',
    tags: ['ASCII Art', 'Camera', 'Audio Reactive', 'Motion'],
    icon: '👾',
    previewType: 'matrix'
  }
]

// Modular Canvas Renderers for Live Previews
const PREVIEW_RENDERERS: Record<ToolItem['previewType'], (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => void> = {
  radar: (ctx, w, h, f) => {
    const cx = w / 2, cy = h / 2, rMax = Math.min(w, h) * 0.4
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1
    for (let r = 1; r <= 3; r++) { ctx.beginPath(); ctx.arc(cx, cy, (rMax / 3) * r, 0, Math.PI * 2); ctx.stroke() }
    const angle = (f * 0.04) % (Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, rMax, angle - 0.4, angle); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.fillRect(cx + Math.cos(angle - 0.2) * (rMax * 0.6) - 2, cy + Math.sin(angle - 0.2) * (rMax * 0.6) - 2, 4, 4)
  },
  pixels: (ctx, w, h, f) => {
    const cols = 12, rows = 6, cW = w / cols, cH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const alpha = Math.abs(Math.sin(r * 10 + c * 20 + f * 0.05)) * 0.35 + 0.05
        ctx.fillStyle = (r + c + f) % 5 === 0 ? `rgba(255,255,255,${alpha + 0.3})` : `rgba(255,255,255,${alpha})`
        ctx.fillRect(c * cW + 1, r * cH + 1, cW - 2, cH - 2)
      }
    }
  },
  wave: (ctx, w, h, f) => {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath()
    for (let x = 0; x < w; x += 2) {
      const y = h / 2 + Math.sin(x * 0.05 + f * 0.1) * 18 * Math.cos(x * 0.02)
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    for (let i = 0; i < 16; i++) {
      const bH = (Math.sin(i + f * 0.1) + 1) * 12 + 4
      ctx.fillRect(i * 12 + 10, h - bH - 6, 8, bH)
    }
  },
  matrix: (ctx, w, h, f) => {
    ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.7)'
    const chars = '01#@$%*<>'
    for (let col = 0; col < 14; col++) {
      ctx.fillText(chars[(col + f) % chars.length], col * 14 + 10, (f * 2 + col * 15) % h)
    }
  }
}

function ToolPreviewGraphic({ type }: { type: ToolItem['previewType'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId: number, frame = 0
    const render = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      PREVIEW_RENDERERS[type](ctx, canvas.width, canvas.height, frame)
      frameId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(frameId)
  }, [type])

  return (
    <div className="relative w-full h-24 bg-black/60 border border-border flex items-center justify-center overflow-hidden my-3">
      <canvas ref={canvasRef} width={220} height={90} className="w-full h-full object-contain" />
      <div className="absolute top-1 right-2 font-mono text-[9px] text-muted-foreground uppercase tracking-widest bg-background/80 px-1">
        LIVE PREVIEW
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(TOOLS[0])

  const launchTool = useCallback((tool: ToolItem) => {
    setActiveTool(tool)
    setTimeout(() => {
      document.getElementById('tool-workspace')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="grid grid-cols-1 md:grid-cols-12 min-h-screen gap-px bg-border border-b border-border max-w-screen-2xl mx-auto border-x">
        
        {/* Hero Section */}
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

          <nav className="flex-1 flex flex-col justify-between font-mono bg-background">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => launchTool(tool)}
                className={`flex-1 flex items-center justify-between p-4 md:p-5 border-b border-border last:border-b-0 text-left hover:bg-foreground hover:text-background transition-none duration-0 group ${
                  activeTool?.id === tool.id ? 'bg-foreground text-background font-bold' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tool.icon}</span>
                  <div>
                    <span className={`block text-[10px] uppercase tracking-widest ${activeTool?.id === tool.id ? 'text-background/70' : 'text-muted-foreground group-hover:text-background/70'}`}>
                      [{tool.code}]
                    </span>
                    <span className="text-sm font-semibold">{tool.title}</span>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wider opacity-60 group-hover:opacity-100">
                  LAUNCH ↗
                </span>
              </button>
            ))}
          </nav>
        </section>

        {/* Embedded Iframe Workspace */}
        {activeTool ? (
          <section id="tool-workspace" className="md:col-span-12 bg-background border-t border-border p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeTool.icon}</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">
                    {activeTool.code} // {activeTool.category}
                  </span>
                  <h2 className="text-base font-bold uppercase tracking-wider">{activeTool.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const iframe = document.getElementById('active-tool-iframe') as HTMLIFrameElement
                    if (iframe) iframe.src = iframe.src
                  }}
                  className="px-3 py-1.5 border border-border text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-none duration-0"
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
        ) : (
          <section className="md:col-span-12 bg-background border-t border-border p-8 text-center font-mono">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              [NO ACTIVE WORKSPACE // SELECT ANY TOOL FROM THE GRID TO LAUNCH]
            </span>
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
                        onClick={() => launchTool(tool)}
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
