"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface TRLScaleProps {
  isInView: boolean
}

interface TRLLevel {
  level: number
  name: string
  description: string
  aiHelp: string
  color: string
  phase: "research" | "valley" | "commercial"
}

export default function TRLScale({ isInView }: TRLScaleProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const trlLevels: TRLLevel[] = [
    {
      level: 1,
      name: "Basic Research",
      description: "Fundamental scientific principles observed and reported.",
      aiHelp:
        "AI-driven literature synthesis and knowledge graph creation to uncover novel research avenues, predict fundamental material properties, and identify white spaces in existing research.",
      color: "bg-blue-400",
      phase: "research",
    },
    {
      level: 2,
      name: "Applied Research",
      description: "Technology concept and/or application formulated based on basic principles.",
      aiHelp:
        "AI-powered correlation mapping between material characteristics and diverse application requirements, generating hypotheses for technology concepts and targeted use-case scenarios.",
      color: "bg-blue-500",
      phase: "research",
    },
    {
      level: 3,
      name: "Critical Function",
      description: "Analytical and experimental critical function and/or characteristic proof-of-concept.",
      aiHelp:
        "AI-guided Design of Experiments (DoE) for efficient proof-of-concept validation, predictive modeling of Key Performance Indicators (KPIs), and early-stage risk assessment for critical functions.",
      color: "bg-blue-600",
      phase: "research",
    },
    {
      level: 4,
      name: "Lab Validation",
      description: "Component and/or breadboard validation in a laboratory environment.",
      aiHelp:
        "AI-driven partner discovery and compatibility scoring, connecting validated lab-scale components with industry needs. Predictive modeling for initial scale-up challenges and material behavior in controlled environments.",
      color: "bg-red-500",
      phase: "valley",
    },
    {
      level: 5,
      name: "Simulated Environment",
      description: "Component and/or breadboard validation in a relevant (simulated) environment.",
      aiHelp:
        "Advanced AI simulations to predict component performance under diverse, relevant environmental stressors. AI-assisted scaling analysis, identifying potential manufacturing bottlenecks and optimizing for larger-scale production.",
      color: "bg-red-600",
      phase: "valley",
    },
    {
      level: 6,
      name: "Prototype",
      description: "System/subsystem model or prototype demonstration in a relevant environment.",
      aiHelp:
        "AI-driven optimization of prototype manufacturing processes, predictive cost modeling for pilot-scale production, and performance validation of system/subsystem models in simulated operational environments.",
      color: "bg-red-700",
      phase: "valley",
    },
    {
      level: 7,
      name: "Operational Environment",
      description: "System prototype demonstration in an operational environment.",
      aiHelp:
        "AI-powered integration with enterprise systems for seamless data flow. Real-time operational performance monitoring, anomaly detection, and predictive maintenance for system prototypes in actual operational settings.",
      color: "bg-red-800",
      phase: "valley",
    },
    {
      level: 8,
      name: "System Complete",
      description: "Actual system completed and qualified through test and demonstration.",
      aiHelp:
        "AI-driven supply chain resilience modeling and optimization. Data-backed market adoption strategies, including pricing models and competitive landscape analysis for qualified systems.",
      color: "bg-emerald-500",
      phase: "commercial",
    },
    {
      level: 9,
      name: "Mission Proven",
      description: "Actual system proven through successful mission operations.",
      aiHelp:
        "AI-enabled continuous monitoring of in-field performance for ongoing optimization and lifecycle management. Data feedback loops for AI-assisted design of next-generation materials and systems based on proven operational data.",
      color: "bg-emerald-400",
      phase: "commercial",
    },
  ]

  const handleLevelClick = (level: number) => {
    setSelectedLevel(selectedLevel === level ? null : level)
  }

  return (
    <div className="w-full overflow-x-visible py-20 px-6 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 mb-8 py-6">
          Navigate the Technology Readiness Level Scale
        </h2>
        <p className="text-slate-300 max-w-4xl text-center mx-auto">
          Discover how AI powers your path from scientific discovery to commercial breakthrough one mission-ready stage at a time.
        </p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto py-28 px-6">
  {/* Timeline vertical line */}
  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-red-500 to-green-500 opacity-30 z-0"></div>

  <div className="relative z-10 space-y-16">
    {trlLevels.map((trl, index) => {
      const isEven = index % 2 === 0
      const isSelected = selectedLevel === trl.level

      return (
        <motion.div
          key={trl.level}
          onClick={() => setSelectedLevel(trl.level === selectedLevel ? null : trl.level)}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`relative flex flex-col sm:flex-row items-center sm:items-stretch ${
            isEven ? "sm:flex-row-reverse" : ""
          }`}
        >
          {/* Glass Card with number and title inside */}
          <div className="flex-1 max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-lg pt-6 pb-4 px-6 sm:ml-10 sm:mr-10 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-xl border-4 border-white/30 bg-white/10 backdrop-blur-md">
                {trl.level}
              </div>
              <h3 className="text-white text-xl font-semibold">{trl.name}</h3>
            </div>
            {isSelected && (
              <>
                <p className="text-sm text-slate-300 mb-3">{trl.description}</p>
                <div className="text-sm text-emerald-400 font-medium mb-1">How AI Helps:</div>
                <p className="text-sm text-slate-400">{trl.aiHelp}</p>
              </>
            )}
          </div>
        </motion.div>
      )
    })}
  </div>
</div>
    </div>
  )
}