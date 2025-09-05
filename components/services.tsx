"use client"
import { motion } from "framer-motion"

export default function ServicesSection() {
  return (
    <section 
	id="services"
	className="relative min-h-screen bg-black text-white overflow-hidden font-satoshi px-6 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/70 to-emerald-950/70" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 lg:p-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-500 mb-6 text-center">
            Workflow Services
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 text-center">
  <span className="block mt-2 text-2xl sm:text-3xl font-semibold text-emerald-300/90 tracking-wide drop-shadow-[0_0_15px_rgba(16,185,129,0.25)]">
    Material Data for Smarter Commercial Decisions.
  </span>
  <span className="block mt-2">
    <span className="text-slate-300">Industry 4.0 to 5.0:</span>{" "}
    <span className="text-emerald-200 font-semibold">Agentic AI Workflows</span>
  </span>
  <span className="block mt-2">
    <span className="text-slate-300">Industries:</span>{" "}
    <span className="text-emerald-200 font-semibold">Advanced Materials, Critical Minerals, and Manufacturing</span>
  </span>
  <span className="block mt-2">
    <span className="text-slate-300">Based on technical information:</span>{" "}
    <span className="text-emerald-200 font-semibold">Match your material properties to markets</span>
  </span>
</p>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
  "Materials Passport - Pass through commercialization gate checks and TRL milestones that Business, Technical and Sales teams understand.",
  "Market Pull Agent - Understand what the market needs, how to build for it and, how to access it.",
  "Relevant Research Agent - Cross technical hurdles & stay in control during technical discussions with personalized academic literature.",
  "Process Improvement Agent - Scan 100s of equipment processes to find the best fit for your material. Maximize your runway.",
  "Design of Experiments Maker - Compile 2000+ literature experiments into a personalized DOE for your product. Maximize your time",
  "Grants & Challenges Radar Agent - Track IRAP, XPRIZE, DIANA, and sector calls. Increase your marketing and funding opportunities.",
  "Sales-Lead Agent - Qualify prospects and map requirements to your capabilities. Find the right buyer faster.",
  "Equipment Scouter Agent - Find lead times, equipment matches and price comparisons in an hour, tailored to your product."
].map((item, i) => (
  <motion.div
    key={item}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
    className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-emerald-400/30 transition-all"
  >
    <p className="text-white text-lg font-medium leading-relaxed"><span className="text-emerald-300 font-semibold">{item.split(" - ")[0]}</span>{item.includes(" - ") ? ` - ${item.split(" - ").slice(1).join(" - ")}` : ""}</p>
  </motion.div>
))}

          </div>
        </motion.div>
      </div>
<p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 text-center">
  <span className="block mt-2 text-2xl sm:text-3xl font-semibold text-emerald-300/90 tracking-wide drop-shadow-[0_0_15px_rgba(16,185,129,0.25)]">
    Get it right the first time.
  </span>
  </p>
    </section>
  )
}