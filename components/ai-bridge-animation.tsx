"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

interface AIBridgeAnimationProps {
  isInView: boolean
}

export default function AIBridgeAnimation({ isInView }: AIBridgeAnimationProps) {
  const numInnovations = 15

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-red-50 via-red-100 to-slate-100 rounded-xl overflow-hidden border border-red-200 shadow-lg p-4">
      {/* Valley Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="valleyFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="60%" stopColor="rgba(252, 165, 165, 0.3)" /> {/* Light red for valley bottom */}
            <stop offset="100%" stopColor="rgba(252, 165, 165, 0.1)" />
          </linearGradient>
          <linearGradient id="skyFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(224, 242, 254, 0.5)" /> {/* Light blue sky */}
            <stop offset="100%" stopColor="rgba(224, 242, 254, 0.1)" />
          </linearGradient>
        </defs>
        <rect width="300" height="150" fill="url(#skyFill)" />
        <path
          d="M0,80 Q75,130 150,80 T300,80 L300,150 L0,150 Z" // Smoother valley shape
          fill="url(#valleyFill)"
          stroke="rgba(239, 68, 68, 0.3)" // Reddish stroke for valley edge
          strokeWidth="1"
        />
        {/* Starting Platform */}
        <rect x="0" y="60" width="50" height="20" fill="rgba(156, 163, 175, 0.6)" rx="2" />
        <text x="10" y="74" fontSize="6" fill="#4b5563">
          Research Lab
        </text>

        {/* Ending Platform */}
        <rect x="250" y="60" width="50" height="20" fill="rgba(16, 185, 129, 0.6)" rx="2" />
        <text x="255" y="74" fontSize="6" fill="#047857">
          Market Success
        </text>
      </svg>

      {/* Innovations */}
      {Array.from({ length: numInnovations }).map((_, i) => {
        const fallsInValley = i % 3 !== 0 // Most fall
        const startDelay = 1 + i * 0.3
        const duration = 3 + Math.random() * 2

        return (
          <motion.div
            key={`innovation-${i}`}
            className="absolute w-2.5 h-2.5 rounded-full opacity-80"
            style={{
              left: "10%", // Start from the lab platform
              top: "45%", // y: 70 on a 150 height viewBox
              backgroundColor: fallsInValley ? "#f87171" : "#34d399", // Red for fail, Green for success
              boxShadow: `0 0 5px ${fallsInValley ? "#ef4444" : "#10b981"}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    opacity: [0, 1, 1, fallsInValley ? 0.5 : 1, fallsInValley ? 0 : 1],
                    x: fallsInValley ? [0, 100, 120 + Math.random() * 20] : [0, 230], // x: 250 on 300 width
                    y: fallsInValley
                      ? [0, -20, 40 + Math.random() * 10, 60] // Fall into valley
                      : [0, -10, 0], // Cross successfully
                  }
                : {}
            }
            transition={{
              duration: duration,
              delay: startDelay,
              ease: "easeInOut",
              times: fallsInValley ? [0, 0.2, 0.5, 0.7, 1] : [0, 0.4, 1],
            }}
          />
        )
      })}

      {/* AI Bridge */}
      <motion.div
        className="absolute h-1.5 bg-gradient-to-r from-blue-400 to-tn-primary-blue rounded-full shadow-lg"
        style={{
          left: "15%", // Start after lab platform
          top: "48%", // Slightly above valley bottom
          width: 0, // Initial width
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: "70%", opacity: 1 } : {}} // Span 70% of the container width
        transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 4.5 }}
        >
          <Zap className="w-3 h-3 text-tn-primary-blue" />
          <span className="text-xs font-medium text-tn-primary-blue">AI Bridge</span>
        </motion.div>
      </motion.div>

      {/* Innovations crossing via AI Bridge (appear after bridge) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const startDelay = 5 + i * 0.5 // Start after bridge is formed
        const duration = 2.5 + Math.random() * 1

        return (
          <motion.div
            key={`ai-innovation-${i}`}
            className="absolute w-3 h-3 rounded-full bg-tn-success-green opacity-90 shadow-lg"
            style={{
              left: "10%",
              top: "45%",
              boxShadow: "0 0 8px #059925",
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    opacity: [0, 1, 1, 1],
                    x: [0, 230], // Cross successfully
                    y: [0, -5, 0], // Slight arc over bridge
                  }
                : {}
            }
            transition={{
              duration: duration,
              delay: startDelay,
              ease: "circOut", // Different ease for effect
              times: [0, 0.2, 0.8, 1],
            }}
          />
        )
      })}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-semibold text-red-700">The Valley of Death</div>
        <div className="text-xs text-red-500">Where many material innovations struggle (TRL 4-7)</div>
      </div>
    </div>
  )
}
