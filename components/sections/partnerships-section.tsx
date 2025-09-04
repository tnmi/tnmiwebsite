"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Zap, Target, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import BackgroundVideo from "@/components/background-video"
import Link from "next/link"

export default function PartnershipsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="Industry or Startup Partnerships" ref={ref} className="min-h-screen relative overflow-hidden">
      <BackgroundVideo
        videoUrl="/Vid1.mp4"
        fallbackImageUrl="/placeholder.svg"
        overlayColor="from-slate-900/90 via-slate-800/90 to-slate-900/90"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Strategic Partnerships</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Augment the Human aspect of your business with AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-white mt-16 grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Startups */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-2xl bg-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Startup Partnership</h3>
            <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <li>🔗 Find the market pull.</li>
              <li>📊 Get conneted to the ecosystem that exists to help you.</li>
              <li>💸 Material-use Discovery (find a buyer for your material!) </li>
              <li>🚀 Is there a use for your material or material product you're missing?</li>
            </ul>
            <a
              href="/startup-partnership"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium h-14 mt-6 px-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-lg transition-all shadow-lg"
            >
              Startup Form
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Industry */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-2xl bg-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Enterprise Partnership</h3>
            <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <li>🧠 Make decisions with data-driven intelligence</li>
              <li>🔬 Reduce your R&D time by up to 90%</li>
              <li>📈 Increase productivity and reduce energy costs</li>
              <li>🏗️ More companies adopt AI everyday, are you keeping up?</li>
            </ul>
            <a
              href="/industry-partnership"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium h-14 mt-6 px-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-lg transition-all shadow-lg"
            >
              Enterprise Form
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
