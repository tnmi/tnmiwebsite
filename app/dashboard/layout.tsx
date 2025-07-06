import type React from "react"
import { Inter } from "next/font/google"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import ChatbotToggle from "@/components/dashboard/chatbot/chatbot-toggle"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-tn-light-bg flex h-screen overflow-hidden`}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-tn-light-bg p-6">{children}</main>
        </div>
        <ChatbotToggle />
        <Toaster />
      </body>
    </html>
  )
}
