"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Brain, Network, ArrowRight, DoorOpenIcon } from "lucide-react"

const aiEmployees = [
  {
    name: "Max",
    role: "Market Analysis Agent",
    description: "Analyzes your advanced materials against market demand and identifies where your products create the most value. Max maps your materials across industries, applications, and customer segments. He finds you ideal clients and revenue opportunities.",
    keyFunctions: [
      "Material-Market Fit Analysis",
      "Value Chain Positioning",
      "Revenue Opportunity Identification"
    ],
    image: "/Max.png",
    icon: DoorOpenIcon,
    color: "from-purple-400 to-emerald-400"
  },
  {
    name: "Colette",
    role: "Collaboration Agent",
    description: "Connects your materials with research institutions, innovation networks, and emerging opportunities. Colette discovers partnership potential and unlocks R&D collaboration paths.",
    keyFunctions: [
      "Institution Discovery & Matching",
      "Research Opportunity Identification",
      "Partnership Intelligence",
    ],
    image: "/Colette.png",
    icon: Network,
    color: "from-cyan-400 to-emerald-400"
  }
]

export default function AIEmployeesSection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900/0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Your AI Employees
            <span className="text-emerald-400 block">Their Knowledge Graph is specific to your Product</span>
          </h2>
        </motion.div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {aiEmployees.map((employee, idx) => {
            const Icon = employee.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href="/login" className="block h-full">
                  <div className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] overflow-hidden h-full shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/30 transition-all duration-300 hover:border-emerald-400/50 flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-80 w-full bg-gradient-to-b from-slate-800/50 to-slate-900/50 overflow-hidden flex-shrink-0">
                      <Image
                        src={employee.image}
                        alt={employee.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90" />
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      {/* Icon and Name */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${employee.color} p-0.5 flex-shrink-0`}>
                          <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{employee.name}</h3>
                          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">{employee.role}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        {employee.description}
                      </p>

                      {/* Key Functions */}
                      <div className="space-y-2 flex-grow">
                        <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wide">Key Capabilities</p>
                        <ul className="space-y-2">
                          {employee.keyFunctions.map((func, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                              <span>{func}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mt-6 group-hover:gap-3 transition-all duration-300 pt-4 border-t border-white/10">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 border border-emerald-400/20 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Why Build Your Knowledge Graph?</h3>
          <ul className="grid md:grid-cols-2 gap-6">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Discover Hidden Opportunities</p>
                <p className="text-sm text-slate-300">Uncover new markets, applications, and revenue streams for your materials</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Strategic Positioning</p>
                <p className="text-sm text-slate-300">Understand exactly where your materials fit in global value chains</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Build Strategic Partnerships</p>
                <p className="text-sm text-slate-300">Connect with research institutions and industry leaders automatically</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Accelerate Growth</p>
                <p className="text-sm text-slate-300">Make data-driven decisions about market expansion and product development</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}