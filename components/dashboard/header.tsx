"use client"

import { Bell, Search, UserCircle, ChevronDown, LogOut } from "lucide-react"
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
import { t, SupportedLang } from "@/lib/i18n"
import { useDashboardLangStore } from "@/lib/store"
import Link from "next/link"

export default function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const displayName = user?.displayName || user?.email || "User"

  // Language state (Zustand)
  const lang = useDashboardLangStore((state) => state.lang)
  const setLang = useDashboardLangStore((state) => state.setLang)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      {/* Remove the search platform input and icon */}
      <div />
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-pink-600">
              <LogOut className="mr-2 h-4 w-4" /> {t('logout', lang)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Language Switcher UI */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {lang === 'fr' ? 'FR' : 'EN'}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLang('en')}>English (EN)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('fr')}>Français (FR)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
