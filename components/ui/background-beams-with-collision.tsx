"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BackgroundBeamsWithCollision = ({
  children,
  className,
  beamColor1 = "rgba(76, 29, 149, 0.15)",
  beamColor2 = "rgba(59, 130, 246, 0.15)",
  beamColor3 = "rgba(16, 185, 129, 0.15)",
  beamCount = 20,
  particleCount = 50,
  particleColor = "rgba(255, 255, 255, 0.8)",
  disableParticles = false,
}: {
  children: React.ReactNode
  className?: string
  beamColor1?: string
  beamColor2?: string
  beamColor3?: string
  beamCount?: number
  particleCount?: number
  particleColor?: string
  disableParticles?: boolean
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [particles, setParticles] = useState<any[]>([])
  const [beams, setBeams] = useState<any[]>([])
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })
  const animationRef = useRef<number>(0)
  const beamsRef = useRef<any[]>([])
  const particlesRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    setCtx(context)

    const handleResize = () => {
      if (canvas) {
        const dpr = window.devicePixelRatio || 1
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        setDimensions({
          width: window.innerWidth * dpr,
          height: window.innerHeight * dpr,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    if (!ctx || dimensions.width === 0 || dimensions.height === 0) return

    // Initialize beams
    const newBeams = []
    for (let i = 0; i < beamCount; i++) {
      const colors = [beamColor1, beamColor2, beamColor3]
      newBeams.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        width: Math.random() * 10 + 2,
        height: Math.random() * 200 + 50,
        speed: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.05,
      })
    }
    setBeams(newBeams)
    beamsRef.current = newBeams

    // Initialize particles
    if (!disableParticles) {
      const newParticles = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          color: particleColor,
          angle: Math.random() * Math.PI * 2,
        })
      }
      setParticles(newParticles)
      particlesRef.current = newParticles
    }
  }, [ctx, dimensions, beamCount, particleCount, beamColor1, beamColor2, beamColor3, particleColor, disableParticles])

  useEffect(() => {
    if (!ctx || beams.length === 0) return

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw beams
      beamsRef.current = beamsRef.current.map((beam) => {
        const newBeam = { ...beam }
        newBeam.angle += newBeam.angleSpeed
        newBeam.x += Math.cos(newBeam.angle) * newBeam.speed
        newBeam.y += Math.sin(newBeam.angle) * newBeam.speed

        // Bounce off walls
        if (newBeam.x < 0 || newBeam.x > dimensions.width) {
          newBeam.angle = Math.PI - newBeam.angle
        }
        if (newBeam.y < 0 || newBeam.y > dimensions.height) {
          newBeam.angle = -newBeam.angle
        }

        // Draw beam
        ctx.save()
        ctx.translate(newBeam.x, newBeam.y)
        ctx.rotate(newBeam.angle)
        ctx.fillStyle = newBeam.color
        ctx.fillRect(-newBeam.width / 2, -newBeam.height / 2, newBeam.width, newBeam.height)
        ctx.restore()

        return newBeam
      })

      // Update and draw particles
      if (!disableParticles) {
        particlesRef.current = particlesRef.current.map((particle) => {
          const newParticle = { ...particle }
          newParticle.x += Math.cos(newParticle.angle) * newParticle.speed
          newParticle.y += Math.sin(newParticle.angle) * newParticle.speed

          // Wrap around edges
          if (newParticle.x < 0) newParticle.x = dimensions.width
          if (newParticle.x > dimensions.width) newParticle.x = 0
          if (newParticle.y < 0) newParticle.y = dimensions.height
          if (newParticle.y > dimensions.height) newParticle.y = 0

          // Draw particle
          ctx.beginPath()
          ctx.arc(newParticle.x, newParticle.y, newParticle.size, 0, Math.PI * 2)
          ctx.fillStyle = newParticle.color
          ctx.fill()

          return newParticle
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [ctx, dimensions, disableParticles])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
