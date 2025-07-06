"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import BackgroundVideo from "@/components/background-video"
import Image from "next/image"

export default function PlatformSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="platform"
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-black/90 text-white font-sans"
    >
      <BackgroundVideo
        videoUrl="/Vid4.mp4"
        fallbackImageUrl="/placeholder.svg"
        overlayColor="from-black/80 via-slate-900/80 to-black/80"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        {/* Platform Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight mb-6">
            Beyond the Lab, Into the World
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            True North builds AI Cores designed to carry high-potential materials through the Valley of Death and into real-world adoption.   
          </p>
        </motion.div>

        {/* AI Core Offerings */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10"
        >
          <h3 className="text-3xl font-semibold text-center text-white mb-12">
            What Makes an AI Core?
          </h3>
          <div className="grid lg:grid-cols-2 gap-16 text-slate-300">
            <div className="space-y-6">
              <h4 className="text-xl text-white font-medium">AI Intelligence Suite</h4>
              <ul className="space-y-4">
                {[
                  "Predict physical, chemical, and commercial behavior of materials",
                  "Auto-match to viable commercial partners and sectors",
                  "Detect and map unmet market needs",
                  "Simulate GTM paths and policy alignment",
                  "Visualize performance benchmarks and ESG impact",
                  "Securely protect IP and material provenance",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-light">
                    <div className="w-2 h-2 mt-2 bg-emerald-400 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-xl text-white font-medium mb-2">Physical-Lab Integration</h4>
                <p className="text-sm font-light leading-relaxed">
                  AI insights are verified by labs through digital twins, nano-level scans, and field trials — ensuring deployment confidence.
                </p>
              </div>
              <div>
                <h4 className="text-xl text-white font-medium mb-2">Persistent Feedback Loops</h4>
                <p className="text-sm font-light leading-relaxed">
                  Cores learn over time — ingesting new research, performance logs, and sensor feedback to evolve in real time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Story Through Media + Frameworks */}
        <div className="grid md:grid-cols-2 gap-16 mt-28">
          {/* CABAL Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6"
          >
            <h3 className="text-3xl font-semibold text-white text-center mb-6">
              CABAL: The Carbon Core
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden relative group hover:shadow-xl">
              <a
                href="https://jasondeacon204.wistia.com/medias/i2z4ni8utr?wvideo=i2z4ni8utr"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <Image
                  src="https://embed-ssl.wistia.com/deliveries/2aa43b4796a2a7576fb152ed5680bcddd373edf4.jpg?image_play_button_size=2x&image_crop_resized=960x540&image_play_button_rounded=1&image_play_button_color=3526DAe0"
                  alt="CABAL Demo"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            </div>
            <p className="text-sm text-slate-400 mt-3 text-center">
              Real-time signal extraction from carbon-based data libraries and materials.
            </p>
          </motion.div>

          {/* Framework Index */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 space-y-6"
          >
            <h3 className="text-3xl font-semibold text-white text-center mb-6">
              Modular AI Core Frameworks
            </h3>
            {[
              "CABAL – Carbon/graphene innovation",
              "LABAL – Lithium & battery validation",
              "NABAL – Nickel use in energy systems",
              "HABAL – Hydrogen mapping & optimization",
              "SBAL – Sustainable construction composites",
              "PMAL – Predictive maintenance via IoT",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <p className="text-sm text-slate-200 font-light">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}