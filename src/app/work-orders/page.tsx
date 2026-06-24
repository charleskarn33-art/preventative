"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ClipboardList, Calendar, User, Radio, ChevronRight, Eye } from "lucide-react"

const workOrders = [
  { id: "WO-2024-001", site: "KSM-001 Kisumu North", region: "Nyanza", type: "Monthly PM", tech: "John Odhiambo", status: "pending_approval", priority: "high", due: "2024-01-15", created: "2024-01-10" },
  { id: "WO-2024-002", site: "NRB-045 Westlands", region: "Nairobi", type: "Weekly PM", tech: "Mary Wanjiku", status: "in_progress", priority: "medium", due: "2024-01-16", created: "2024-01-12" },
  { id: "WO-2024-003", site: "MSA-012 Mombasa CBD", region: "Coast", type: "Daily PM", tech: "Peter Kamau", status: "completed", priority: "low", due: "2024-01-14", created: "2024-01-14" },
  { id: "WO-2024-004", site: "ELD-003 Eldoret South", region: "Rift Valley", type: "Monthly PM", tech: "Grace Akinyi", status: "overdue", priority: "critical", due: "2024-01-10", created: "2024-01-05" },
  { id: "WO-2024-005", site: "NKR-007 Nakuru Central", region: "Rift Valley", type: "Weekly PM", tech: "David Mwangi", status: "assigned", priority: "medium", due: "2024-01-17", created: "2024-01-13" },
  { id: "WO-2024-006", site: "NYR-002 Nyeri Hill", region: "Central", type: "Daily PM", tech: "James Njoroge", status: "open", priority: "low", due: "2024-01-17", created: "2024-01-15" },
  { id: "WO-2024-007", site: "HOM-005 Homa Bay Central", region: "Nyanza", type: "Monthly PM", tech: "Alex Ochieng", status: "in_progress", priority: "high", due: "2024-01-18", created: "2024-01-14" },
  { id: "WO-2024-008", site: "KRN-018 Kirinyaga East", region: "Central", type: "Weekly PM", tech: "Susan Wahu", status: "overdue", priority: "critical", due: "2024-01-08", created: "2024-01-03" },
]

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" | "info" }> = {
  open: { label: "Open", variant: "secondary" },
  assigned: { label: "Assigned", variant: "info" },
  in_progress: { label: "In Progress", variant: "default" },
  pending_approval: { label: "Pending Approval", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "text-gray-500" },
  medium: { label: "Medium", color: "text-amber-600" },
  high: { label: "High", color: "text-orange-600" },
  critical: { label: "Critical", color: "text-red-600" },
}

export default function WorkOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = workOrders.filter((wo) => {
    const matchSearch = wo.id.toLowerCase().includes(search.toLowerCase()) || wo.site.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || wo.status === statusFilter
    const matchType = typeFilter === "all" || wo.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const statusCounts = {
    open: workOrders.filter(w => w.status === "open").length,
    in_progress: workOrders.filter(w => w.status === "in_progress").length,
    pending_approval: workOrders.filter(w => w.status === "pending_approval").length,
    overdue: workOrders.filter(w => w.status === "overdue").length,
    completed: workOrders.filter(w => w.status === "completed").length,
  }

  return (
    <AppLayout>
      <Header title="Work Orders" subtitle="Manage preventive maintenance work orders" />
      <div className="p-6 space-y-4">
        {/* Status summary */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { key: "open", label: "Open", color: "text-gray-600", bg: "bg-gray-50" },
            { key: "in_progress", label: "In Progress", color: "text-blue-600", bg: "bg-blue-50" },
            { key: "pending_approval", label: "Pending Approval", color: "text-amber-600", bg: "bg-amber-50" },
            { key: "overdue", label: "Overdue", color: "text-red-600", bg: "bg-red-50" },
            { key: "completed", label: "Completed", color: "text-green-600", bg: "bg-green-50" },
          ].map(({ key, label, color, bg }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`rounded-xl border p-4 text-left transition-all ${statusFilter === key ? "border-blue-200 shadow-sm" : "border-gray-100 bg-white hover:bg-gray-50"}`}
            >
              <p className={`text-2xl font-bold ${color}`}>{statusCounts[key as keyof typeof statusCounts]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9" placeholder="Search work order ID or site..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="PM Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Daily PM">Daily PM</SelectItem>
              <SelectItem value="Weekly PM">Weekly PM</SelectItem>
              <SelectItem value="Monthly PM">Monthly PM</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New Work Order
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">WO Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Site</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">PM Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Technician</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((wo) => {
                const st = statusConfig[wo.status]
                const pr = priorityConfig[wo.priority]
                return (
                  <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-blue-600">{wo.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{wo.site}</p>
                      <p className="text-xs text-gray-500">{wo.region}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-700">{wo.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                          {wo.tech.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-xs text-gray-700">{wo.tech}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${pr.color}`}>{pr.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700">{wo.due}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-blue-600 gap-1 h-7">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
