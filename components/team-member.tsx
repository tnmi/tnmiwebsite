"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"
import Image from "next/image"

interface TeamMemberProps {
  name: string
  role: string
  image: string
  linkedin: string
  bio: string
}

export default function TeamMember({ name, role, image, linkedin, bio }: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Function to create hexagon clip path
  const hexagonClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"

  return (
    <div className="relative w-48 h-56">
      <motion.div
        className="absolute inset-0 flex flex-col items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Hexagon background with gradient border */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-md"
          style={{ clipPath: hexagonClipPath }}
        ></div>

        {/* Inner hexagon with image */}
        <div className="absolute inset-1 bg-white rounded-md overflow-hidden" style={{ clipPath: hexagonClipPath }}>
          <Image src={image || "/placeholder.svg"} alt={name} layout="fill" objectFit="cover" />

          {/* Overlay that appears on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-emerald-900/80 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-xs text-center line-clamp-5">{bio}</p>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </motion.div>
        </div>

        {/* Name and role below hexagon */}
        <div className="absolute -bottom-16 w-full text-center">
          <h4 className="font-semibold text-slate-900">{name}</h4>
          <p className="text-sm text-slate-600">{role}</p>
        </div>
      </motion.div>
    </div>
  )
}
