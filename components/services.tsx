"use client"
import { motion } from "framer-motion"

export default function ServicesSection() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden font-satoshi px-6 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/70 to-emerald-950/70" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 lg:p-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-500 mb-6 text-center">
            Services
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 text-center">
            We’re an Agentic AI Factory for Smart Industry 4.0+ Leaders<br />
            Providing pin-point Agentic AI solutions for the manufacturing industry
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Human in the Loop - Approved Information",
              "Embodied AI with integrated sensory systems for interactive manufacturing",
              "Human-AI hybrid intelligence for enhanced problem-solving in manufacturing",
              "Manufacturing Metaverse for simulating and optimizing manufacturing processes",
              "Generative AI in learning policy, decision-making, and advanced control for manufacturing systems",
              "Autonomous Materials Discovery powered multi-agent AI systems",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-emerald-400/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{["🧠", "🤖", "🧬", "🌐", "🎛️", "🔬"][i]}</div>
                  <p className="text-white text-lg font-medium leading-relaxed">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}