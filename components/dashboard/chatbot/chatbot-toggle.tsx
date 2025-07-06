"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BotMessageSquare, X } from "lucide-react"
import ChatbotWindow from "./chatbot-window"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-lg z-50 bg-tn-primary-green hover:bg-tn-accent-green text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
      >
        {isOpen ? <X size={28} /> : <BotMessageSquare size={28} />}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-6 z-40" // Position above the toggle button
          >
            <ChatbotWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
