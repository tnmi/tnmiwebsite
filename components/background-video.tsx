"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface BackgroundVideoProps {
  videoUrl: string
  fallbackImageUrl: string
  overlayColor?: string
  pingPong?: boolean
}

export default function BackgroundVideo({
  videoUrl,
  fallbackImageUrl,
  overlayColor = "from-black/50 to-black/50",
  pingPong = false,
}: BackgroundVideoProps) {
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const directionRef = useRef(1)
  const animationFrameId = useRef<number | null>(null)

  const animate = useCallback(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    if (video.duration === Infinity || isNaN(video.duration)) {
      animationFrameId.current = requestAnimationFrame(animate)
      return
    }

    if (directionRef.current === 1 && video.currentTime >= video.duration) {
      directionRef.current = -1
    } else if (directionRef.current === -1 && video.currentTime <= 0) {
      directionRef.current = 1
    }

    video.currentTime += directionRef.current * 0.03 // Adjust speed as needed

    animationFrameId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (pingPong && isClient && videoRef.current) {
      const video = videoRef.current
      video.pause()
      animationFrameId.current = requestAnimationFrame(animate)
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
      }
    }
  }, [pingPong, isClient, animate])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={fallbackImageUrl}
          alt="Fallback"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isClient ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          autoPlay={!pingPong}
          muted
          loop={!pingPong}
          playsInline
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
            isClient ? "opacity-100" : "opacity-0"
          }`}
          poster={fallbackImageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayColor}`} />
    </div>
  )
}
