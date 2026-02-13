'use client'

import { useEffect, useRef } from 'react'

export function ThreeDElement() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }
    setCanvasSize()

    let animationFrameId: number
    let rotation = 0

    // Simple 3D-like rotating shape animation
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate center
      const centerX = width / 2
      const centerY = height / 2
      const size = Math.min(width, height) * 0.4

      // Create gradient
      const gradient = ctx.createLinearGradient(
        centerX - size,
        centerY - size,
        centerX + size,
        centerY + size
      )
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.1)')
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.3)')

      // Draw rotating shape (torus-like effect)
      ctx.save()
      ctx.translate(centerX, centerY)
      
      // Draw multiple ellipses to create 3D effect
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + rotation
        const scale = Math.sin(angle) * 0.5 + 0.5
        
        ctx.beginPath()
        ctx.ellipse(
          0,
          0,
          size * (0.8 + scale * 0.2),
          Math.abs(size * (0.3 + scale * 0.1) * Math.cos(rotation + i * 0.2)),
          angle,
          0,
          Math.PI * 2
        )
        
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 + scale * 0.3})`
        ctx.lineWidth = 2
        ctx.stroke()
        
        if (i % 2 === 0) {
          ctx.fillStyle = gradient
          ctx.fill()
        }
      }
      
      // Draw center sphere
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.restore()

      rotation += 0.01
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    window.addEventListener('resize', setCanvasSize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  )
}
