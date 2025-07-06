"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { TrendingDown, AlertTriangle, DollarSign } from "lucide-react"

interface ValleyOfDeathGraphicProps {
  isInView: boolean
}

export default function ValleyOfDeathGraphic({ isInView }: ValleyOfDeathGraphicProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg"
    >
      {/* Professional infographic background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="failureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="valleyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
            <stop offset="50%" stopColor="rgba(239, 68, 68, 0.2)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
          </linearGradient>
        </defs>

        {/* Success path */}
        <path
          d="M5,25 C15,25 20,20 30,20 C40,20 50,15 60,15 C70,15 80,20 90,20 C95,20 95,25 95,25"
          stroke="url(#successGradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />

        {/* Valley of death area */}
        <path d="M20,25 C30,35 40,45 50,50 C60,45 70,35 80,25 L80,65 L20,65 Z" fill="url(#valleyGradient)" />

        {/* Failure paths */}
        {Array.from({ length: 8 }).map((_, i) => {
          const startX = 20 + i * 7.5
          const endX = startX + Math.random() * 20 + 10
          const endY = 35 + Math.random() * 20
          return (
            <motion.path
              key={i}
              d={`M${startX},25 C${startX + 5},30 ${endX - 5},${endY - 5} ${endX},${endY}`}
              stroke="url(#failureGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3,3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
              transition={{ duration: 2, delay: 1 + i * 0.2 }}
            />
          )
        })}

        {/* Success path animation */}
        <motion.path
          d="M5,25 C15,25 20,20 30,20 C40,20 50,15 60,15 C70,15 80,20 90,20 C95,20 95,25 95,25"
          stroke="#10b981"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 3, delay: 0.5 }}
        />
      </svg>

      {/* Labels and statistics */}
      <div className="absolute inset-0 p-6">
        {/* Research Lab */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200"
        >
          <div className="text-sm font-semibold text-slate-900">Research Lab</div>
          <div className="text-xs text-slate-600">TRL 1-3</div>
        </motion.div>

        {/* Market Success */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200"
        >
          <div className="text-sm font-semibold text-slate-900">Market Success</div>
          <div className="text-xs text-slate-600">TRL 8-9</div>
        </motion.div>

        {/* Valley of Death label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Valley of Death
            </div>
            <div className="text-sm text-red-600">TRL 4-7</div>
            <div className="text-xs text-red-500 mt-1">Where many innovations fail</div>
          </div>
        </motion.div>

        {/* Statistics cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">Canadian R&D Investment</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">$51.7B</div>
          <div className="text-xs text-slate-600">Annual investment with limited commercialization</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-slate-900">Innovation Success</span>
          </div>
          <div className="text-2xl font-bold text-red-600">Significant Gap</div>
          <div className="text-xs text-slate-600">Many patents never reach market</div>
        </motion.div>
      </div>

      {/* Animated particles representing failed innovations */}
      {isInView &&
        Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-red-400 rounded-full"
            style={{
              left: `${20 + i * 4}%`,
              top: "25%",
            }}
            animate={{
              y: [0, 100, 150],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 3,
              delay: 2 + i * 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 5,
            }}
          />
        ))}

      {/* Success particles */}
      {isInView &&
        Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`success-${i}`}
            className="absolute w-3 h-3 bg-emerald-400 rounded-full shadow-lg"
            style={{
              left: "5%",
              top: "25%",
            }}
            animate={{
              x: ["0%", "900%"],
              y: [0, -20, -10, -30, -20, 0],
              scale: [0.5, 1, 1.2, 1, 1, 1.5],
            }}
            transition={{
              duration: 8,
              delay: 3 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 10,
            }}
          />
        ))}
    </div>
  )
}
