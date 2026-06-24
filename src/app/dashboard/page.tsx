"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Plus, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const kpis = [
  { label: "TOTAL PM", value: 248, icon: ClipboardList, iconColor: "text-slate-400" },
  { label: "COMPLETED", value: 186, icon: CheckCircle2, iconColor: "text-green-500" },
  { label: "IN PROGRESS", value: 28, icon: Clock, iconColor: "text-amber-500" },
  { label: "WITH FAILURES", value: 34, icon: AlertCircle, iconColor: "text-red-500" },
]

const countyData = [
  { name: "Kisumu", completed: 12, total: 12 },
  { name: "Nairobi", completed: 45, total: 48 },
  { name: "Mombasa", completed: 8, total: 10 },
  { name: "Eldoret", completed: 18, total: 22 },
  { name: "Nakuru", completed: 21, total: 28 },
  { name: "Nyeri", completed: 14, total: 15 },
  { name: "Kirinyaga", completed: 3, total: 9 },
  { name: "Homa Bay", completed: 11, total: 12 },
  { name: "Kisii", completed: 7, total: 9 },
  { name: "Machakos", completed: 16, total: 18 },
  { name: "Kajiado", completed: 5, total: 6 },
  { name: "Meru", completed: 9, total: 11 },
]

const regionChart = [
  { region: "Nairobi", count: 48 },
  { region: "Nyanza", count: 24 },
  { region: "Coast", count: 12 },
  { region: "Rift Valley", count: 38 },
  { region: "Central", count: 22 },
  { region: "Eastern", count: 16 },
  { region: "Western", count: 9 },
]

const recentActivity = [
  { site: "KSM-001 Kisumu North", date: "2026-06-21", status: "completed" },
  { site: "NRB-045 Westlands", date: "2026-06-21", status: "draft" },
  { site: "MSA-012 Mombasa CBD", date: "2026-06-22", status: "completed" },
  { site: "ELD-003 Eldoret South", date: "2026-06-22", status: "draft" },
  { site: "NKR-007 Nakuru Central", date: "2026-06-21", status: "in_progress" },
  { site: "NYR-002 Nyeri Hill", date: "2026-06-19", status: "completed" },
  { site: "KRN-018 Kirinyaga East", date: "2026-06-20", status: "completed" },
  { site: "HOM-005 Homa Bay Central", date: "2026-06-21", status: "draft" },
]

const statusBadge = {
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-200" },
  in_progress: { label: "In Progress", className: "bg-amber-100 text-amber-700 border-amber-200" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700 border-red-200" },
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Charles J. Karn</h1>
            <p className="text-sm text-gray-500 mt-0.5">TelcoCare PM — Preventive Maintenance</p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 gap-2 shadow-sm">
            <Link href="/work-orders">
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
                  <p className="text-4xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <Icon className={`h-6 w-6 mt-1 ${iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        {/* County progress + charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Completed PM by County */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Completed PM by County</h2>
            <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-8">
              {countyData.map((c) => {
                const pct = Math.round((c.completed / c.total) * 100)
                return (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm text-gray-700">{c.name}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs text-gray-500">
                      {c.completed}/{c.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const st = statusBadge[item.status as keyof typeof statusBadge]
                return (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">{item.site}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 pl-4.5">{item.date}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border ${st.className}`}>
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Inspections by Region chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Inspections by Region</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                cursor={{ fill: "#f9fafb" }}
              />
              <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} name="Inspections" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  )
}
