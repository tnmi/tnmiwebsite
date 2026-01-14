"use client"

import { motion } from "framer-motion"
import { Brain, Package, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Problem Understanding",
    description: "Tell our AI your challenge and it intelligently matches you with the perfect materials and solutions",
    color: "from-purple-400 to-emerald-400"
  },
  {
    icon: Package,
    title: "Advanced Materials Catalogue",
    description: "Access thousands of high-performance materials and specialty chemicals from verified suppliers",
    color: "from-emerald-400 to-teal-400"
  },
  {
    icon: Zap,
    title: "Toll Manufacturing Capabilities",
    description: "Connect directly with contract manufacturers to bring your custom formulations to life",
    color: "from-cyan-400 to-emerald-400"
  }
]

export default function MarketplaceSection() {
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
            <span>The<span className="text-emerald-400"> Advanced</span></span>
            <span className="block">Materials<span className="text-emerald-400"> Marketplace</span></span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            The procurement platform for advanced materials and specialty chemicals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-emerald-400 mb-12 text-center"
          >
            Your Journey to the Right Materials
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                    <h4 className="text-lg font-bold text-white mb-3">{feature.title}</h4>
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
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of materials buyers finding the suppliers and products they need on our marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.truenorthmaterials.com/login" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium"
                >
                  Browse Materials
                </Button>
              </a>
              <Link href="/request-to-sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-300 font-medium"
                >
                  List Your Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

