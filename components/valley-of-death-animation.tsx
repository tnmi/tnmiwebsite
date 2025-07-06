"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface ValleyOfDeathAnimationProps {
  isInView: boolean
}

interface Innovation {
  id: number
  size: number
  color: string
  delay: number
  speed: number
  success: boolean
  failurePoint: number
}

export default function ValleyOfDeathAnimation({ isInView }: ValleyOfDeathAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate innovation objects with realistic failure patterns
  const innovations: Innovation[] = [
    { id: 1, size: 8, color: "#10b981", delay: 0.5, speed: 1.2, success: true, failurePoint: 0 },
    { id: 2, size: 6, color: "#ef4444", delay: 1.0, speed: 1.0, success: false, failurePoint: 0.25 },
    { id: 3, size: 10, color: "#10b981", delay: 1.5, speed: 1.1, success: true, failurePoint: 0 },
    { id: 4, size: 7, color: "#ef4444", delay: 2.0, speed: 0.9, success: false, failurePoint: 0.4 },
    { id: 5, size: 9, color: "#ef4444", delay: 2.5, speed: 1.0, success: false, failurePoint: 0.6 },
    { id: 6, size: 6, color: "#ef4444", delay: 3.0, speed: 0.8, success: false, failurePoint: 0.3 },
    { id: 7, size: 11, color: "#10b981", delay: 3.5, speed: 1.3, success: true, failurePoint: 0 },
    { id: 8, size: 5, color: "#ef4444", delay: 4.0, speed: 0.9, success: false, failurePoint: 0.5 },
    { id: 9, size: 8, color: "#ef4444", delay: 4.5, speed: 1.0, success: false, failurePoint: 0.35 },
    { id: 10, size: 7, color: "#ef4444", delay: 5.0, speed: 0.8, success: false, failurePoint: 0.7 },
  ]

  const getInnovationPath = (innovation: Innovation) => {
    if (innovation.success) {
      return {
        x: [5, 15, 30, 50, 70, 85, 95],
        y: [25, 28, 45, 55, 45, 28, 25],
        opacity: [0, 1, 1, 1, 1, 1, 1],
        scale: [0.5, 1, 1, 1, 1, 1, 1.2],
      }
    } else {
      const failX = 15 + innovation.failurePoint * 70
      const failY = 28 + innovation.failurePoint * 35
      return {
        x: [5, failX],
        y: [25, failY],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.3],
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg"
    >
      {/* Professional valley background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="valleyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="dangerZone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.05)" />
            <stop offset="50%" stopColor="rgba(239, 68, 68, 0.15)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Valley shape - elegant and professional */}
        <path
          d="M0,25 C20,25 25,30 30,45 C40,60 50,65 50,65 C50,65 60,60 70,45 C75,30 80,25 100,25 L100,70 L0,70 Z"
          fill="url(#valleyGradient)"
          stroke="#94a3b8"
          strokeWidth="0.2"
        />

        {/* Danger zone overlay */}
        <path d="M25,30 C35,50 45,60 50,60 C55,60 65,50 75,30 L75,70 L25,70 Z" fill="url(#dangerZone)" />

        {/* Success path indicator */}
        <path
          d="M5,25 C15,28 30,45 50,55 C70,45 85,28 95,25"
          stroke="#10b981"
          strokeWidth="0.5"
          strokeDasharray="2,3"
          fill="none"
          opacity="0.3"
        />

        {/* Grid lines for professional look */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={20 + i * 15}
            y1="0"
            x2={20 + i * 15}
            y2="70"
            stroke="#e2e8f0"
            strokeWidth="0.1"
            opacity="0.5"
          />
        ))}
      </svg>

      {/* Innovation particles */}
      {innovations.map((innovation) => {
        const path = getInnovationPath(innovation)
        return (
          <motion.div
            key={innovation.id}
            className="absolute rounded-full shadow-lg"
            style={{
              width: innovation.size,
              height: innovation.size,
              backgroundColor: innovation.color,
              filter: innovation.success ? "url(#glow)" : "none",
            }}
            initial={{ opacity: 0, x: "5%", y: "25%", scale: 0.5 }}
            animate={
              isInView
                ? {
                    x: path.x.map((x) => `${x}%`),
                    y: path.y.map((y) => `${y}%`),
                    opacity: path.opacity,
                    scale: path.scale,
                  }
                : {}
            }
            transition={{
              duration: innovation.success ? 10 : 6,
              delay: innovation.delay,
              ease: "easeInOut",
              times: innovation.success ? [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1] : [0, 0.6, 0.8, 1],
            }}
          >
            {/* Particle trail effect for successful innovations */}
            {innovation.success && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: innovation.color }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: innovation.delay + 2,
                }}
              />
            )}
          </motion.div>
        )
      })}

      {/* Professional labels */}
      <div className="absolute top-4 left-4 text-xs font-medium text-slate-600">Research Lab</div>
      <div className="absolute top-4 right-4 text-xs font-medium text-slate-600">Market Success</div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-semibold text-slate-700">Valley of Death</div>
        <div className="text-xs text-slate-500">TRL 4-7</div>
      </div>

      {/* Success rate indicator - minimal and professional */}
      <motion.div
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 z-30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Success Rate</div>
            <div className="text-lg font-bold text-emerald-600">30%</div>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="30, 100"
                initial={{ strokeDasharray: "0, 100" }}
                animate={isInView ? { strokeDasharray: "30, 100" } : {}}
                transition={{ duration: 2, delay: 4 }}
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
