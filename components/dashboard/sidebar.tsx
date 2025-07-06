"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, FileText, Settings, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Partnership Matching", href: "/dashboard/partnership-matching", icon: Users },
  { name: "Compliance Reporting", href: "/dashboard/compliance-reporting", icon: FileText },
]

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-tn-dark-bg text-tn-text-light border-r border-gray-700">
      <div className="flex items-center h-16 px-4 border-b border-gray-700">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="TrueNorth Logo" width={32} height={32} className="invert mr-3" />
          <h1 className="text-xl font-semibold text-tn-primary-green">TrueNorth AI</h1>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
              pathname === item.href ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300",
            )}
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-2 py-4 space-y-1 border-t border-gray-700">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Access</p>
        <Link
          href="/"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green text-gray-300"
        >
          <Home className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
          Main Website
        </Link>
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">AI Core Development</p>
        <p className="px-2 text-xs text-gray-500">
          We partner with you to build custom AI Cores tailored to your industry needs.
        </p>
        {secondaryNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-tn-deep-blue hover:text-tn-accent-green",
              pathname === item.href ? "bg-tn-deep-blue text-tn-primary-green" : "text-gray-300",
            )}
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
