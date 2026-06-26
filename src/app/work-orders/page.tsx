"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MapPin, Trash2, ChevronRight, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface WorkOrder {
  id: string
  siteCode: string
  site: string
  region: string
  tech: string
  status: string
  date: string
  progress: number
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open:             { label: "Open",             className: "bg-gray-100 text-gray-700" },
  assigned:         { label: "Assigned",         className: "bg-blue-50 text-blue-700" },
  in_progress:      { label: "In Progress",      className: "bg-blue-100 text-blue-700" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-100 text-amber-700" },
  completed:        { label: "Completed",        className: "bg-green-100 text-green-700" },
  overdue:          { label: "Overdue",          className: "bg-red-100 text-red-700" },
}

export default function WorkOrdersPage() {
  const [items, setItems] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const router = useRouter()

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("work_orders")
        .select(`
          id,
          work_order_number,
          status,
          due_date,
          pm_type,
          notes,
          tower_sites (site_id, site_name, region),
          users!work_orders_technician_id_fkey (full_name)
        `)
        .is("deleted_at", null)
        .order("due_date", { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        // Get checklist response counts to calculate progress
        const orderIds = data.map(o => o.id)
        const { data: responses } = await supabase
          .from("checklist_responses")
          .select("work_order_id, response")
          .in("work_order_id", orderIds)

        const responseMap: Record<string, { total: number; answered: number }> = {}
        responses?.forEach(r => {
          if (!responseMap[r.work_order_id]) responseMap[r.work_order_id] = { total: 0, answered: 0 }
          responseMap[r.work_order_id].total++
          if (r.response && r.response !== "na") responseMap[r.work_order_id].answered++
        })

        const mapped: WorkOrder[] = data.map(o => {
          const site = o.tower_sites as { site_id: string; site_name: string; region: string } | null
          const user = o.users as { full_name: string } | null
          const rm = responseMap[o.id]
          const progress = rm && rm.total > 0 ? Math.round((rm.answered / rm.total) * 100) : (o.status === "completed" ? 100 : 0)
          return {
            id: o.id,
            siteCode: site?.site_id ?? o.work_order_number,
            site: site?.site_name ?? "Unknown Site",
            region: site?.region ?? "—",
            tech: user?.full_name ?? "Unassigned",
            status: o.status,
            date: o.due_date,
            progress,
          }
        })
        setItems(mapped)
      } else {
        // Fall back to localStorage inspections
        const localOrders: WorkOrder[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (!key?.startsWith("inspection_")) continue
          try {
            const saved = JSON.parse(localStorage.getItem(key)!)
            localOrders.push({
              id: saved.id,
              siteCode: String(saved.id),
              site: saved.site || "Unknown",
              region: saved.region || "—",
              tech: saved.technician || "—",
              status: "completed",
              date: saved.date || saved.savedAt?.split("T")[0] || "—",
              progress: saved.progress ?? 100,
            })
          } catch {}
        }
        localOrders.sort((a, b) => b.date.localeCompare(a.date))
        setItems(localOrders)
      }
    } catch {
      // Network error — load from localStorage
      const localOrders: WorkOrder[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key?.startsWith("inspection_")) continue
        try {
          const saved = JSON.parse(localStorage.getItem(key)!)
          localOrders.push({
            id: saved.id,
            siteCode: String(saved.id),
            site: saved.site || "Unknown",
            region: saved.region || "—",
            tech: saved.technician || "—",
            status: "completed",
            date: saved.date || saved.savedAt?.split("T")[0] || "—",
            progress: saved.progress ?? 100,
          })
        } catch {}
      }
      localOrders.sort((a, b) => b.date.localeCompare(a.date))
      setItems(localOrders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const regions = [...new Set(items.map(w => w.region))].sort()

  const filtered = items.filter((wo) => {
    const q = search.toLowerCase()
    const matchSearch = wo.site.toLowerCase().includes(q) || wo.siteCode.toLowerCase().includes(q) || wo.tech.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || wo.status === statusFilter
    const matchRegion = regionFilter === "all" || wo.region === regionFilter
    return matchSearch && matchStatus && matchRegion
  })

  const remove = async (id: string) => {
    setItems(items.filter(w => w.id !== id))
    await supabase.from("work_orders").update({ deleted_at: new Date().toISOString() }).eq("id", id).catch(() => {})
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PM</h1>
            <p className="text-sm text-gray-500 mt-0.5">{loading ? "Loading…" : `${filtered.length} total records`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Button className="gap-1.5 bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/checklists/new")}>
              <Plus className="h-4 w-4" /> New PM
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9" placeholder="Search site, code or technician..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
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
            <SelectTrigger className="w-44"><SelectValue placeholder="All Regions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Card list */}
        <div className="space-y-2">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                <div className="space-y-2 animate-pulse">
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-100 rounded w-32" />
                    <div className="h-4 bg-gray-100 rounded w-16" />
                    <div className="h-4 bg-gray-100 rounded w-20" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-48" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="h-10 w-10 mb-3 text-gray-200" />
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : filtered.map((wo) => {
            const st = statusConfig[wo.status] ?? { label: wo.status, className: "bg-gray-100 text-gray-700" }
            const barColor = wo.progress === 100 ? "bg-red-600" : wo.progress === 0 ? "bg-red-200" : "bg-red-500"
            return (
              <div key={wo.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{wo.site}</span>
                      <span className="text-sm text-gray-400">{wo.siteCode}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.className}`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{wo.region}</span>
                      <span>{wo.tech}</span>
                      <span>{wo.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${wo.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{wo.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    <button onClick={() => remove(wo.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => router.push(`/checklists/${wo.id}`)} className="p-1.5 text-gray-300 hover:text-gray-600 transition-colors rounded" title="View Inspection">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
