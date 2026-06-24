"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Radio,
  Calendar,
  ClipboardList,
  Users,
  BarChart3,
  Bell,
  Settings,
  Wrench,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sites", label: "Tower Sites", icon: Radio },
  { href: "/pm-schedule", label: "PM Schedule", icon: Calendar },
  { href: "/work-orders", label: "Work Orders", icon: ClipboardList },
  { href: "/checklists", label: "PM Checklists", icon: Wrench },
  { href: "/technicians", label: "Technicians", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-slate-700", collapsed && "justify-center")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Activity className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-tight">TelcoCare</p>
            <p className="text-xs text-blue-400 font-medium">PM Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* User section */}
      <div className={cn("border-t border-slate-700 p-4", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
            SA
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Super Admin</p>
              <p className="truncate text-xs text-slate-400">admin@telcocare.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
