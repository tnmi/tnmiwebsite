"use client"
import { useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"

const HexGridBackground = dynamic(() => import("../visuals/hex-grid-background"), { ssr: false })

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null)

  const teamMembers = [
    {
      name: "Jason Deacon",
      role: "Co-Founder",
      image: "/images/jason.jpg",
      linkedin: "https://www.linkedin.com/in/jason-deacon/",
      bio: "Ph.D. in Materials Science (graphene technology) from the University of Cambridge with 7+ years experience in advanced materials research and commercialization.",
    },
    {
      name: "Kejvi Peti",
      role: "Co-Founder",
      image: "/images/kejvi.jpeg",
      linkedin: "https://www.linkedin.com/in/kejvipeti/",
      bio: "MSc in AI for Materials Design, with 7+ years of experience as a Senior Software engineer at the intersection of machine learning, product engineering, and sustainability.",
    },
  ]

  return (
    <section
      id="team"
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0f1c] via-[#0d1324] to-[#0a0f1c] text-white"
    >
      <div className="absolute inset-0 z-0">
        <HexGridBackground scrollSync />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-40 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-300 leading-tight tracking-tight py-6 sm:py-10 md:py-14">
            Meet the Architects of Intelligence
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Guided by an AI-powered vision, our team blends science, design, and code into real-world breakthroughs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              viewport={{ once: true }}
              className="relative rounded-3xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl hover:shadow-emerald-400/20 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-44 h-44 relative flex items-center justify-center">
                  <div
                    className="absolute w-full h-full backdrop-blur-xl shadow-inner"
                    style={{
                      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                    }}
                  />
                  <div className="w-40 h-40 relative z-10 overflow-hidden" style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                  }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold tracking-tight">{member.name}</h3>
                  <p className="text-sm text-slate-400">{member.role}</p>
                </div>
                <p className="text-sm text-slate-300 leading-snug">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  ↗ LinkedIn
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl shadow-lg" asChild>
            <Link href="https://calendly.com/jasondeacon/30">
              Join the Vision →
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
