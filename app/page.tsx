"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Linkedin, Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import BackgroundVideo from "@/components/background-video"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"

const SectionLoading = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
    <p className="text-white ml-4">Loading Section...</p>
  </div>
)

const PlatformSection = dynamic(() => import("@/components/sections/platform-section"), { loading: () => <SectionLoading />, ssr: false })
const ProblemSection = dynamic(() => import("@/components/sections/problem-section"), { loading: () => <SectionLoading />, ssr: false })
const TechnologySection = dynamic(() => import("@/components/sections/technology-section"), { loading: () => <SectionLoading />, ssr: false })
const HowWeHelpSection = dynamic(() => import("@/components/sections/how-we-help-section"), { loading: () => <SectionLoading />, ssr: false })
const CanadaFocusSection = dynamic(() => import("@/components/sections/canada-focus-section"), { loading: () => <SectionLoading />, ssr: false })
const DecisionMakingSection = dynamic(() => import("@/components/sections/decision-making-section"), { loading: () => <SectionLoading />, ssr: false })
const PartnershipsSection = dynamic(() => import("@/components/sections/partnerships-section"), { loading: () => <SectionLoading />, ssr: false })
const TeamSection = dynamic(() => import("@/components/sections/team-section"), { loading: () => <SectionLoading />, ssr: false })
const IcebergVisualization = dynamic(() => import("@/components/sections/iceberg-section"), { loading: () => <SectionLoading />, ssr: false })
const Diagram = dynamic(() => import("@/components/diagram"), { loading: () => <SectionLoading />, ssr: false })
const ServicesSection = dynamic(() => import("@/components/services"), { loading: () => <SectionLoading />, ssr: false })

export default function TrueNorthWebsite() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  return (
    <div ref={containerRef} className="relative font-['Satoshi',sans-serif] bg-[#0f172a]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-md"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
            <Image src="/logo.png" alt="TrueNorth Logo" width={32} height={32} className="invert" />
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">TrueNorth</span>
          </motion.div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            {["platform", "technology", "how-we-help", "canada", "partnerships", "team", "contact"].map((section, idx) => (
              <motion.a
                key={idx}
                whileHover={{ y: -2, color: "#10b981" }}
                href={`#${section}`}
                className="transition-colors hover:text-emerald-400"
              >
                {section.replace(/-/g, " ").replace(/^./, str => str.toUpperCase())}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 w-full h-full">
          <div className="relative w-full h-full">
            <BackgroundVideo
              videoUrl="/Vid9.mp4"
              fallbackImageUrl="/placeholder.svg"
              overlayColor="from-black/80 via-slate-900/70 to-emerald-800/70"
              pingPong
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-center z-10 max-w-4xl mx-auto px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-5xl md:text-7xl font-semibold bg-gradient-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent tracking-tight mb-6"
          >
            The World’s First
            <span className="text-emerald-400 block">Materials Lifecycle Intelligence Platform</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-8"
          >
            True North Material Innovations is an AI-driven intelligence company dedicated to making the Canadian critical minerals value chain more efficient, sustainable, and secure.
          </motion.p>
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 3 }}
  className="flex flex-col sm:flex-row gap-4 justify-center"
>
  {/* Primary Glass Button */}
  <Link href="/request-demo" passHref>
<Button
  size="lg"
  className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-300 ease-out hover:bg-white/10 hover:shadow-emerald-500/30"
>
  Request Demo
</Button>
  </Link>

  {/* Secondary Outline Glass Button */}
  <Link
    href="https://calendly.com/jasondeacon/30"
    target="_blank"
    rel="noopener noreferrer"
    passHref
  >
    <Button
      size="lg"
      variant="outline"
      className="px-8 py-4 text-emerald-400 border border-emerald-400 backdrop-blur-md bg-white/5 hover:bg-emerald-400 hover:text-black transition-all duration-300"
    >
      Learn More
    </Button>
  </Link>
</motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-6 h-6 text-emerald-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Sections */}
      {/* <ProblemSection /> */}
      <ServicesSection />
      <Diagram />
      <IcebergVisualization />
      <PartnershipsSection />
      <CanadaFocusSection />
      <TeamSection />
      <PlatformSection />
      <TechnologySection />
      <ProblemSection />
      <HowWeHelpSection />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="px-6 py-16 mt-20 text-white"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {/* Contact Info */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-emerald-500/20">
            <h4 className="text-xl font-semibold text-emerald-400 mb-4">Contact Information</h4>
            <p className="text-sm text-slate-300 mb-2 font-medium">General Inquiries</p>
            <a
              href="mailto:jason.deacon@truenorthmaterials.com"
              className="text-slate-200 hover:text-emerald-400 text-sm break-all"
            >
              jason.deacon@truenorthmaterials.com
            </a>
          </div>

          {/* Social Links */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-emerald-500/20">
            <h4 className="text-xl font-semibold text-emerald-400 mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/truenorth-material-innovations"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-emerald-500/30 backdrop-blur-xl border border-white/10 p-2 rounded-full transition shadow text-white/90"
              >
                <Linkedin className="w-5 h-5 text-emerald-400" />
              </a>
              <a
                href="mailto:jason.deacon@truenorthmaterials.com"
                className="bg-white/10 hover:bg-emerald-500/30 backdrop-blur-xl border border-white/10 p-2 rounded-full transition shadow text-white/90"
              >
                <Mail className="w-5 h-5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-slate-400 pt-6">
          <p className="tracking-widest text-emerald-300 font-light">TRUENORTH MATERIAL INNOVATIONS</p>
          <p className="mt-2">© {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  )
}