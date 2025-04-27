"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 150)
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: getRandomColor(),
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    // Get a random color with a green bias
    const getRandomColor = () => {
      // Mostly green with some blue and teal variations
      const hue = Math.random() * 60 + 100 // 100-160 range (greens to teals)
      const saturation = Math.random() * 30 + 70 // 70-100%
      const lightness = Math.random() * 20 + 40 // 40-60%
      return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Connect particles that are close to each other
        connectParticles(particle, index)

        // Interact with mouse
        interactWithMouse(particle)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Connect nearby particles with lines
    const connectParticles = (particle: Particle, index: number) => {
      const connectionRadius = 100

      for (let i = index + 1; i < particlesRef.current.length; i++) {
        const otherParticle = particlesRef.current[i]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionRadius) {
          // Calculate opacity based on distance
          const opacity = 1 - distance / connectionRadius

          ctx.beginPath()
          ctx.strokeStyle = `rgba(0, 122, 51, ${opacity * 0.2})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      }
    }

    // Make particles react to mouse position
    const interactWithMouse = (particle: Particle) => {
      const mouseX = mousePositionRef.current.x
      const mouseY = mousePositionRef.current.y
      const dx = particle.x - mouseX
      const dy = particle.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 150

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance
        const directionX = dx / distance || 0
        const directionY = dy / distance || 0

        particle.x += directionX * force * 1
        particle.y += directionY * force * 1
      }
    }

    // Set up event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Initialize
    handleResize()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"
    />
  )
}
