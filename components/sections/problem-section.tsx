"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Zap, Target, Users } from "lucide-react"
import BackgroundVideo from "@/components/background-video"

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const challengeItems = [
    {
      icon: Target,
      title: "A Widening Innovation Gap",
      description:
        "Canada leads in R&D funding, yet innovations often stall between lab discovery and real-world adoption. The disconnect between researchers and the market delays climate-ready breakthroughs.",
    },
    {
      icon: Zap,
      title: "Materials Are Critical, But Underutilized",
      description:
        "Canada sits atop some of the world’s richest mineral reserves, but AI-driven tools are needed to fast-track their use in batteries, semiconductors, and clean infrastructure.",
    },
    {
      icon: Users,
      title: "Data Exists — But It’s Siloed",
      description:
        "Millions of material studies, patents, and sensor signals remain untapped due to fragmentation and lack of intelligent cross-linking. The problem isn’t lack of data — it’s intelligent access.",
    },
  ]

  return (
    <section ref={ref} className="min-h-screen relative overflow-hidden bg-black text-white">
      <BackgroundVideo
        videoUrl="/V5.mp4"
        fallbackImageUrl="/placeholder.svg"
        overlayColor="from-black/80 via-slate-900/70 to-emerald-950/70"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-500 mb-6">
            Why Materials Fail to Reach the Market
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Canada is rich in research and resources — but innovations die in the Valley of Death (TRL 4-7). We built TrueNorth to change that.
          </p>
        </motion.div>

        {/* Problem List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {challengeItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:shadow-emerald-600/20 transition-all"
            >
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-300 text-base leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-28 text-center"
        >
          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-emerald-400/30 shadow-lg p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From Stagnation to Acceleration
            </h3>
            <p className="text-lg text-slate-200 leading-relaxed mb-8">
              Our AI Cores are built to help researchers, industry, and governments turn untapped datasets and material signals into validated, commercial-ready innovations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { value: "60%", label: "Faster Market Entry" },
                { value: "5x", label: "Higher ROI Potential" },
                { value: "85%", label: "TRL 7 Success Rate" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-5 shadow-sm hover:shadow-emerald-300/30 transition-all">
                  <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                  <p className="text-sm mt-2 text-white/90 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}