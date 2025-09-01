// GameCanvas.tsx - Three.js mount point with minimal PostFX integration
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createComposer, resize, render } from './render/PostFX'

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Basic Three.js setup - placeholder for full game integration
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // Initialize PostFX with default direct rendering (vanilla parity)
    createComposer(renderer, scene, camera, {
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(window.devicePixelRatio)
      resize(width, height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Basic render loop - will be replaced by full game loop
    let raf = 0
    let last = performance.now()
    const animate = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      render(dt) // Uses direct rendering by default (vanilla parity)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} id="game-canvas" />
}