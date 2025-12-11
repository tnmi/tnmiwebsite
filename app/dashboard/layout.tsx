"use client"
import React from "react"
import Sidebar from "@/components/dashboard/sidebar"
import ChatbotToggle from "@/components/dashboard/chatbot/chatbot-toggle"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Mobile menu toggle component (must be inside SidebarProvider)
function MobileMenuToggle() {
  const { isMobile, setIsCollapsed } = useSidebar()
  
  if (!isMobile) return null
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
      onClick={() => setIsCollapsed(false)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loading = useAuthStore((state) => state.loading)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, loading, router, pathname])

  if (loading) {
    return null
  }
  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="font-satoshi bg-tn-light-bg flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
        </div>
        <MobileMenuToggle />
        <ChatbotToggle />
        <Toaster />
      </div>
    </SidebarProvider>
  )
}
