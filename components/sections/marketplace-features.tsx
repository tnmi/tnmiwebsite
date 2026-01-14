"use client"

import { motion } from "framer-motion"
import { Package, Zap, Handshake, Microscope, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Package,
    title: "Advanced Materials Marketplace",
    description: "Access a curated selection of high-performance materials and specialty chemicals",
    color: "from-emerald-400 to-teal-400"
  },
  {
    icon: Microscope,
    title: "Research Partnerships",
    description: "Connect directly with research institutions and academic collaborators",
    color: "from-blue-400 to-emerald-400"
  },
  {
    icon: Zap,
    title: "Toll Manufacturing",
    description: "Find contract manufacturers for specialized production and processing",
    color: "from-emerald-400 to-cyan-400"
  },
  {
    icon: BarChart3,
    title: "B2B Procurement",
    description: "Streamlined procurement platform for industrial buyers and suppliers",
    color: "from-emerald-400 to-green-400"
  },
  {
    icon: Handshake,
    title: "Market Intelligence",
    description: "Access insights on market trends, pricing, and industry opportunities",
    color: "from-cyan-400 to-emerald-400"
  },
  {
    icon: Users,
    title: "Ecosystem Network",
    description: "Join a global network of materials innovators and industry experts",
    color: "from-emerald-400 to-lime-400"
  }
]

export default function MarketplaceFeatures() {
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Advanced Materials
            <span className="text-emerald-400 block">Marketplace</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Connect, discover, and collaborate with the world's advanced materials, specialty chemicals, toll manufacturers, and research institutions all in one ecosystem.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-emerald-400 mb-12 text-center"
          >
            Marketplace Features
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 h-full shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/30 transition-all duration-300 hover:border-emerald-400/50">
                    {/* Icon with gradient background */}
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white group-hover:text-emerald-300 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-400/20 via-teal-400/10 to-cyan-400/20 border border-emerald-400/30 rounded-[2rem] p-8 md:p-12 text-center backdrop-blur-[14px] shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join the Ecosystem?</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Whether you're a supplier looking to reach global buyers, or a buyer seeking quality materials and partnerships, our marketplace connects you with opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request-to-sell">
                <Button
                  size="lg"
                  className="bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium"
                >
                  Sell on the Platform
                </Button>
              </Link>
              <a href="https://www.truenorthmaterials.com/login" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-300 font-medium"
                >
                  Explore as Buyer
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
