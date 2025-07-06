"use client"
import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import BackgroundVideo from "@/components/background-video"
import Link from "next/link"

export default function CanadaFocusSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const criticalMinerals = [
    { name: "Carbon", applications: "Batteries, Electronics, Construction, Agriculture", icon: "⚫", color: "#1f2937" },
    { name: "Lithium", applications: "Batteries, Energy Storage", icon: "⚡", color: "#3b82f6" },
    { name: "Graphite", applications: "Batteries, Electronics", icon: "🔋", color: "#10b981" },
    { name: "Nickel", applications: "Batteries, Stainless Steel", icon: "🔩", color: "#6b7280" },
    { name: "Cobalt", applications: "Batteries, Superalloys", icon: "⚙️", color: "#8b5cf6" },
    { name: "Copper", applications: "Electronics, Infrastructure", icon: "🔌", color: "#f59e0b" },
    { name: "Rare Earth Elements", applications: "Electronics, Defense", icon: "🔬", color: "#ef4444" },
    { name: "Natural Hydrogen", applications: "Clean Energy, Hard-to-Abate Industries", icon: "💨", color: "#06b6d4" },
  ]

  const hardToAbateIndustries = [
    { name: "Steel Production", impact: "28% of industrial emissions", icon: "🏭" },
    { name: "Cement Manufacturing", impact: "8% of global CO2", icon: "🏗️" },
    { name: "Chemical Processing", impact: "High energy intensity", icon: "⚗️" },
    { name: "Aviation", impact: "2.5% of global emissions", icon: "✈️" },
    { name: "Shipping", impact: "3% of global emissions", icon: "🚢" },
    { name: "Heavy Manufacturing", impact: "Energy-intensive processes", icon: "🔧" },
  ]

  const [mineralIndex, setMineralIndex] = useState(0)
  const [industryIndex, setIndustryIndex] = useState(0)

  useEffect(() => {
    const mineralInterval = setInterval(() => {
      setMineralIndex((prev) => (prev + 1) % criticalMinerals.length)
    }, 1500)

    const timeout = setTimeout(() => {
      const industryInterval = setInterval(() => {
        setIndustryIndex((prev) => (prev + 1) % hardToAbateIndustries.length)
      }, 1500)
      // Store it in a ref if needed for cleanup
      // Alternatively, attach cleanup here:
      return () => clearInterval(industryInterval)
    }, 750)

    return () => {
      clearInterval(mineralInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section id="canada" ref={ref} className="relative z-10 min-h-screen overflow-hidden">
      <BackgroundVideo
        videoUrl="/Vid2.mp4"
        fallbackImageUrl="/placeholder.svg"
        overlayColor="from-slate-900/70 via-slate-800/60 to-slate-900/70"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-12">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-red-400 leading-tight tracking-tight min-h-[calc(5rem+2vh)]">
            The Future of Materials Starts in Canada
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Discover how Canada’s mineral wealth and AI innovation converge to unlock cleaner, smarter industries.
          </p>
        </motion.div>

        {/* Intro Glass Box CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4"
        >
          <p className="text-slate-200 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Canada’s $3.8B Critical Minerals Strategy positions it as a leader in the global green energy race. At TrueNorth, our AI Cores help unlock this potential with smarter extraction, cleaner processing, and faster innovation cycles.
          </p>
        </motion.div>

        {/* Critical Minerals Carousel */}
        <div className="space-y-4">
          <h3 className="text-2xl sm:text-3xl font-semibold text-white text-center">Critical Minerals</h3>
          <div className="relative w-full flex justify-center">
            <motion.div
              key={criticalMinerals[mineralIndex].name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="min-w-[220px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center space-y-2 shadow-lg"
            >
              <div className="text-3xl">{criticalMinerals[mineralIndex].icon}</div>
              <div className="text-white font-semibold">{criticalMinerals[mineralIndex].name}</div>
              <div className="text-slate-400 text-xs">{criticalMinerals[mineralIndex].applications}</div>
            </motion.div>
          </div>
        </div>

        {/* Hard-to-Abate Industries Carousel */}
        <div className="space-y-4">
          <h3 className="text-2xl sm:text-3xl font-semibold text-white text-center">Hard-to-Abate Industries</h3>
          <div className="relative w-full flex justify-center">
            <motion.div
              key={hardToAbateIndustries[industryIndex].name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="min-w-[220px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center space-y-2 shadow-lg"
            >
              <div className="text-3xl">{hardToAbateIndustries[industryIndex].icon}</div>
              <div className="text-white font-semibold">{hardToAbateIndustries[industryIndex].name}</div>
              <div className="text-slate-400 text-xs">{hardToAbateIndustries[industryIndex].impact}</div>
            </motion.div>
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <Button
              size="lg"
              className="bg-white/5 text-white border border-red-400/20 backdrop-blur-md hover:bg-white/10 px-6 py-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="https://www.canada.ca/en/campaign/critical-minerals-in-canada/critical-minerals-an-opportunity-for-canada.html" target="_blank" rel="noopener noreferrer">
                Learn more about Canada's Critical Minerals
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white/10 text-white px-6 py-4 rounded-xl shadow border border-white/10 hover:bg-white/20 transition-all hover:shadow-lg"
              asChild
            >
              <Link href="/canadian-partnerships">
                Explore Canadian Partnerships
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}