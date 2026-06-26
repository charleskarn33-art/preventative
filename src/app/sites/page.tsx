"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, MapPin, Zap, LayoutGrid, Pencil, Trash2, Calendar, User, Upload, FileText, ClipboardList, CheckSquare, Radio } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { sites, technicians } from "@/lib/data"
import { supabase } from "@/lib/supabase"

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

const countyData = [
  { name: "Montserrado", sites: 264, techs: 16, inspections: 126 },
  { name: "Nimba",       sites: 59,  techs: 3,  inspections: 32 },
  { name: "Bong",        sites: 46,  techs: 2,  inspections: 8 },
  { name: "Margibi",     sites: 38,  techs: 4,  inspections: 15 },
  { name: "Lofa",        sites: 32,  techs: 3,  inspections: 11 },
  { name: "Grand Bassa", sites: 28,  techs: 2,  inspections: 9 },
  { name: "River Gee",   sites: 22,  techs: 2,  inspections: 5 },
  { name: "Grand Kru",   sites: 18,  techs: 1,  inspections: 4 },
  { name: "Grand Gedeh", sites: 17,  techs: 2,  inspections: 6 },
  { name: "Maryland",    sites: 16,  techs: 1,  inspections: 3 },
  { name: "Grand Cape Mount", sites: 14, techs: 1, inspections: 4 },
  { name: "Sinoe",       sites: 11,  techs: 1,  inspections: 2 },
  { name: "Gbarpolu",    sites: 8,   techs: 1,  inspections: 2 },
  { name: "Bomi",        sites: 7,   techs: 1,  inspections: 1 },
  { name: "River Cess",  sites: 5,   techs: 1,  inspections: 0 },
]

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

type Tab = "sites" | "regions" | "technicians" | "users" | "reports" | "checklists"

// ── Technicians sub-component with Add modal + Excel import ──────────────────

const LIBERIA_COUNTIES = [
  "Montserrado","Nimba","Bong","Margibi","Lofa","Grand Bassa",
  "River Gee","Grand Kru","Grand Gedeh","Maryland","Grand Cape Mount",
  "Sinoe","Gbarpolu","Bomi","River Cess",
]

type Tech = { id: string; name: string; region: string; sites: number; status: string; phone: string }

const emptyForm = () => ({ name: "", region: "", phone: "", status: "active", sites: 0 })

const TECHS_KEY = "ipt_technicians"

function TechniciansTab() {
  const [techList, setTechList] = useState<Tech[]>([...technicians])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Tech | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TECHS_KEY)
      if (saved) setTechList(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage whenever list changes
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(TECHS_KEY, JSON.stringify(techList))
  }, [techList, loaded])

  const nextId = () => `T-${String(techList.length + 1).padStart(3, "0")}`

  const openAdd = () => { setEditTarget(null); setForm(emptyForm()); setShowModal(true) }
  const openEdit = (t: Tech) => { setEditTarget(t); setForm({ name: t.name, region: t.region, phone: t.phone, status: t.status, sites: t.sites }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditTarget(null) }

  const handleSave = () => {
    if (!form.name.trim() || !form.region || !form.phone.trim()) return
    if (editTarget) {
      setTechList(techList.map(t => t.id === editTarget.id ? { ...t, ...form } : t))
    } else {
      setTechList([...techList, { id: nextId(), ...form }])
    }
    closeModal()
  }

  const handleDelete = (id: string) => setTechList(techList.filter(t => t.id !== id))

  const parseRows = (rows: Record<string, string>[], startLen: number): Tech[] =>
    rows.map((row, i) => ({
      id: `T-${String(startLen + i + 1).padStart(3, "0")}`,
      name:   (row["Name"]   || row["name"]   || "").trim(),
      region: (row["Region"] || row["region"] || "").trim(),
      phone:  (row["Phone"]  || row["phone"]  || "").trim(),
      status: (row["Status"] || row["status"] || "active").trim(),
      sites:  parseInt(row["Sites"] || row["sites"] || "0") || 0,
    })).filter(t => t.name)

  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(""); setImportSuccess("")
    const file = e.target.files?.[0]
    if (!file) { return }
    e.target.value = ""
    try {
      let rows: Record<string, string>[] = []
      if (file.name.match(/\.csv$/i)) {
        const text = await file.text()
        const lines = text.split(/\r?\n/).filter(l => l.trim())
        if (lines.length < 2) { setImportError("File appears empty."); return }
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
        rows = lines.slice(1).map(line => {
          const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""))
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = cols[i] || "" })
          return obj
        })
      } else if (file.name.match(/\.(xlsx|xls)$/i)) {
        const readXlsxFile = (await import("read-excel-file/browser")).default
        const sheets = await readXlsxFile(file); const xlsRows = sheets[0]?.data ?? []
        if (xlsRows.length < 2) { setImportError("File appears empty."); return }
        const headers = xlsRows[0].map(h => String(h ?? ""))
        rows = xlsRows.slice(1).map(row => {
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = String(row[i] ?? "") })
          return obj
        })
      } else {
        setImportError("Please upload an .xlsx, .xls, or .csv file."); return
      }
      const imported = parseRows(rows, techList.length)
      if (imported.length === 0) { setImportError("No valid rows found. Check column names: Name, Region, Phone, Status, Sites"); return }
      setTechList(prev => [...prev, ...imported])
      setImportSuccess(`${imported.length} technician${imported.length !== 1 ? "s" : ""} imported.`)
    } catch (err) {
      console.error(err)
      setImportError("Failed to parse file. Check format.")
    }
  }

  const downloadTemplate = () => {
    const csv = "Name,Region,Phone,Status,Sites\nJohn Doe,Montserrado,+231 770 000 001,active,3\n"
    const a = document.createElement("a")
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    a.download = "technicians_template.csv"; a.click()
  }

  const filtered = techList.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.region.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9" placeholder="Search technicians..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex-1" />

        {/* Import feedback */}
        {importError && <p className="text-xs text-red-600">{importError}</p>}
        {importSuccess && <p className="text-xs text-green-600">{importSuccess}</p>}

        {/* Excel import */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" /> Import Excel
            <input type="file" accept=".xlsx,.xls,.csv" className="sr-only" onChange={handleExcel} />
          </label>
          <button onClick={downloadTemplate} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
            Download template
          </button>
        </div>

        <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Technician
        </Button>
      </div>

      {/* Table */}
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
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No technicians found.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{t.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{t.region}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{t.sites}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{t.phone}</td>
                <td className="px-4 py-3">{statusBadge(t.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(t)} className="p-1.5 text-gray-300 hover:text-blue-600 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-300 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">{editTarget ? "Edit Technician" : "Add Technician"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                <Input className="mt-1" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Region <span className="text-red-500">*</span></label>
                <select
                  className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.region}
                  onChange={e => setForm({ ...form, region: e.target.value })}
                >
                  <option value="">Select county...</option>
                  {LIBERIA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Phone <span className="text-red-500">*</span></label>
                <Input className="mt-1" placeholder="+231 770 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Status</label>
                <select
                  className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="on_site">On Site</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Number of Sites</label>
                <Input className="mt-1" type="number" min={0} value={form.sites} onChange={e => setForm({ ...form, sites: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSave}
                disabled={!form.name.trim() || !form.region || !form.phone.trim()}
              >
                {editTarget ? "Save Changes" : "Add Technician"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sites sub-component with Add/Edit modal + Excel import ───────────────────

type SiteRecord = { id: number; name: string; region: string; status: string; type: string; gens: number; kva: number; panels: number; techs: string }
const emptySiteForm = () => ({ siteId: "", name: "", region: "", status: "active", type: "Greenfield", gens: 1, kva: 30, panels: 0, techs: "" })

const SITES_KEY = "ipt_sites"

// Map app type strings to Supabase tower_type enum
const toTowerType = (t: string): string => {
  const map: Record<string, string> = { Greenfield: "self_support", Rooftop: "rooftop", Outdoor: "guyed_tower", Indoor: "monopole" }
  return map[t] ?? "self_support"
}
const fromTowerType = (t: string): string => {
  const map: Record<string, string> = { self_support: "Greenfield", rooftop: "Rooftop", guyed_tower: "Outdoor", monopole: "Indoor", camouflaged: "Outdoor" }
  return map[t] ?? "Greenfield"
}

function SitesTab() {
  const [siteList, setSiteList] = useState<SiteRecord[]>([...sites])
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<SiteRecord | null>(null)
  const [form, setForm] = useState(emptySiteForm())
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState("")

  // Load from Supabase on mount, fall back to localStorage
  useEffect(() => {
    const load = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      try {
        const { data, error } = await db
          .from("tower_sites")
          .select("site_id, site_name, region, county, status, tower_type, generators, kva, panels, technicians")
          .order("site_id")
        if (!error && data && data.length > 0) {
          const merged: SiteRecord[] = (data as { site_id: string; site_name: string; region: string; status: string; tower_type: string; generators: number; kva: number; panels: number; technicians: string }[]).map(row => ({
            id: parseInt(row.site_id) || 0,
            name: row.site_name,
            region: row.region,
            status: row.status,
            type: fromTowerType(row.tower_type),
            gens: row.generators ?? 0,
            kva: row.kva ?? 0,
            panels: row.panels ?? 0,
            techs: row.technicians ?? "",
          }))
          setSiteList(merged)
          localStorage.setItem(SITES_KEY, JSON.stringify(merged))
          setLoaded(true)
          return
        }
      } catch {}
      // Supabase unavailable — load from localStorage
      try {
        const saved = localStorage.getItem(SITES_KEY)
        if (saved) setSiteList(JSON.parse(saved))
      } catch {}
      setLoaded(true)
    }
    load()
  }, [])

  // Persist to localStorage whenever list changes
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(SITES_KEY, JSON.stringify(siteList))
  }, [siteList, loaded])

  const upsertToSupabase = async (s: SiteRecord) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("tower_sites").upsert({
      site_id: String(s.id),
      site_name: s.name,
      region: s.region,
      county: s.region,
      status: s.status as "active" | "inactive" | "under_maintenance" | "decommissioned",
      tower_type: toTowerType(s.type) as "monopole" | "guyed_tower" | "self_support" | "rooftop" | "camouflaged",
      generators: s.gens,
      kva: s.kva,
      panels: s.panels,
      technicians: s.techs,
    }, { onConflict: "site_id" })
  }

  const deleteFromSupabase = async (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("tower_sites").delete().eq("site_id", String(id))
  }

  const siteRegions = [...new Set(siteList.map(s => s.region))].sort()
  const nextId = () => Math.max(...siteList.map(s => s.id), 1000) + 1

  const filteredSites = siteList.filter(s => {
    const q = search.toLowerCase()
    const match = s.name.toLowerCase().includes(q) || String(s.id).includes(q) || s.techs.toLowerCase().includes(q)
    const rMatch = regionFilter === "all" || s.region === regionFilter
    const sMatch = statusFilter === "all" || s.status === statusFilter
    return match && rMatch && sMatch
  })

  const toggleSelect = (id: number) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const openAdd = () => { setEditTarget(null); setForm(emptySiteForm()); setShowModal(true) }
  const openEdit = (s: SiteRecord) => { setEditTarget(s); setForm({ siteId: String(s.id), name: s.name, region: s.region, status: s.status, type: s.type, gens: s.gens, kva: s.kva, panels: s.panels, techs: s.techs }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditTarget(null) }

  const handleSave = async () => {
    if (!form.name.trim() || !form.region) return
    setSaving(true)
    const newId = parseInt(form.siteId) || nextId()
    const record: SiteRecord = { id: newId, name: form.name, region: form.region, status: form.status, type: form.type, gens: form.gens, kva: form.kva, panels: form.panels, techs: form.techs }
    if (editTarget) {
      setSiteList(siteList.map(s => s.id === editTarget.id ? record : s))
    } else {
      setSiteList(prev => [...prev, record])
    }
    await upsertToSupabase(record).catch(() => {})
    setSaving(false)
    closeModal()
  }

  const handleDelete = async (id: number) => {
    setSiteList(siteList.filter(s => s.id !== id))
    await deleteFromSupabase(id).catch(() => {})
  }

  const downloadTemplate = () => {
    const csv = "Site ID,Name,Region,Status,Type,Generators,KVA,Panels,Technicians\n1418,Baiyema,Bong,active,Greenfield,1,30,14,John Doe\n"
    const a = document.createElement("a")
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    a.download = "sites_template.csv"; a.click()
  }

  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(""); setImportSuccess("")
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    try {
      let rows: Record<string, string>[] = []
      if (file.name.match(/\.csv$/i)) {
        const text = await file.text()
        const lines = text.split(/\r?\n/).filter(l => l.trim())
        if (lines.length < 2) { setImportError("File appears empty."); return }
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
        rows = lines.slice(1).map(line => {
          const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""))
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = cols[i] || "" })
          return obj
        })
      } else if (file.name.match(/\.(xlsx|xls)$/i)) {
        const readXlsxFile = (await import("read-excel-file/browser")).default
        const sheets = await readXlsxFile(file); const xlsRows = sheets[0]?.data ?? []
        if (xlsRows.length < 2) { setImportError("File appears empty."); return }
        const headers = xlsRows[0].map(h => String(h ?? ""))
        rows = xlsRows.slice(1).map(row => {
          const obj: Record<string, string> = {}
          headers.forEach((h, i) => { obj[h] = String(row[i] ?? "") })
          return obj
        })
      } else {
        setImportError("Please upload an .xlsx, .xls, or .csv file."); return
      }
      let base = nextId()
      const imported: SiteRecord[] = rows.map(row => ({
        id: parseInt(row["Site ID"] || row["site_id"] || row["SiteID"] || row["id"] || "0") || base++,
        name:   (row["Name"]        || row["name"]        || "").trim(),
        region: (row["Region"]      || row["region"]      || "").trim(),
        status: (row["Status"]      || row["status"]      || "active").trim(),
        type:   (row["Type"]        || row["type"]        || "Greenfield").trim(),
        gens:   parseInt(row["Generators"] || row["generators"] || "0") || 0,
        kva:    parseInt(row["KVA"]        || row["kva"]        || "0") || 0,
        panels: parseInt(row["Panels"]     || row["panels"]     || "0") || 0,
        techs:  (row["Technicians"] || row["technicians"] || "").trim(),
      })).filter(s => s.name)
      if (imported.length === 0) { setImportError("No valid rows found. Check column names: Name, Region, Status, Type, Generators, KVA, Panels, Technicians"); return }
      setSiteList(prev => [...prev, ...imported])
      // Bulk upsert to Supabase
      const upsertRows = imported.map(s => ({
        site_id: String(s.id),
        site_name: s.name,
        region: s.region,
        county: s.region,
        status: s.status as "active" | "inactive" | "under_maintenance" | "decommissioned",
        tower_type: toTowerType(s.type) as "monopole" | "guyed_tower" | "self_support" | "rooftop" | "camouflaged",
        generators: s.gens,
        kva: s.kva,
        panels: s.panels,
        technicians: s.techs,
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("tower_sites").upsert(upsertRows, { onConflict: "site_id" }).catch(() => {})
      setImportSuccess(`${imported.length} site${imported.length !== 1 ? "s" : ""} imported.`)
    } catch (err) {
      console.error(err)
      setImportError("Failed to parse file. Check format.")
    }
  }

  return (
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
            {siteRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
        {importError && <p className="text-xs text-red-600">{importError}</p>}
        {importSuccess && <p className="text-xs text-green-600">{importSuccess}</p>}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" /> Import Excel
            <input type="file" accept=".xlsx,.xls,.csv" className="sr-only" onChange={handleExcel} />
          </label>
          <button onClick={downloadTemplate} className="text-xs text-blue-600 hover:underline whitespace-nowrap">Download template</button>
        </div>
        <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 text-white" onClick={openAdd}>
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
              <button onClick={() => toggleSelect(site.id)} className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${selected.has(site.id) ? "border-red-600 bg-red-600" : "border-gray-300"}`} />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8h8L12 2z" /><path d="M8 8l-4 12h16L16 8" /><line x1="12" y1="8" x2="12" y2="20" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-gray-900">{site.name}</span>
                  {statusBadge(site.status)}
                  {typeBadge(site.type)}
                </div>
                <p className="text-xs text-gray-400 mb-2">{site.id}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><MapPin className="h-3 w-3" /> {site.region}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {site.gens > 0 && <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {site.gens} Gen • {site.kva}KVA</span>}
                  <span className="flex items-center gap-1"><LayoutGrid className="h-3 w-3" /> {site.panels} panels</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {site.techs}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded transition-colors"><Calendar className="h-4 w-4" /></button>
                <button onClick={() => openEdit(site)} className="p-1.5 text-gray-300 hover:text-blue-600 rounded transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(site.id)} className="p-1.5 text-gray-300 hover:text-red-600 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredSites.length === 0 && (
          <div className="col-span-2 py-12 text-center text-gray-400 text-sm">No sites found.</div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-gray-900 mb-5">{editTarget ? "Edit Site" : "Add Site"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Site ID <span className="text-red-500">*</span></label>
                <Input className="mt-1" placeholder="e.g. 1418" type="number" value={form.siteId} onChange={e => setForm({ ...form, siteId: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Site Name <span className="text-red-500">*</span></label>
                <Input className="mt-1" placeholder="e.g. Baiyema" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Region / County <span className="text-red-500">*</span></label>
                <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                  <option value="">Select county...</option>
                  {LIBERIA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Status</label>
                <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Site Type</label>
                <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="Greenfield">Greenfield</option>
                  <option value="Rooftop">Rooftop</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Indoor">Indoor</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">No. of Generators</label>
                <Input className="mt-1" type="number" min={0} value={form.gens} onChange={e => setForm({ ...form, gens: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Capacity (KVA)</label>
                <Input className="mt-1" type="number" min={0} value={form.kva} onChange={e => setForm({ ...form, kva: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Solar Panels</label>
                <Input className="mt-1" type="number" min={0} value={form.panels} onChange={e => setForm({ ...form, panels: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Assigned Technician(s)</label>
                <Input className="mt-1" placeholder="e.g. Jacob Fayiah" value={form.techs} onChange={e => setForm({ ...form, techs: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleSave} disabled={!form.siteId || !form.name.trim() || !form.region || saving}>
                {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Site"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SitesPage() {
  const [tab, setTab] = useState<Tab>("sites")
  const [search, setSearch] = useState("")

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "sites", label: "Sites", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
    { key: "regions", label: "Regions", icon: <MapPin className="h-3.5 w-3.5" /> },
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
              onClick={() => setTab(t.key)}
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
        {tab === "sites" && <SitesTab />}

        {/* ── REGIONS TAB ── */}
        {tab === "regions" && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: countyData.length, label: "Regions Covered", icon: (
                  <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                )},
                { value: countyData.reduce((s, c) => s + c.sites, 0), label: "Total Sites", icon: (
                  <svg className="h-8 w-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l-2 4h4L12 2z"/><path d="M10 6L6 18h12L14 6"/><line x1="12" y1="6" x2="12" y2="18"/>
                    <path d="M8 10c-2 0-3 1-3 1M16 10c2 0 3 1 3 1"/>
                  </svg>
                )},
                { value: countyData.reduce((s, c) => s + c.techs, 0), label: "Technicians", icon: (
                  <svg className="h-8 w-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/>
                    <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M17 13c2.2 0 4 1.8 4 4"/>
                  </svg>
                )},
              ].map(({ value, label, icon }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                  {icon}
                  <p className="text-3xl font-bold text-gray-900 mt-3">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Sites &amp; Inspections by Region</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={countyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                    formatter={(value) => value === "sites" ? "Sites" : "PM"} />
                  <Bar dataKey="sites" fill="#1e3a5f" radius={[3, 3, 0, 0]} name="sites" />
                  <Bar dataKey="inspections" fill="#dc2626" radius={[3, 3, 0, 0]} name="PM" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* All counties grid */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                All {countyData.length} Counties
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {countyData.map(county => (
                  <div key={county.name} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="font-semibold text-gray-900 text-sm">{county.name}</span>
                      </div>
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        <strong className="text-gray-800">{county.sites}</strong> sites
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <strong className="text-gray-800">{county.techs}</strong> techs
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3" />
                        <strong className="text-gray-800">{county.inspections}</strong> inspections
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TECHNICIANS TAB ── */}
        {tab === "technicians" && (
          <TechniciansTab />
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
