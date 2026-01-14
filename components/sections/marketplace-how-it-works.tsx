"use client"

import { motion } from "framer-motion"
import { Search, Handshake, Users, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Browse thousands of advanced materials and specialty chemicals from verified suppliers worldwide",
    icon: Search
  },
  {
    number: "02",
    title: "Connect",
    description: "Match with toll manufacturers, research institutions, and B2B partners in your industry",
    icon: Handshake
  },
  {
    number: "03",
    title: "Collaborate",
    description: "Negotiate terms, share specifications, and build long-term partnerships",
    icon: Users
  },
  {
    number: "04",
    title: "Execute",
    description: "Seamlessly manage procurement, manufacturing, and research partnerships",
    icon: TrendingUp
  }
]

export default function MarketplaceHowItWorks() {
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

        {/* How It Works */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-emerald-400 mb-12 text-center"
          >
            How It Works
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Card */}
                  <div className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 h-full shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/20 transition-all duration-300 group">
                    {/* Step Number */}
                    <div className="text-6xl font-bold text-emerald-400/20 mb-4">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-all duration-300">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow Connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-emerald-400/40" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
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
    </section>
  )
}
