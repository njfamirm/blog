'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'

// Lazy load the heavy 3D component with a minimum delay to prevent flickering if it loads too fast
const UndulatingStructure = lazy(() => {
  return Promise.all([
    import('./UndulatingStructure'),
    new Promise(resolve => setTimeout(resolve, 500)) // Min delay for smooth transition
  ]).then(([module]) => module)
})

// Static "Screenshot-like" Placeholder
// Uses SVG to mimic the perspective grid of the 3D scene
function StaticPreview() {
  return (
    <div className="w-full h-full bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {/* Abstract Perspective Grid SVG */}
        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="2" height="2" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          
          {/* 
            Mimic the camera angle (0, 12, 16) -> approximate perspective transform 
            We use a group with rotation/scale to fake depth
          */}
          <g transform="translate(400, 300) scale(1, 0.6) rotate(45)">
             <rect x="-400" y="-400" width="800" height="800" fill="url(#grid-pattern)" />
          </g>
        </svg>
      </div>
      
      {/* Label overlay */}
      <div className="relative z-10 font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
        [SYSTEM_BOOTING...]
      </div>
    </div>
  )
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <StaticPreview />
  }

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-background">
      {/* 
        We keep the StaticPreview visible absolutely strictly behind the canvas 
        to ensure no white flash, though Suspense handles swapping.
        The key here is the fade-in of the suspended content.
      */}
      <Suspense fallback={<StaticPreview />}>
        <div className="absolute inset-0 z-10 animate-in fade-in duration-1000 fill-mode-forwards">
          <UndulatingStructure />
        </div>
      </Suspense>
    </div>
  )
}
