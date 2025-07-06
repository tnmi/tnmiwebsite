"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Zap, Target, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function DecisionMakingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const sectionClass = "relative z-10 min-h-screen px-6 py-28 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900/10 to-black backdrop-blur-2xl"

  const decisionStats = [
    {
      icon: Target,
      current: "40%",
      improved: "70-90%",
      title: "Information Coverage",
      description: "Most decisions are made with incomplete data",
    },
    {
      icon: Zap,
      current: "20+ days",
      improved: "3-5 days",
      title: "Analysis Time",
      description: "From weeks of research to days of AI-powered insights",
    },
    {
      icon: BarChart3,
      current: "60%",
      improved: "85%",
      title: "Prediction Accuracy",
      description: "Higher confidence in material performance outcomes",
    },
  ]

  return (
    <section
      ref={ref}
      className={sectionClass}
    >
      <div className="max-w-7xl mx-auto text-center space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-emerald-400 py-10 mb-8 leading-tight">
            Intelligence at the Edge of Discovery
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            In a world of exponential materials and fleeting opportunities, AI Cores operate at the frontier—synthesizing incomplete signals into decisive breakthroughs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: Target,
              title: "01. Discover Gaps",
              color: "text-rose-400",
              text: "Only 40% of data is typically considered—leading to missed signals and blind spots in R&D decisions.",
            },
            {
              icon: Zap,
              title: "02. Accelerate Insights",
              color: "text-yellow-300",
              text: "AI Cores synthesize information 5x faster, compressing analysis timelines from 20+ days to just 3–5.",
            },
            {
              icon: BarChart3,
              title: "03. Predict with Confidence",
              color: "text-emerald-400",
              text: "Material performance forecasting reaches 85% accuracy—minimizing trial-and-error and boosting certainty.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 hover:shadow-emerald-500/20 transition"
            >
              <item.icon className={`w-8 h-8 mb-4 ${item.color}`} />
              <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
              <p className="text-slate-300 text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
