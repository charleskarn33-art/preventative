"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Activity, LogOut, Bell, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pm-schedule", label: "PM" },
  { href: "/sites", label: "Sites" },
  { href: "/work-orders", label: "Work Orders" },
  { href: "/checklists", label: "Checklists" },
  { href: "/reports", label: "Reports" },
]

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
    } catch {}
    router.push("/login")
  }

  return (
    <header className="flex h-14 items-center bg-slate-900 px-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">IPT PowerTech</p>
          <p className="text-[10px] text-slate-400 leading-tight">Preventive Maintenance</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-white">Charles J. Karn</span>
        <button
          onClick={handleSignOut}
          className="text-slate-400 hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
