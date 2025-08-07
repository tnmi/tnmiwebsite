"use client"

import { Bell, Search, UserCircle, ChevronDown, LogOut, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n"
import Link from "next/link"
import { useSidebar } from "@/hooks/use-sidebar"

export default function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar()
  const displayName = user?.displayName || user?.email || "User"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      {/* Mobile menu button */}
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-4 md:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <UserCircle className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">{t('billing')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">{t('settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-pink-600">
              <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Language Switcher UI */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {language === 'fr' ? 'FR' : 'EN'}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>English (EN)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('fr')}>Français (FR)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
