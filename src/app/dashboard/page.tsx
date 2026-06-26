"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface KPI { label: string; value: number | string; icon: React.ElementType; iconColor: string }
interface RegionBar { region: string; count: number }
interface CountyRow { name: string; completed: number; total: number }
interface ActivityRow { site: string; date: string; status: string }

const statusBadge: Record<string, { label: string; className: string }> = {
  completed:        { label: "Completed",  className: "bg-green-100 text-green-700 border-green-200" },
  open:             { label: "Open",       className: "bg-gray-100 text-gray-600 border-gray-200" },
  in_progress:      { label: "In Progress",className: "bg-amber-100 text-amber-700 border-amber-200" },
  overdue:          { label: "Overdue",    className: "bg-red-100 text-red-700 border-red-200" },
  pending_approval: { label: "Pending",    className: "bg-blue-100 text-blue-700 border-blue-200" },
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Charles J. Karn")
  const [kpis, setKpis] = useState<KPI[]>([
    { label: "TOTAL PM",       value: "—", icon: ClipboardList, iconColor: "text-slate-400" },
    { label: "COMPLETED",      value: "—", icon: CheckCircle2,  iconColor: "text-green-500" },
    { label: "IN PROGRESS",    value: "—", icon: Clock,         iconColor: "text-amber-500" },
    { label: "OVERDUE",        value: "—", icon: AlertCircle,   iconColor: "text-red-500" },
  ])
  const [countyData, setCountyData] = useState<CountyRow[]>([])
  const [regionChart, setRegionChart] = useState<RegionBar[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityRow[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        // Current user name
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single()
          if (profile?.full_name) setUserName(profile.full_name)
        }

        // Work orders stats
        const { data: orders } = await supabase
          .from("work_orders")
          .select("id, status, due_date, site_id, tower_sites(site_name, region, county)")

        if (orders && orders.length > 0) {
          const total = orders.length
          const completed = orders.filter(o => o.status === "completed").length
          const inProgress = orders.filter(o => o.status === "in_progress" || o.status === "assigned").length
          const overdue = orders.filter(o => o.status === "overdue").length

          setKpis([
            { label: "TOTAL PM",    value: total,      icon: ClipboardList, iconColor: "text-slate-400" },
            { label: "COMPLETED",   value: completed,  icon: CheckCircle2,  iconColor: "text-green-500" },
            { label: "IN PROGRESS", value: inProgress, icon: Clock,         iconColor: "text-amber-500" },
            { label: "OVERDUE",     value: overdue,    icon: AlertCircle,   iconColor: "text-red-500" },
          ])

          // County progress (group by county/region)
          const countyMap: Record<string, { completed: number; total: number }> = {}
          orders.forEach(o => {
            const site = o.tower_sites as { site_name: string; region: string; county: string } | null
            const county = site?.county || site?.region || "Unknown"
            if (!countyMap[county]) countyMap[county] = { completed: 0, total: 0 }
            countyMap[county].total++
            if (o.status === "completed") countyMap[county].completed++
          })
          setCountyData(
            Object.entries(countyMap)
              .map(([name, v]) => ({ name, ...v }))
              .sort((a, b) => b.total - a.total)
              .slice(0, 12)
          )

          // Region bar chart
          const regionMap: Record<string, number> = {}
          orders.forEach(o => {
            const site = o.tower_sites as { region: string } | null
            const region = site?.region || "Unknown"
            regionMap[region] = (regionMap[region] || 0) + 1
          })
          setRegionChart(
            Object.entries(regionMap)
              .map(([region, count]) => ({ region, count }))
              .sort((a, b) => b.count - a.count)
          )

          // Recent activity (last 8)
          const recent = [...orders]
            .sort((a, b) => (b.due_date > a.due_date ? 1 : -1))
            .slice(0, 8)
            .map(o => {
              const site = o.tower_sites as { site_name: string } | null
              return {
                site: site?.site_name || "Unknown Site",
                date: o.due_date,
                status: o.status,
              }
            })
          setRecentActivity(recent)
        }
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">IPT PowerTech — Preventive Maintenance</p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 gap-2 shadow-sm">
            <Link href="/checklists/new">
              <Plus className="h-4 w-4" /> New PM
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon, iconColor }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className={`text-4xl font-bold text-gray-900 mt-1 ${loading ? "animate-pulse text-gray-200" : ""}`}>
                    {value}
                  </p>
                </div>
                <Icon className={`h-6 w-6 mt-1 ${iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        {/* County progress + Recent Activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Completed PM by Region</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full animate-pulse" />
                    <div className="w-10 h-3 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : countyData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No PM records yet. Submit your first inspection.</p>
            ) : (
              <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-8">
                {countyData.map((c) => {
                  const pct = Math.round((c.completed / c.total) * 100)
                  return (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm text-gray-700 truncate">{c.name}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs text-gray-500">{c.completed}/{c.total}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                    </div>
                    <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => {
                  const st = statusBadge[item.status] ?? { label: item.status, className: "bg-gray-100 text-gray-600 border-gray-200" }
                  return (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                          <p className="text-sm font-medium text-gray-900 truncate">{item.site}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 pl-4">{item.date}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border ${st.className}`}>
                        {st.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Inspections by Region chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">PM by Region</h2>
          {loading ? (
            <div className="h-[220px] bg-gray-50 rounded-lg animate-pulse" />
          ) : regionChart.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
              No data yet — submit inspections to see region breakdown.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={regionChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} name="PM" maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
