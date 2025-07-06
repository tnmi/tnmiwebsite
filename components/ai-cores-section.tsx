"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Atom, Zap, Cpu, Database, Search, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SubcoreAnimations from "@/components/subcore-animations"
import Link from "next/link"

interface AICore {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  partnershipStatus: "Available" | "In Development" | "Partnership Ready"
  subcores: {
    name: string
    description: string
    applications: string[]
  }[]
}

const aiCores: AICore[] = [
  {
    id: "cabal",
    name: "CABAL",
    description:
      "Carbon Analysis & Battery Applications Lab - Specialized AI for carbon materials and battery technology",
    icon: Atom,
    color: "emerald",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "GrapheneCore",
        description: "Advanced graphene property prediction and optimization",
        applications: ["Electronics", "Energy Storage", "Composites"],
      },
      {
        name: "BatteryCore",
        description: "Battery performance modeling and lifecycle prediction",
        applications: ["EV Batteries", "Grid Storage", "Consumer Electronics"],
      },
      {
        name: "CarbonCore",
        description: "Carbon nanotube and fiber analysis",
        applications: ["Aerospace", "Automotive", "Construction"],
      },
    ],
  },
  {
    id: "labal",
    name: "LABAL",
    description: "Lithium Analysis & Battery Applications Lab - AI-driven lithium processing and battery optimization",
    icon: Zap,
    color: "blue",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "LithiumCore",
        description: "Lithium extraction and processing optimization",
        applications: ["Mining", "Refining", "Recycling"],
      },
      {
        name: "ElectrolyteCore",
        description: "Electrolyte composition and performance prediction",
        applications: ["Solid-State Batteries", "Liquid Electrolytes", "Safety Systems"],
      },
      {
        name: "CathodeCore",
        description: "Cathode material design and optimization",
        applications: ["High-Energy Density", "Fast Charging", "Long Cycle Life"],
      },
    ],
  },
  {
    id: "nabal",
    name: "NABAL",
    description: "Nickel Analysis & Battery Applications Lab - Nickel-focused AI for sustainable battery solutions",
    icon: Cpu,
    color: "purple",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "NickelCore",
        description: "Nickel processing and alloy optimization",
        applications: ["Stainless Steel", "Superalloys", "Battery Materials"],
      },
      {
        name: "AlloyCore",
        description: "Advanced nickel alloy design and testing",
        applications: ["Aerospace", "Marine", "Chemical Processing"],
      },
      {
        name: "SustainabilityCore",
        description: "Sustainable nickel extraction and recycling",
        applications: ["Green Mining", "Circular Economy", "Waste Reduction"],
      },
    ],
  },
  {
    id: "habal",
    name: "HABAL",
    description: "Hydrogen Analysis & Battery Applications Lab - Natural hydrogen detection and utilization AI",
    icon: Database,
    color: "cyan",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "HydrogenCore",
        description: "Natural hydrogen detection and assessment",
        applications: ["Geological Surveys", "Resource Mapping", "Extraction Planning"],
      },
      {
        name: "FuelCellCore",
        description: "Hydrogen fuel cell optimization",
        applications: ["Transportation", "Stationary Power", "Industrial Applications"],
      },
      {
        name: "StorageCore",
        description: "Hydrogen storage and transport solutions",
        applications: ["Compressed Gas", "Liquid Hydrogen", "Metal Hydrides"],
      },
    ],
  },
  {
    id: "sbal",
    name: "SBAL",
    description: "Sustainable Building Applications Lab - AI for green construction materials and methods",
    icon: Search,
    color: "green",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "ConcreteCore",
        description: "Sustainable concrete formulation and testing",
        applications: ["Low-Carbon Concrete", "Recycled Aggregates", "Bio-based Additives"],
      },
      {
        name: "InsulationCore",
        description: "Advanced insulation material design",
        applications: ["Thermal Performance", "Fire Resistance", "Moisture Control"],
      },
      {
        name: "StructuralCore",
        description: "Structural material optimization",
        applications: ["Steel Alternatives", "Composite Materials", "Modular Construction"],
      },
    ],
  },
  {
    id: "pmal",
    name: "PMAL",
    description: "Predictive Maintenance Applications Lab - IoT and AI-driven predictive maintenance solutions",
    icon: Brain,
    color: "orange",
    partnershipStatus: "Partnership Ready",
    subcores: [
      {
        name: "SensorCore",
        description: "Advanced sensor data analysis and interpretation",
        applications: ["Vibration Analysis", "Temperature Monitoring", "Acoustic Detection"],
      },
      {
        name: "PredictiveCore",
        description: "Machine learning for failure prediction",
        applications: ["Equipment Lifecycle", "Maintenance Scheduling", "Cost Optimization"],
      },
      {
        name: "IoTCore",
        description: "IoT integration and data management",
        applications: ["Real-time Monitoring", "Edge Computing", "Cloud Analytics"],
      },
    ],
  },
]

interface AICoresSectionProps {
  isInView: boolean
}

export default function AICoresSection({ isInView }: { isInView: boolean }) {
  const [expandedCore, setExpandedCore] = useState<string | null>(null)

  return (
    <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto text-white overflow-hidden">
      {/* Glassmorphic frosted background overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl pointer-events-none z-0 border border-white/10 shadow-inner" />

      {/* Optionally dim or remove the particle blur background for clarity */}
      <div className="absolute -top-40 -left-40 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-10 blur-3xl pointer-events-none z-0" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative text-center mb-24 z-10"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 mb-10 px-6 sm:px-12 pt-12 pb-16">
          Modular Intelligence for the Materials Age
        </h2>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
          Each AI Core is a deployable module trained on scientific data and sensor networks—co-developed with your R&D team to drive breakthroughs from lab to market.
        </p>
      </motion.div>

      {/* AI Core Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {aiCores.map((core, i) => (
          <motion.div
            key={core.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="relative rounded-3xl p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-emerald-500/30 transition-all cursor-pointer"
            onClick={() => setExpandedCore(expandedCore === core.id ? null : core.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <core.icon className="w-6 h-6 text-white/80" />
              </div>
              <motion.div animate={{ rotate: expandedCore === core.id ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-slate-300" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight mb-2">{core.name}</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed font-light">{core.description}</p>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                {core.partnershipStatus}
              </span>
              <span>{core.subcores.length} Sub-cores</span>
            </div>

            <AnimatePresence>
              {expandedCore === core.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-white/10 pt-4 space-y-4"
                >
                  {core.subcores.map((sc, idx) => (
                    <div key={idx} className="bg-white/10 p-3 rounded-xl">
                      <h4 className="text-white text-sm font-semibold mb-1">{sc.name}</h4>
                      <p className="text-slate-300 text-xs mb-2">{sc.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {sc.applications.map((app, j) => (
                          <span key={j} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>



      {/* CTA Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 mt-28 max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-3xl text-center shadow-lg"
      >
        <h4 className="text-2xl font-semibold mb-4">Co-develop a Core. Define the Future.</h4>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Work with us to train your own intelligent core for niche material, energy, or infrastructure challenges.
        </p>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg" asChild>
          <Link href="https://calendly.com/jasondeacon/30" target="_blank" rel="noopener noreferrer">
            🤝 Start a Core Partnership
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}