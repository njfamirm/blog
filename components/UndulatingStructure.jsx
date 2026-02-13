'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Constants for performance and aesthetics
const TOTAL_PARTICLES = 1600 // 40x40 grid
const GRID_SIZE = 40
const PARTICLE_SIZE = 0.15
const WAVE_SPEED = 2.0
const WAVE_FREQUENCY = 0.3
const WAVE_AMPLITUDE = 2.5
const MOUSE_INFLUENCE = 3.0
const DAMPING = 0.1

// ... imports

function UndulatingMesh() {
  // ... (keep existing mesh logic identical)
  const meshRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  useMemo(() => null, [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    const mouseX = (state.mouse.x * window.innerWidth) / 200
    const mouseY = (state.mouse.y * window.innerHeight) / 200

    let i = 0
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const xPos = (x - GRID_SIZE / 2) * 0.5
        const zPos = (z - GRID_SIZE / 2) * 0.5
        const dist = Math.sqrt(xPos * xPos + zPos * zPos)
        
        const mouseDist = Math.sqrt(Math.pow(xPos - mouseX, 2) + Math.pow(zPos - mouseY, 2))
        const mouseFactor = Math.max(0, 1 - mouseDist / 10) * MOUSE_INFLUENCE
        
        const yPos = 
          Math.sin(dist * WAVE_FREQUENCY - time * WAVE_SPEED) * (Math.cos(dist * 0.2) + 0.5) +
          Math.sin(xPos * 0.5 + time) * 0.5 +
          mouseFactor * Math.sin(time * 2)

        dummy.position.set(xPos, yPos, zPos)
        dummy.lookAt(xPos, yPos + 1, zPos)
        
        const scale = 1 + Math.max(0, yPos) * 0.2
        dummy.scale.set(scale, scale, scale)

        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        i++
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL_PARTICLES]}>
      <boxGeometry args={[PARTICLE_SIZE, PARTICLE_SIZE, PARTICLE_SIZE]} />
      <meshStandardMaterial 
        color="#333333" 
        metalness={0.8} 
        roughness={0.4} 
      />
    </instancedMesh>
  )
}

function SceneSetup() {
  useFrame((state) => {
    // Force camera to look at center every frame
    // This fixes the "wave at bottom of box" issue
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function UndulatingStructure() {
  return (
    <Canvas
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{ antialias: false, alpha: true }}
      // Camera initial position:
      // y=12 provides a nice downward angle
      // z=16 pulls back enough to see the whole grid
      camera={{ position: [0, 12, 16], fov: 40 }}
      style={{ background: 'transparent' }}
    >
      <SceneSetup />
      
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#444444" />
      
      <UndulatingMesh />
    </Canvas>
  )
}
