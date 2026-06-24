"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, MapPin, Zap, LayoutGrid, Pencil, Trash2, Calendar, User, Upload, FileText, ClipboardList, CheckSquare } from "lucide-react"

const sites = [
  { id: 1418, name: "Baiyema", region: "Bong", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 14, techs: "Kollie, Aaron Gotogo" },
  { id: 1331, name: "ISI Factory 2", region: "Montserrado", status: "active", type: "Outdoor", gens: 1, kva: 30, panels: 20, techs: "Jacob Fayiah" },
  { id: 1801, name: "Gbarnga 8", region: "Bong", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 45, techs: "Kerkulah, Moses" },
  { id: 1857, name: "Yargaryah (Replacing Joansen)", region: "Gbarpolu", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 0, techs: "Abraham Cole" },
  { id: 1179, name: "Duport Road Junction", region: "Montserrado", status: "active", type: "Greenfield", gens: 0, kva: 0, panels: 0, techs: "Moses Kollie" },
  { id: 1347, name: "Public School Community", region: "Montserrado", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 20, techs: "Khalifa Konneh" },
  { id: 1440, name: "King Farm", region: "Montserrado", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 12, techs: "Jacob Fayiah" },
  { id: 1508, name: "Banjor Road", region: "Montserrado", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 8, techs: "Mohammed Konneh" },
  { id: 1391, name: "Ganta Junction", region: "Nimba", status: "active", type: "Rooftop", gens: 1, kva: 20, panels: 6, techs: "John Doe" },
  { id: 1376, name: "Buchanan Central", region: "Grand Bassa", status: "inactive", type: "Greenfield", gens: 1, kva: 30, panels: 18, techs: "Peter Smith" },
]

const technicians = [
  { id: "T-001", name: "Jacob Fayiah", region: "Montserrado", sites: 3, status: "active", phone: "+231 770 123 456" },
  { id: "T-002", name: "Mohammed Konneh", region: "Montserrado", sites: 2, status: "on_site", phone: "+231 770 234 567" },
  { id: "T-003", name: "Aaron Gotogo", region: "Bong", sites: 1, status: "active", phone: "+231 770 345 678" },
  { id: "T-004", name: "Khalifa Konneh", region: "Montserrado", sites: 1, status: "active", phone: "+231 770 456 789" },
  { id: "T-005", name: "Abraham Cole", region: "Gbarpolu", sites: 1, status: "offline", phone: "+231 770 567 890" },
  { id: "T-006", name: "Moses Kollie", region: "Montserrado", sites: 2, status: "active", phone: "+231 770 678 901" },
]

const users = [
  { id: "U-001", name: "Charles J. Karn", email: "charles@iptpowertech.com", role: "Super Admin", region: "All", status: "active" },
  { id: "U-002", name: "Jacob Fayiah", email: "jacob@iptpowertech.com", role: "Technician", region: "Montserrado", status: "active" },
  { id: "U-003", name: "Mohammed Konneh", email: "mohammed@iptpowertech.com", role: "Technician", region: "Montserrado", status: "active" },
  { id: "U-004", name: "Aaron Gotogo", email: "aaron@iptpowertech.com", role: "Supervisor", region: "Bong", status: "active" },
  { id: "U-005", name: "Abraham Cole", email: "abraham@iptpowertech.com", role: "Technician", region: "Gbarpolu", status: "inactive" },
]

const reports = [
  { id: "RPT-001", title: "Monthly PM Compliance — June 2026", region: "All", generated: "2026-06-24", type: "Compliance", records: 222 },
  { id: "RPT-002", title: "Technician Performance — June 2026", region: "Montserrado", generated: "2026-06-23", type: "Performance", records: 45 },
  { id: "RPT-003", title: "Site Status Summary — Q2 2026", region: "All", generated: "2026-06-20", type: "Summary", records: 576 },
  { id: "RPT-004", title: "Overdue PM Report — June 2026", region: "Bong", generated: "2026-06-18", type: "Overdue", records: 12 },
]

const checklists = [
  { id: "CL-001", site: "Baiyema", code: 1418, tech: "Aaron Gotogo", date: "2026-06-24", status: "completed", score: 100 },
  { id: "CL-002", site: "Hotel Africa 2", code: 1443, tech: "Mohammed Konneh", date: "2026-06-24", status: "completed", score: 100 },
  { id: "CL-003", site: "King Farm", code: 1440, tech: "Jacob Fayiah", date: "2026-06-10", status: "completed", score: 85 },
  { id: "CL-004", site: "Banjor Road", code: 1508, tech: "Mohammed Konneh", date: "2026-06-23", status: "completed", score: 92 },
  { id: "CL-005", site: "Ganta Junction", code: 1391, tech: "John Doe", date: "2026-06-22", status: "in_progress", score: 65 },
  { id: "CL-006", site: "Gbarnga 8", code: 1801, tech: "Moses Kollie", date: "2026-06-21", status: "pending_approval", score: 100 },
]

const regions = [...new Set(sites.map(s => s.region))].sort()

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    on_site: "bg-blue-100 text-blue-700",
    offline: "bg-gray-100 text-gray-500",
    completed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    pending_approval: "bg-amber-100 text-amber-700",
  }
  const label: Record<string, string> = {
    active: "Active", inactive: "Inactive", on_site: "On Site", offline: "Offline",
    completed: "Completed", in_progress: "In Progress", pending_approval: "Pending",
  }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[s] ?? "bg-gray-100 text-gray-600"}`}>{label[s] ?? s}</span>
}

const typeBadge = (t: string) => (
  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{t}</span>
)

type Tab = "sites" | "technicians" | "users" | "reports" | "checklists"

export default function SitesPage() {
  const [tab, setTab] = useState<Tab>("sites")
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const filteredSites = sites.filter(s => {
    const q = search.toLowerCase()
    const match = s.name.toLowerCase().includes(q) || String(s.id).includes(q) || s.techs.toLowerCase().includes(q)
    const rMatch = regionFilter === "all" || s.region === regionFilter
    const sMatch = statusFilter === "all" || s.status === statusFilter
    return match && rMatch && sMatch
  })

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "sites", label: "Sites", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
    { key: "technicians", label: "Technicians", icon: <User className="h-3.5 w-3.5" /> },
    { key: "users", label: "Users", icon: <User className="h-3.5 w-3.5" /> },
    { key: "reports", label: "Reports", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "checklists", label: "Checklists", icon: <CheckSquare className="h-3.5 w-3.5" /> },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage sites, technicians, regions and users</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSearch(""); setRegionFilter("all"); setStatusFilter("all") }}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── SITES TAB ── */}
        {tab === "sites" && (
          <div className="space-y-4">
            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" placeholder="Search sites..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All Regions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="h-4 w-4" /> Import Excel
              </Button>
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" /> Add Site
              </Button>
            </div>

            {/* Count */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
              <span className="text-sm text-gray-500">{filteredSites.length} sites found</span>
            </div>

            {/* 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSites.map(site => (
                <div key={site.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    {/* Radio checkbox */}
                    <button
                      onClick={() => toggleSelect(site.id)}
                      className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${selected.has(site.id) ? "border-red-600 bg-red-600" : "border-gray-300"}`}
                    />
                    {/* Tower icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L8 8h8L12 2z" /><path d="M8 8l-4 12h16L16 8" /><line x1="12" y1="8" x2="12" y2="20" />
                      </svg>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-gray-900">{site.name}</span>
                        {statusBadge(site.status)}
                        {typeBadge(site.type)}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{site.id}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin className="h-3 w-3" /> {site.region}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {site.gens > 0 && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {site.gens} Gen • {site.kva}KVA
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <LayoutGrid className="h-3 w-3" /> {site.panels} panels
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {site.techs}
                        </span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded transition-colors">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-300 hover:text-blue-600 rounded transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-300 hover:text-red-600 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TECHNICIANS TAB ── */}
        {tab === "technicians" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" placeholder="Search technicians..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex-1" />
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" /> Add Technician
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Region</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Sites</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {technicians.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{t.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{t.region}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{t.sites}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{t.phone}</td>
                      <td className="px-4 py-3">{statusBadge(t.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-300 hover:text-blue-600 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                          <button className="p-1.5 text-gray-300 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex-1" />
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" /> Add User
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Region</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center text-[11px] font-bold text-red-700">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{u.region}</td>
                      <td className="px-4 py-3">{statusBadge(u.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-300 hover:text-blue-600 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                          <button className="p-1.5 text-gray-300 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REPORTS TAB ── */}
        {tab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex-1" />
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" /> Generate Report
              </Button>
            </div>
            <div className="space-y-2">
              {reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase())).map(r => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.region} • {r.records} records • Generated {r.generated}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">{r.type}</span>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 text-gray-300 hover:text-blue-600 rounded transition-colors"><FileText className="h-4 w-4" /></button>
                    <button className="p-1.5 text-gray-300 hover:text-red-600 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHECKLISTS TAB ── */}
        {tab === "checklists" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" placeholder="Search checklists..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex-1" />
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" /> New Checklist
              </Button>
            </div>
            <div className="space-y-2">
              {checklists.filter(c => c.site.toLowerCase().includes(search.toLowerCase()) || c.tech.toLowerCase().includes(search.toLowerCase())).map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{c.site}</span>
                        <span className="text-sm text-gray-400">{c.code}</span>
                        {statusBadge(c.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{c.tech}</span>
                        <span>{c.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-600" style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{c.score}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1.5 text-gray-300 hover:text-blue-600 rounded"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 text-gray-300 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
