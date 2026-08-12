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
  previewType: 'radar' | 'pixels' | 'wave' | 'matrix' | 'quantum' | 'hand' | 'spectral' | 'shield' | 'xray' | 'thermal' | 'strobe' | 'beam' | 'screen'
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
  },
  {
    id: 'quantum-burner-tunnel',
    code: 'TOOL-05',
    title: 'Quantum Burner Tunnel',
    file: '/tools/quantum-burner-tunnel.html',
    category: 'P2P // ZERO-SERVER TUNNEL',
    description: 'Ephemeral WebRTC P2P encrypted datachannel tunnel for instant chat, high-speed file transfer & auto self-destruct.',
    tags: ['WebRTC', 'P2P', 'Ephemeral', 'E2EE', 'Burner'],
    icon: '⚛️',
    previewType: 'quantum'
  },
  {
    id: 'hologram-hand-os',
    code: 'TOOL-06',
    title: 'Hologram Hand OS',
    file: '/tools/hologram-hand-os.html',
    category: 'AI // HAND GESTURE 3D OS',
    description: 'Minority Report style air gesture controlled 3D holographic gallery using MediaPipe AI hand tracking.',
    tags: ['AI Hand Track', 'Minority Report', 'Gesture OS', '3D Gallery'],
    icon: '🖐️',
    previewType: 'hand'
  },
  {
    id: 'spectral-anomaly-scanner',
    code: 'TOOL-07',
    title: 'Spectral Anomaly Scanner',
    file: '/tools/spectral-anomaly-scanner.html',
    category: 'AUDIO DSP // HIDDEN RADAR',
    description: 'Web Audio DSP scanner amplifying infrasound (<30Hz) & ultrasound (>14kHz) 1000x with cascading spectrogram radar & anomaly locks.',
    tags: ['Audio DSP', 'Ultrasound', 'Infrasound', 'Spectrogram', 'Radar'],
    icon: '📻',
    previewType: 'spectral'
  },
  {
    id: 'void-whisper',
    code: 'TOOL-08',
    title: 'Void Whisper',
    file: '/tools/void-whisper.html',
    category: 'ACOUSTIC // ANTI-RECORDING',
    description: 'Smart acoustic masking noise & ultrasonic LFO phase sweeper saturating MEMS microphones & anti-eavesdropping.',
    tags: ['Acoustic Jammer', 'Anti-Recording', 'DSP Masking', 'Privacy'],
    icon: '🛡️',
    previewType: 'shield'
  },
  {
    id: 'dom-xray-viewer',
    code: 'TOOL-09',
    title: 'DOM X-Ray Viewer',
    file: '/tools/dom-xray-viewer.html',
    category: 'DEV // 3D REVERSE ENGINE',
    description: 'Interactive 3D spatial DOM layer deconstruction exploding HTML elements into an orbitable skyscraper stack.',
    tags: ['DOM Parser', '3D X-Ray', 'Reverse Engine', 'CSS 3D'],
    icon: '🪞',
    previewType: 'xray'
  },
  {
    id: 'predator-thermal-cam',
    code: 'TOOL-10',
    title: 'Predator Thermal Cam',
    file: '/tools/predator-thermal-cam.html',
    category: 'VISION DSP // THERMAL SCANNER',
    description: 'Tactical night vision & Predator heatmap camera scanner with luminance spectrum DSP & target lock reticle.',
    tags: ['Thermal Cam', 'Night Vision', 'Vision DSP', 'Predator HUD'],
    icon: '👁️',
    previewType: 'thermal'
  },
  {
    id: 'optical-morse-strobe',
    code: 'TOOL-11',
    title: 'Optical Morse Strobe',
    file: '/tools/optical-morse-strobe.html',
    category: 'AIR-GAPPED // LIGHT TRANSCEIVER',
    description: 'Emergency optical communication transceiver encoding text to Torch API flashlight strobe & decoding light pulses via camera.',
    tags: ['Optical Morse', 'Torch API', 'Air-Gapped Light', 'Emergency'],
    icon: '🎙️',
    previewType: 'strobe'
  },
  {
    id: 'lan-drop',
    code: 'TOOL-12',
    title: 'LAN Drop',
    file: '/tools/lan-drop.html',
    category: 'LAN // INSTANT PEER BEAM',
    description: 'Same-network direct peer transfer for text, screenshots & large files with no STUN, no TURN and no relay hop.',
    tags: ['LAN', 'WebRTC', 'AirDrop-like', 'Zero Server', 'Hotspot'],
    icon: '📤',
    previewType: 'beam'
  },
  {
    id: 'nexus-screen-share',
    code: 'TOOL-13',
    title: 'Nexus Screen Share',
    file: '/tools/nexus-screen-share.html',
    category: 'P2P // DIRECT DISPLAY BEAM',
    description: 'Zero-server screen, window & tab broadcasting over a direct WebRTC beam with copy-paste manual signaling tokens.',
    tags: ['WebRTC', 'Screen Share', 'Zero Server', 'P2P', 'Manual Signaling'],
    icon: '🖥️',
    previewType: 'screen'
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
  },
  quantum: (ctx, w, h, f) => {
    const node1X = 40, node2X = w - 40, cy = h / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(node1X, cy); ctx.lineTo(node2X, cy); ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(node1X, cy, 5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(node2X, cy, 5, 0, Math.PI * 2); ctx.fill()
    const pX = node1X + ((f * 3) % (node2X - node1X))
    ctx.fillRect(pX - 3, cy - 3, 6, 6)
  },
  hand: (ctx, w, h, f) => {
    const cx = w / 2, cy = h / 2 + Math.sin(f * 0.05) * 6
    const joints = [
      { x: cx, y: cy + 20 }, { x: cx - 20, y: cy }, { x: cx - 10, y: cy - 25 },
      { x: cx, y: cy - 30 }, { x: cx + 10, y: cy - 25 }, { x: cx + 20, y: cy }
    ]
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5
    joints.forEach((j1, i) => {
      ctx.fillStyle = '#fff'; ctx.fillRect(j1.x - 2, j1.y - 2, 4, 4)
      if (i > 0) { ctx.beginPath(); ctx.moveTo(joints[0].x, joints[0].y); ctx.lineTo(j1.x, j1.y); ctx.stroke() }
    })
  },
  spectral: (ctx, w, h, f) => {
    for (let r = 0; r < 5; r++) {
      const y = r * 16 + 10
      ctx.fillStyle = (r + f) % 2 === 0 ? 'rgba(16,185,129,0.7)' : 'rgba(244,63,94,0.5)'
      ctx.fillRect(15, y, w - 30, 8)
    }
  },
  shield: (ctx, w, h, f) => {
    const cx = w / 2, cy = h / 2
    const radius = 25 + Math.sin(f * 0.1) * 4
    ctx.strokeStyle = 'rgba(244,63,94,0.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = 'rgba(244,63,94,0.15)'
    ctx.fill()
  },
  xray: (ctx, w, h, f) => {
    for (let i = 0; i < 4; i++) {
      const y = 20 + i * 14
      const x = 30 + i * 10
      ctx.strokeStyle = i === (Math.floor(f / 10) % 4) ? 'rgba(168,85,247,0.9)' : 'rgba(56,189,248,0.4)'
      ctx.strokeRect(x, y, w - 80, 40)
    }
  },
  thermal: (ctx, w, h, f) => {
    const grad = ctx.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(0.3, '#06b6d4')
    grad.addColorStop(0.6, '#22c55e')
    grad.addColorStop(0.8, '#eab308')
    grad.addColorStop(1, '#f43f5e')
    ctx.fillStyle = grad
    ctx.fillRect(15, h / 2 - 15, w - 30, 30)

    const reticleX = (f * 3) % (w - 60) + 30
    ctx.strokeStyle = '#ffffff'
    ctx.strokeRect(reticleX - 8, h / 2 - 8, 16, 16)
  },
  strobe: (ctx, w, h, f) => {
    const cx = w / 2, cy = h / 2
    const isOn = (Math.floor(f / 6) % 2 === 0)
    ctx.fillStyle = isOn ? '#eab308' : '#334155'
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill()
    if (isOn) {
      ctx.strokeStyle = 'rgba(234,179,8,0.4)'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.stroke()
    }
  },
  screen: (ctx, w, h, f) => {
    const mW = w * 0.42, mH = h * 0.5, mY = (h - mH) / 2
    // Source display on the left, mirrored panel on the right, packets crossing between.
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1
    ctx.strokeRect(14, mY, mW, mH)
    ctx.strokeRect(w - 14 - mW, mY, mW, mH)
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.fillRect(14, mY, mW, mH)
    for (let i = 0; i < 3; i++) {
      const scan = mY + ((f * 1.5 + i * 18) % mH)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(14, scan, mW, 2)
      ctx.fillRect(w - 14 - mW, scan, mW, 2)
    }
    ctx.fillStyle = '#fff'
    for (let i = 0; i < 2; i++) {
      const span = (w - 28 - mW * 2) - 8
      const t = 14 + mW + 4 + ((f * 2 + i * 30) % span)
      ctx.fillRect(t, h / 2 - 1.5, 5, 3)
    }
  },
  beam: (ctx, w, h, f) => {
    const cy = h / 2, left = 26, right = w - 26
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillRect(left - 8, cy - 12, 16, 24)
    ctx.fillRect(right - 8, cy - 12, 16, 24)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(left + 10, cy); ctx.lineTo(right - 10, cy); ctx.stroke()
    ctx.fillStyle = '#fff'
    for (let i = 0; i < 3; i++) {
      const t = ((f * 2.5 + i * 40) % (right - left - 20)) + left + 10
      ctx.fillRect(t - 4, cy - 2, 8, 4)
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
              A curated suite of single-file web utilities built for offline execution, AI vision & hand gesture tracking, optical Morse strobes, Predator thermal heatmaps, 3D DOM X-Ray visualizers, acoustic jammers, spectral radar DSP, steganography, P2P WebRTC tunnels, instant same-network peer drops, and acoustic data transfer.
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
