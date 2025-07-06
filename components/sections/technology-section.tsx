"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import AICoresSection from "@/components/ai-cores-section"

export default function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="technology"
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 text-white"
    >
      {/* Optional ambient particle or pattern background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-400/10 via-transparent to-transparent blur-3xl opacity-20" />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-6xl font-bold leading-tight md:leading-[1.2] mb-6 tracking-tight 
                       text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-emerald-400 
                       py-4"
          >
            AI Cores: Designed for <span className="whitespace-nowrap">Deployment</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Each Core is a modular AI engine built to ingest signals from labs, field sensors, and academic research —
            transforming raw data into decision-grade intelligence.
          </p>
        </motion.div>

        {/* AICores Section (glass-style cards inside) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative"
        >
          <AICoresSection isInView={isInView} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 text-center"
        >
        </motion.div>
      </div>
    </section>
  )
}