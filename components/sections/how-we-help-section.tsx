"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import BackgroundVideo from "@/components/background-video"
import TRLScale from "@/components/trl-scale"

export default function HowWeHelpSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="how-we-help"
      ref={ref}
      className="relative min-h-screen overflow-hidden py-24 px-6 sm:px-8 lg:px-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <BackgroundVideo
        videoUrl="/vid3.mp4"
        fallbackImageUrl="/placeholder.svg"
        overlayColor="from-slate-900/90 via-slate-800/90 to-slate-900/90"
      />

      {/* Glass Layer */}
      <div className="absolute inset-0 z-0 bg-white/5 backdrop-blur-2xl rounded-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-emerald-400 mb-6 tracking-tight leading-tight py-4">
            Bridging TRL Gaps with Intelligence
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Our AI Cores are purpose-built to accelerate innovation across TRL 1–9, with laser focus on bridging the “valley of death” between lab research and market reality.
          </p>
        </motion.div>

        {/* TRL Visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <TRLScale isInView={isInView} />
        </motion.div>

        {/* AI Core Results */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center"
        >
          {[
            { stat: "60%", label: "Faster to Market", desc: "Accelerate deployments using AI insight." },
            { stat: "85%", label: "Prediction Accuracy", desc: "Leverage reliable, data-driven foresight." },
            { stat: "3-5x", label: "ROI Boost", desc: "Maximize value from R&D investments." },
          ].map(({ stat, label, desc }, idx) => (
            <motion.div
              key={label}
              className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
            >
              <div className="text-5xl font-bold text-white mb-3">{stat}</div>
              <h4 className="text-lg font-semibold text-emerald-300 mb-1">{label}</h4>
              <p className="text-sm text-slate-300">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, delay: 1 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-inner p-10"
        >
          <h3 className="text-2xl font-semibold text-emerald-300 mb-8 text-center">Why Our AI Cores Excel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 text-left">
            {[
              { title: "Data-Driven Discovery", text: "Leverage domain-specific big data to find patterns and opportunities." },
              { title: "Sensor Intelligence", text: "Utilize real-time sensor feedback to optimize performance." },
              { title: "TRL 4–7 Bridging", text: "Target the most critical development gap with focused AI." },
              { title: "Scalable Integration", text: "From pilot to production, our systems adapt and scale." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                <div className="w-2 h-2 mt-2 bg-emerald-400 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}