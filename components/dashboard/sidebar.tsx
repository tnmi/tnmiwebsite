"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Users, FileText, Settings, LifeBuoy, Box, ChevronLeft, ChevronRight, LayoutDashboard, Package, BarChart3, UserCircle, ChevronDown, LogOut, Menu, CreditCard, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuthStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const { t, language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const displayName = user?.displayName || user?.email || "User"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navigation = [
    { name: t('overview'), href: "/dashboard", icon: Package },
    { name: "Market Insights", href: "/dashboard/market-insights", icon: BarChart3 },
  ]

  const secondaryNavigation = [
    { name: t('settings'), href: "/dashboard/settings", icon: Settings },
    { name: t('supportTitle'), href: "/dashboard/support", icon: LifeBuoy },
  ]

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col bg-gray-900 bg-tn-dark-bg text-white text-tn-text-light border-r border-gray-700 transition-all duration-300 ease-in-out shadow-lg",
        // Mobile: Fixed positioned overlay
        isMobile ? [
          "fixed inset-y-0 left-0 z-50 w-64 h-screen",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        ] : [
          // Desktop: Normal sidebar behavior
          "relative h-full",
          isCollapsed ? "w-16" : "w-64"
        ]
      )}>
        <div className="flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="TrueNorth Logo" width={32} height={32} className="invert flex-shrink-0" />
            {/* On mobile, always show full title; on desktop, hide when collapsed */}
            {(isMobile || !isCollapsed) && <h1 className="ml-3 text-xl font-semibold text-tn-primary-green">NorthStar</h1>}
          </Link>
          {/* Only show collapse button on desktop when not collapsed */}
          {!isMobile && !isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-tn-primary-green transition-colors duration-200"
              aria-label="Collapse sidebar"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Only show expand button on desktop when collapsed */}
        {!isMobile && isCollapsed && (
          <div className="flex justify-center py-3 border-b border-gray-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-tn-primary-green transition-colors duration-200"
              aria-label="Expand sidebar"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green relative",
              pathname === item.href ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300",
              !isMobile && isCollapsed ? "justify-center" : ""
            )}
            title={!isMobile && isCollapsed ? item.name : undefined}
          >
            <item.icon className={cn(
              "flex-shrink-0 h-5 w-5",
              !isMobile && isCollapsed ? "mr-0" : "mr-3"
            )} aria-hidden="true" />
            {(isMobile || !isCollapsed) && item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-2 py-4 space-y-1 border-t border-gray-700">
        {/* Show full content on mobile or when not collapsed on desktop */}
        {(isMobile || !isCollapsed) && (
          <>
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('quickAccess')}</p>
            
            {/* User Name Display */}
            <div className="px-2 py-2 text-sm font-medium text-gray-300">
              <UserCircle className="inline-block mr-2 h-5 w-5" />
              <span className="truncate">{displayName}</span>
            </div>

            {/* Billing Link */}
            <Link
              href="/dashboard/billing"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green text-gray-300"
            >
              <CreditCard className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {t('billing')}
            </Link>

            {/* Settings Link */}
            <Link
              href="/dashboard/settings"
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
                pathname === '/dashboard/settings' ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300"
              )}
            >
              <Settings className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {t('settings')}
            </Link>

            {/* Support Link */}
            <Link
              href="/dashboard/support"
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
                pathname === '/dashboard/support' ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300"
              )}
            >
              <LifeBuoy className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {t('supportTitle')}
            </Link>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green text-gray-300"
            >
              <Globe className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {language === 'fr' ? 'FR' : 'EN'}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-pink-600 text-gray-300"
            >
              <LogOut className="mr-2 h-5 w-5" />
              {t('logout')}
            </button>
          </>
        )}
        {/* Show icon-only content on desktop when collapsed */}
        {!isMobile && isCollapsed && (
          <>
            <button
              title={displayName}
              className="w-full flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 cursor-default"
            >
              <UserCircle className="h-5 w-5" />
            </button>
            <Link
              href="/dashboard/billing"
              className="group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green text-gray-300"
              title={t('billing')}
            >
              <span className="text-sm font-bold">{t('billing').charAt(0)}</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
                pathname === '/dashboard/settings' ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300"
              )}
              title={t('settings')}
            >
              <Settings className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/support"
              className={cn(
                "group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
                pathname === '/dashboard/support' ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300"
              )}
              title={t('supportTitle')}
            >
              <LifeBuoy className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="w-full flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green text-gray-300"
              title={language === 'fr' ? 'Français' : 'English'}
            >
              <span className="text-xs font-bold">{language === 'fr' ? 'FR' : 'EN'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-pink-600 text-gray-300"
              title={t('logout')}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      </div>
    </>
  )
}
