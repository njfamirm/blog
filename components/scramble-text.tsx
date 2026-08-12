'use client'

import { useEffect, useState, useCallback } from 'react'

const ASCII_GLYPHS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`{|}~'

interface ScrambleTextProps {
  lines: string[]
  className?: string
  speed?: number
  scrambleCount?: number
  triggerOnHover?: boolean
}

export function ScrambleText({
  lines,
  className = '',
  speed = 25,
  scrambleCount = 3,
  triggerOnHover = true,
}: ScrambleTextProps) {
  const fullText = lines.join('\n')
  const [displayLines, setDisplayLines] = useState<string[]>(lines)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    let frame = 0
    const maxLineLength = Math.max(...lines.map((l) => l.length))
    const totalFrames = maxLineLength * scrambleCount

    const interval = setInterval(() => {
      frame++
      const progress = frame / scrambleCount

      const newLines = lines.map((line) => {
        return line
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < Math.floor(progress)) {
              return char
            }
            return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)]
          })
          .join('')
      })

      setDisplayLines(newLines)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayLines(lines)
        setIsAnimating(false)
      }
    }, speed)
  }, [lines, scrambleCount, speed, isAnimating])

  useEffect(() => {
    startAnimation()
    // eslint-disable-next-deps
  }, [])

  return (
    <span
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={triggerOnHover ? startAnimation : undefined}
      aria-label={fullText}
    >
      <span aria-hidden="true">
        {displayLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    </span>
  )
}
