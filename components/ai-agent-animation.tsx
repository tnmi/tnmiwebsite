"use client"

import { motion } from "framer-motion"
import { Brain, FileText, Zap, Database, Search, Cpu, Atom } from "lucide-react"

interface AIAgentAnimationProps {
  isInView: boolean
}

const coreIcons = [
  { Icon: Atom, color: "text-emerald-500", name: "CABAL" },
  { Icon: Zap, color: "text-blue-500", name: "LABAL" },
  { Icon: Cpu, color: "text-purple-500", name: "NABAL" },
  { Icon: Database, color: "text-cyan-500", name: "HABAL" },
  { Icon: Search, color: "text-green-500", name: "SBAL" },
  { Icon: Brain, color: "text-orange-500", name: "PMAL" },
]

export default function AIAgentAnimation({ isInView }: AIAgentAnimationProps) {
  const numPapers = 12
  const radius = 150 // Radius for paper distribution

  const paperVariants = {
    initial: (i: number) => ({
      opacity: 0,
      x: Math.cos((i / numPapers) * 2 * Math.PI) * radius + Math.random() * 40 - 20,
      y: Math.sin((i / numPapers) * 2 * Math.PI) * radius + Math.random() * 40 - 20,
      scale: 0.8,
    }),
    animate: (i: number) => ({
      opacity: 1,
      x: Math.cos((i / numPapers) * 2 * Math.PI) * radius,
      y: Math.sin((i / numPapers) * 2 * Math.PI) * radius,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
    collect: {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0.2,
      transition: {
        duration: 0.8,
        ease: "anticipate",
      },
    },
  }

  const coreIconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5 + i * 0.15,
        duration: 0.5,
        type: "spring",
        stiffness: 120,
      },
    }),
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Central AI Core */}
      <motion.div
        className="absolute z-10 flex flex-col items-center justify-center bg-slate-800 p-6 rounded-full shadow-2xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 150 }}
      >
        <Brain className="w-16 h-16 text-emerald-400 mb-2" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">AI Engine</span>
      </motion.div>

      {/* Data Papers */}
      {Array.from({ length: numPapers }).map((_, i) => (
        <motion.div
          key={`paper-${i}`}
          className="absolute bg-white p-2 rounded shadow-md flex items-center space-x-1"
          variants={paperVariants}
          custom={i}
          initial="initial"
          animate={isInView ? (i < numPapers ? "animate" : "collect") : "initial"} // Keep animating to center
          exit="collect" // This might not trigger as expected without a parent AnimatePresence
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <div className="w-8 h-1 bg-slate-300 rounded-sm" />
        </motion.div>
      ))}

      {/* Surrounding AI Cores - these appear after papers are "processed" */}
      {coreIcons.map((core, i) => (
        <motion.div
          key={`core-icon-${i}`}
          className="absolute flex flex-col items-center"
          style={{
            transform: `rotate(${(i / coreIcons.length) * 360}deg) translate(${radius + 60}px) rotate(-${(i / coreIcons.length) * 360}deg)`,
          }}
          variants={coreIconVariants}
          custom={i}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className={`p-3 rounded-full bg-white shadow-lg border ${core.color.replace("text-", "border-")}`}>
            <core.Icon className={`w-6 h-6 ${core.color}`} />
          </div>
          <span className={`mt-1 text-xs font-medium ${core.color}`}>{core.name}</span>
        </motion.div>
      ))}

      {/* Animated connection lines (simplified) */}
      {isInView &&
        coreIcons.map((_, i) => (
          <motion.svg
            key={`line-${i}`}
            className="absolute w-full h-full top-0 left-0 overflow-visible"
            style={{ pointerEvents: "none" }}
          >
            <motion.line
              x1="50%"
              y1="50%"
              x2={`${50 + ((radius + 60) / (Math.min(300, 300) / 2) / 2) * Math.cos((i / coreIcons.length) * 2 * Math.PI - Math.PI / 2) * 50}%`}
              y2={`${50 + ((radius + 60) / (Math.min(300, 300) / 2) / 2) * Math.sin((i / coreIcons.length) * 2 * Math.PI - Math.PI / 2) * 50}%`}
              stroke="rgba(100, 116, 139, 0.3)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 2.0 + i * 0.1 }}
            />
          </motion.svg>
        ))}
    </div>
  )
}
