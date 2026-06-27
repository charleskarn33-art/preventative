"use client"

import { useEffect, useState } from "react"
import { TopNav } from "./top-nav"
import { supabase } from "@/lib/supabase"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login"
      } else {
        setChecking(false)
      }
    })
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
