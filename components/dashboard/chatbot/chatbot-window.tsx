"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string | React.ReactNode
  timestamp: Date
}

interface ChatbotWindowProps {
  onClose: () => void
}

export default function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I am the TrueNorth AI Assistant. How can I help you with materials science, partnerships, or compliance today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: input, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate bot response
    setTimeout(() => {
      let botResponseText: string | React.ReactNode = "I'm processing your request..."
      const lowerInput = input.toLowerCase()

      if (lowerInput.includes("strength") && lowerInput.includes("carbon nanotube")) {
        botResponseText =
          "For carbon nanotubes, tensile strength is highly dependent on defect density and chirality. Our CABAL AI Core can predict this with ~88% accuracy. Would you like to run a simulation?"
      } else if (lowerInput.includes("partnership") && lowerInput.includes("graphene")) {
        botResponseText = (
          <div>
            I found 3 potential industry partners for graphene applications:
            <ul className="list-disc list-inside mt-1 text-sm">
              <li>AeroSpace Corp. (Compatibility: 82%)</li>
              <li>ElectroDrive Systems (Compatibility: 75%)</li>
              <li>FutureMaterials Ltd. (Compatibility: 68%)</li>
            </ul>
            Would you like more details on any of these?
          </div>
        )
      } else if (lowerInput.includes("compliance") && lowerInput.includes("lithium")) {
        botResponseText =
          "For lithium, ensure you are following ISED reporting guidelines for critical minerals. The next Q2 report is due June 15th. I can help generate a draft."
      } else if (lowerInput.includes("help") || lowerInput.includes("hello") || lowerInput.includes("hi")) {
        botResponseText =
          "I can assist with: \n- Material property predictions \n- Finding partnership opportunities \n- Compliance guidance \n- Generating reports. What can I do for you?"
      } else {
        botResponseText = `I'm still learning about "${input}". Try asking about material properties, partnerships, or compliance.`
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponseText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-[400px] h-[600px] shadow-xl flex flex-col bg-white border border-gray-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/logo.png" alt="TrueNorth AI" className="invert p-1 bg-tn-primary-green rounded-full" />
            <AvatarFallback>TN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold text-tn-deep-blue">TrueNorth AI Assistant</CardTitle>
            <CardDescription className="text-xs text-tn-success-green">Online</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-3`}
            >
              {message.sender === "bot" && (
                <Avatar className="h-7 w-7 mr-2 flex-shrink-0">
                  <AvatarImage src="/logo.png" alt="Bot" className="invert p-0.5 bg-tn-primary-green rounded-full" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] p-2.5 rounded-lg shadow-sm ${message.sender === "user" ? "bg-tn-primary-blue text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
              >
                {typeof message.text === "string" ? (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                ) : (
                  message.text
                )}
                <p
                  className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"} text-opacity-80`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-7 w-7 ml-2 flex-shrink-0">
                  <AvatarFallback className="bg-gray-300 text-gray-700">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <Avatar className="h-7 w-7 mr-2 flex-shrink-0">
                <AvatarImage src="/logo.png" alt="Bot" className="invert p-0.5 bg-tn-primary-green rounded-full" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="max-w-[75%] p-2.5 rounded-lg shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin text-tn-primary-green" />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask about materials, partnerships..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="bg-tn-primary-green hover:bg-tn-accent-green"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
