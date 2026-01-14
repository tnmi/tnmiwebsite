"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const partners = [
  {
    name: "VentureLab",
    logo: "/VLlogo.png",
    url: "https://www.venturelab.ca/",
    width: 200,
    height: 80
  }
  // Add more partners here as needed
]

export default function PartnersSection() {
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
            Our
            <span className="text-emerald-400"> Partners</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Collaborating with industry leaders to transform materials innovation.
          </p>
        </motion.div>

        {/* Partners Carousel */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          >
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex justify-center items-center"
              >
                <Link href={partner.url} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] p-8 h-full shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/30 transition-all duration-300 hover:border-emerald-400/50 flex items-center justify-center cursor-pointer"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
