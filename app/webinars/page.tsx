"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"
import BackgroundVideo from "@/components/background-video"

interface WebinarVideo {
  id: string
  title: string
  description: string
  date: string
}

interface WebinarSection {
  sectionTitle: string
  videos: WebinarVideo[]
}

const webinarSections: WebinarSection[] = [
  {
    sectionTitle: "Latest Webinars",
    videos: [
      {
        id: "wwfM_s66bWM",
        title: "Solving the Climate Materials Bottleneck 2026",
        description: "In this webinar, we highlight the import steps for climate-positive materials and climate tech companies in order to accelerate that commercialization. ",
        date: "January 2026"
      },
      {
        id: "TviBA59K_MA",
        title: "Company Video",
        description: "Get to know Tobias and KV",
        date: "January 2026"
      }
    ]
  },
  {
    sectionTitle: "Platform Insights",
    videos: [
      {
        id: "VtQzdPkIDRk",
        title: "Demonstration of Market Agent",
        description: "True North Material Innovations (TNMI) highlights the market agent of the platform.",
        date: "December 2025"
      },
    //   {
    //     id: "dQw4w9WgXcQ",
    //     title: "Investment Opportunities in Materials Tech",
    //     description: "An investor-focused webinar on the growing opportunities in advanced materials technology and sustainable manufacturing.",
    //     date: "December 2025"
    //   }
    ]
  },
//   {
//     sectionTitle: "Research & Development",
//     videos: [
//       {
//         id: "dQw4w9WgXcQ",
//         title: "Innovation in Material Science",
//         description: "Join leading researchers as they discuss cutting-edge developments in material science and their real-world applications.",
//         date: "November 2025"
//       },
//       {
//         id: "dQw4w9WgXcQ",
//         title: "Sustainability in Advanced Materials",
//         description: "Exploring sustainable practices in the production and use of advanced materials for a better tomorrow.",
//         date: "November 2025"
//       }
//     ]
//   }
 ]

export default function WebinarsPage() {
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
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center z-10 max-w-4xl mx-auto px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-5xl md:text-7xl font-semibold bg-gradient-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent tracking-tight mb-6"
          >
            Webinars &
            <span className="text-emerald-400 block">Expert Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Learn from industry leaders and expand your knowledge of advanced materials
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Webinars Sections */}
      {webinarSections.map((section, sectionIdx) => (
        <section key={sectionIdx} className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-emerald-400 mb-12 text-center"
            >
              {section.sectionTitle}
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {section.videos.map((video, videoIdx) => (
                <motion.div
                  key={videoIdx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: videoIdx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-[14px] border border-white/20 rounded-[2rem] overflow-hidden shadow-[inset_0_0_0.25rem_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-emerald-500/20 transition-all duration-300"
                >
                  {/* Video Thumbnail */}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6"
                  >
                    <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden group">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-emerald-400 rounded-full p-4 group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                          <Play className="w-6 h-6 text-black fill-black" />
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Play className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {video.title}
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm mb-4">
                      {video.description}
                    </p>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-emerald-300 font-medium">
                        📅 {video.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-sm text-slate-400 border-t border-white/10">
        <p className="tracking-widest text-emerald-300 font-light mb-2">TRUENORTH MATERIAL INNOVATIONS</p>
        <p>© {new Date().getFullYear()} TrueNorth Material Innovations. All rights reserved.</p>
      </footer>
    </div>
  )
}
