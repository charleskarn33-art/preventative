"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MapPin, Trash2, ChevronRight } from "lucide-react"

const workOrders = [
  { id: 1418, site: "Baiyema", region: "Bong", tech: "Adam Kiazolu", status: "completed", date: "2026-06-24", progress: 0 },
  { id: 1443, site: "Hotel Africa 2", region: "Montserrado", tech: "Mohammed Konneh", status: "completed", date: "2026-06-24", progress: 100 },
  { id: 1440, site: "King Farm", region: "Montserrado", tech: "Jacob Fayiah", status: "completed", date: "2026-06-10", progress: 100 },
  { id: 1508, site: "Banjor Road", region: "Montserrado", tech: "Mohammed Konneh", status: "completed", date: "2026-06-23", progress: 100 },
  { id: 1391, site: "Ganta Junction", region: "Nimba", tech: "John Doe", status: "in_progress", date: "2026-06-22", progress: 65 },
  { id: 1376, site: "Buchanan Central", region: "Grand Bassa", tech: "Peter Smith", status: "in_progress", date: "2026-06-21", progress: 40 },
  { id: 1355, site: "Kakata Tower", region: "Margibi", tech: "Grace Williams", status: "pending_approval", date: "2026-06-20", progress: 100 },
  { id: 1342, site: "Robertsport", region: "Grand Cape Mount", tech: "David Johnson", status: "open", date: "2026-06-19", progress: 0 },
  { id: 1318, site: "Sanniquellie", region: "Nimba", tech: "Mary Brown", status: "overdue", date: "2026-06-15", progress: 20 },
  { id: 1301, site: "Voinjama North", region: "Lofa", tech: "James Clark", status: "overdue", date: "2026-06-12", progress: 0 },
  { id: 1289, site: "Tubmanburg", region: "Bomi", tech: "Susan Taylor", status: "completed", date: "2026-06-18", progress: 100 },
  { id: 1274, site: "Zwedru Central", region: "Grand Gedeh", tech: "Alex Moore", status: "completed", date: "2026-06-17", progress: 85 },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  open:             { label: "Open",             className: "bg-gray-100 text-gray-700" },
  in_progress:      { label: "In Progress",      className: "bg-blue-100 text-blue-700" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-100 text-amber-700" },
  completed:        { label: "Completed",        className: "bg-green-100 text-green-700" },
  overdue:          { label: "Overdue",          className: "bg-red-100 text-red-700" },
}

const regions = [...new Set(workOrders.map(w => w.region))].sort()

export default function WorkOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [items, setItems] = useState(workOrders)
  const router = useRouter()

  const filtered = items.filter((wo) => {
    const q = search.toLowerCase()
    const matchSearch = wo.site.toLowerCase().includes(q) || String(wo.id).includes(q) || wo.tech.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || wo.status === statusFilter
    const matchRegion = regionFilter === "all" || wo.region === regionFilter
    return matchSearch && matchStatus && matchRegion
  })

  const remove = (id: number) => setItems(items.filter(w => w.id !== id))

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PM</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filtered.length} total records</p>
          </div>
          <Button className="gap-1.5 bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/checklists/new")}>
            <Plus className="h-4 w-4" /> New PM
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search site, code or technician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Card list */}
        <div className="space-y-2">
          {filtered.map((wo) => {
            const st = statusConfig[wo.status]
            const barColor = wo.progress === 100 ? "bg-red-600" : wo.progress === 0 ? "bg-red-200" : "bg-red-500"
            return (
              <div key={wo.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{wo.site}</span>
                      <span className="text-sm text-gray-400">{wo.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.className}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{wo.region}
                      </span>
                      <span>{wo.tech}</span>
                      <span>{wo.date}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${wo.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{wo.progress}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    <button
                      onClick={() => remove(wo.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/checklists/new?edit=1&id=${wo.id}&site=${encodeURIComponent(wo.site)}&tech=${encodeURIComponent(wo.tech)}&region=${encodeURIComponent(wo.region)}&date=${wo.date}`)}
                      className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors rounded"
                      title="Open / Edit Inspection"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="h-10 w-10 mb-3 text-gray-200" />
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
