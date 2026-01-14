"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import BackgroundVideo from "@/components/background-video"

export default function InvestorsPage() {
  return (
    <div className="relative font-['Satoshi',sans-serif] bg-[#0f172a] min-h-screen">
      {/* Navigation Back */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <div className="relative w-full h-full">
            <BackgroundVideo
              videoUrl="/V5.mp4"
              fallbackImageUrl="/placeholder.svg"
              overlayColor="from-black/80 via-slate-900/70 to-emerald-800/70"
              pingPong
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center z-10 max-w-4xl mx-auto px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-5xl md:text-7xl font-semibold bg-gradient-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent tracking-tight mb-6"
          >
            Investor
            <span className="text-emerald-400 block">Relations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Strategic Investment Opportunities in Advanced Materials
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Information Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-6">About Our Investor Relations</h2>
            <p className="text-slate-200 text-lg leading-relaxed mb-6">
              This investor relations section aims to deliver timely news and information updates to existing and potential investors. The Board places great importance on the need for effective communication with investors and the media.
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              At TrueNorth Material Innovations, we are committed to transparency, accountability, and building long-term value for our stakeholders. Our platform connects suppliers of advanced materials with buyers and researchers, creating a dynamic ecosystem that drives innovation in the materials industry.
            </p>
          </motion.div>

          {/* Pitch Deck Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center mb-8">
              <FileText className="w-12 h-12 text-emerald-400 mr-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">Our Pitch Deck</h3>
            </div>

            <p className="text-slate-300 mb-8 text-base">
              Explore our comprehensive pitch deck to learn more about TrueNorth Material Innovations' mission, market opportunity, business model, and growth strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/TNMIPitchDeck2026.pdf" download className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Pitch Deck
                </Button>
              </a>
              <a href="/TNMIPitchDeck2026.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-300 font-medium"
                >
                  View Online
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Connect With Our Investor Relations Team</h2>
          <p className="text-slate-300 text-lg mb-8">
            For inquiries about investment opportunities, please contact us.
          </p>
          <a href="mailto:tobias@truenorthmaterials.com" className="inline-block">
            <Button
              size="lg"
              className="bg-emerald-400 text-black hover:bg-emerald-500 transition-all duration-300 font-medium"
            >
              Get in Touch
            </Button>
          </a>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-sm text-slate-400 border-t border-white/10">
        <p className="tracking-widest text-emerald-300 font-light mb-2">TRUENORTH MATERIAL INNOVATIONS</p>
        <p>© {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.</p>
      </footer>
    </div>
  )
}
