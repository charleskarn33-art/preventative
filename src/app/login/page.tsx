"use client"

import { useState } from "react"
import { Activity, Eye, EyeOff, Zap, Shield, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    // Hard redirect so the session cookie is sent with the first proxied request
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 text-white">
        <div className="flex items-center gap-3 mb-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold">IPT PowerTech</p>
            <p className="text-xs text-red-400">Preventive Maintenance Platform</p>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Telecom Tower PM<br />
            <span className="text-red-400">Made Effortless</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Enterprise-grade preventive maintenance management for tower operations teams.
          </p>

          <div className="space-y-4">
            {[
              { icon: Zap, title: "Automated PM Scheduling", desc: "Daily, weekly & monthly PM auto-generated" },
              { icon: Shield, title: "Digital PM Checklists", desc: "Generator, DC, Battery, Solar & RMS checklists" },
              { icon: BarChart3, title: "Compliance Tracking", desc: "Real-time PM compliance dashboards & reports" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/30">
                  <Icon className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-8">
          &copy; 2024 IPT PowerTech. Enterprise Telecom Maintenance Platform.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">IPT PowerTech</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@iptpowertech.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <a href="mailto:admin@iptpowertech.com" className="text-blue-600 hover:underline">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
