"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useIsMobile } from './use-mobile'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  
  // Initialize state based on mobile and localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true // Default to closed on SSR
    
    // On mobile, always start closed (hidden)
    if (window.innerWidth < 768) {
      return true
    }
    
    // On desktop, check localStorage first
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      return JSON.parse(savedState)
    }
    
    // Default to open on desktop
    return false
  })
  
  // Note: Removed auto-collapse effect to allow mobile sidebar to stay open when user explicitly opens it
  
  // Persist state to localStorage only on desktop
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed, isMobile])

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}