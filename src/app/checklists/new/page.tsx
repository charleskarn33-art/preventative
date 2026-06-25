"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, LayoutTemplate, BookmarkPlus, MapPin, Plus, Pencil, Trash2, Check, X, ImagePlus, Camera, AlertCircle, CheckCircle2, Search } from "lucide-react"
import { sites } from "@/lib/data"

const SITE_OPTIONS = sites.map(s => ({ label: `${s.name} (${s.id})`, value: s.name, region: s.region }))

// ─── Types ───────────────────────────────────────────────────────────────────

type Response = "YES" | "NO" | "NA" | ""

interface Photo { id: string; url: string; name: string }

interface ChecklistItem {
  id: string
  question: string
  response: Response
  comment: string
  corrective: string
  photos: Photo[]
  editing: boolean   // inline question edit mode
}

interface Section {
  id: number
  label: string
  items: ChecklistItem[]
  editingLabel: boolean
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const makeItem = (question: string): ChecklistItem => ({
  id: crypto.randomUUID(),
  question,
  response: "",
  comment: "",
  corrective: "",
  photos: [],
  editing: false,
})

const initialSections: Section[] = [
  {
    id: 1, label: "Site Info", editingLabel: false,
    items: [], // Site Info handled separately
  },
  {
    id: 2, label: "Generator", editingLabel: false,
    items: [
      "Is the generator in good working condition?",
      "Is the fuel level above 50%?",
      "Is the oil level adequate?",
      "Are there any visible fuel or oil leaks?",
      "Is the coolant level adequate?",
      "Is the battery terminal clean and tight?",
      "Is the air filter clean?",
      "Is the exhaust free from abnormal smoke?",
      "Are all gauges and indicators functioning?",
      "Is the generator room/enclosure clean?",
      "Is the automatic transfer switch functional?",
      "Is the generator load within rated capacity?",
    ].map(makeItem),
  },
  {
    id: 3, label: "DC System", editingLabel: false,
    items: [
      "Is the rectifier operating normally?",
      "Are all DC breakers in good condition?",
      "Is the DC output voltage within specification?",
      "Are there any alarms on the DC system?",
      "Is the earthing/grounding system intact?",
    ].map(makeItem),
  },
  {
    id: 4, label: "Battery", editingLabel: false,
    items: [
      "Are all batteries connected and secure?",
      "Are battery terminals free from corrosion?",
      "Is the battery room/cabinet ventilated?",
    ].map(makeItem),
  },
  {
    id: 5, label: "Solar", editingLabel: false,
    items: [
      "Are solar panels clean and free from debris?",
      "Are all panel connections secure?",
      "Is the solar charge controller operating normally?",
    ].map(makeItem),
  },
  {
    id: 6, label: "Cleaning", editingLabel: false,
    items: [
      "Is the site compound clean and free from vegetation?",
      "Are all equipment cabinets cleaned externally?",
      "Is the shelter/BTS room cleaned?",
      "Are drainage channels clear and unblocked?",
      "Is the site perimeter fence intact?",
    ].map(makeItem),
  },
  {
    id: 7, label: "RMS", editingLabel: false,
    items: [
      "Is the RMS/monitoring system active and reporting?",
    ].map(makeItem),
  },
]

const DC_PHASES = ["L1-N", "L2-N", "L3-N", "L1-L2", "L2-L3", "L1-L3", "Earth"]
const BATTERY_LABELS = ["Battery 1", "Battery 2", "Battery 3", "Battery 4", "Battery 5", "Battery 6", "Battery 7", "Battery 8"]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResponseButtons({ value, onChange }: { value: Response; onChange: (v: Response) => void }) {
  return (
    <div className="flex gap-1.5">
      {(["YES", "NO", "NA"] as Response[]).map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
            value === opt
              ? opt === "YES" ? "bg-green-600 text-white border-green-600"
              : opt === "NO"  ? "bg-red-600 text-white border-red-600"
              :                 "bg-gray-500 text-white border-gray-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          {opt === "NA" ? "N/A" : opt}
        </button>
      ))}
    </div>
  )
}

function PhotoStrip({ photos, onAdd, onRemove }: {
  photos: Photo[]
  onAdd: (photos: Photo[]) => void
  onRemove: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos: Photo[] = files.map(f => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      name: f.name,
    }))
    onAdd(newPhotos)
    e.target.value = ""
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {photos.map(p => (
          <div key={p.id} className="relative group">
            <img src={p.url} alt={p.name} className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <ImagePlus className="h-4 w-4" />
          <span className="text-[9px] font-medium">Add Photo</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleFiles} />
      </div>
      {photos.length > 0 && (
        <p className="text-[10px] text-gray-400 mt-1">{photos.length} photo{photos.length !== 1 ? "s" : ""} attached</p>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Searchable site combobox ─────────────────────────────────────────────────

function SiteCombobox({ value, onChange, onRegionChange }: {
  value: string
  onChange: (v: string) => void
  onRegionChange: (r: string) => void
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? SITE_OPTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
    : SITE_OPTIONS

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const select = (opt: typeof SITE_OPTIONS[0]) => {
    onChange(opt.value)
    onRegionChange(opt.region)
    setQuery(opt.label)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search site..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); onChange(""); onRegionChange(""); setOpen(true) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg text-sm">
          {filtered.map(opt => (
            <li
              key={opt.label}
              onMouseDown={() => select(opt)}
              className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between ${opt.value === value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
            >
              <span>{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.region}</span>
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg px-4 py-3 text-sm text-gray-400">
          No sites found
        </div>
      )}
    </div>
  )
}

function NewInspectionInner() {
  const router = useRouter()
  const params = useSearchParams()
  const isEdit = params.get("edit") === "1"
  const [activeSection, setActiveSection] = useState(1)
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [templateMode, setTemplateMode] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Site info — pre-fill from query params when editing
  const [site, setSite] = useState(params.get("site") ?? "")
  const [technician, setTechnician] = useState(params.get("tech") ?? "")
  const [date, setDate] = useState(params.get("date") ?? new Date().toISOString().split("T")[0])
  const [region, setRegion] = useState(params.get("region") ?? "")
  const [genBrand, setGenBrand] = useState("")
  const [numGens, setNumGens] = useState("")
  const [capacity, setCapacity] = useState("")
  const [gps, setGps] = useState("")
  const [notes, setNotes] = useState("")

  // DC / Battery extras
  const [dcAmps, setDcAmps] = useState<string[]>(DC_PHASES.map(() => ""))
  const [battVolts, setBattVolts] = useState<string[]>(BATTERY_LABELS.map(() => ""))
  const [damagedPanels, setDamagedPanels] = useState("")

  // Progress
  const allItems = sections.slice(1).flatMap(s => s.items)
  const answered = allItems.filter(i => i.response !== "").length
  const progress = allItems.length > 0 ? Math.round((answered / allItems.length) * 100) : 0
  const unanswered = allItems.filter(i => i.response === "").length

  const handleSubmit = async () => {
    setSubmitting(true)
    // Simulate saving (replace with real API call when backend is ready)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => router.push("/work-orders"), 1500)
  }

  // ── Section helpers ──────────────────────────────────────────────────────────

  const updateSection = (secId: number, updater: (s: Section) => Section) =>
    setSections(prev => prev.map(s => s.id === secId ? updater(s) : s))

  const updateItem = (secId: number, itemId: string, updater: (i: ChecklistItem) => ChecklistItem) =>
    updateSection(secId, s => ({ ...s, items: s.items.map(i => i.id === itemId ? updater(i) : i) }))

  const addQuestion = (secId: number) =>
    updateSection(secId, s => ({ ...s, items: [...s.items, makeItem("New question")] }))

  const deleteQuestion = (secId: number, itemId: string) =>
    updateSection(secId, s => ({ ...s, items: s.items.filter(i => i.id !== itemId) }))

  const addSection = () => {
    const newId = Math.max(...sections.map(s => s.id)) + 1
    setSections(prev => [...prev, { id: newId, label: "New Section", editingLabel: true, items: [] }])
    setActiveSection(newId)
  }

  // ── Question row ─────────────────────────────────────────────────────────────

  function QuestionRow({ sec, item }: { sec: Section; item: ChecklistItem }) {
    const [draft, setDraft] = useState(item.question)

    const set = (updater: (i: ChecklistItem) => ChecklistItem) => updateItem(sec.id, item.id, updater)

    const commitEdit = () => {
      set(i => ({ ...i, question: draft.trim() || i.question, editing: false }))
    }

    return (
      <div className="border-b border-gray-50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <div className="flex items-start gap-3 mb-2">
          {/* Question text / edit */}
          <div className="flex-1">
            {item.editing || templateMode ? (
              <div className="flex items-center gap-2">
                <Input
                  className="text-sm flex-1"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") commitEdit() }}
                  autoFocus
                />
                <button type="button" onClick={commitEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="h-4 w-4" /></button>
                <button type="button" onClick={() => set(i => ({ ...i, editing: false }))} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-start gap-2 group">
                <p className="text-sm text-gray-700 flex-1">
                  <span className="text-gray-400 mr-1 font-mono text-xs">{sec.items.indexOf(item) + 1}.</span>
                  {item.question}
                </p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button type="button" onClick={() => set(i => ({ ...i, editing: true }))} className="p-1 text-gray-400 hover:text-blue-600 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => deleteQuestion(sec.id, item.id)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Response buttons */}
          {!item.editing && !templateMode && (
            <ResponseButtons value={item.response} onChange={v => set(i => ({ ...i, response: v }))} />
          )}
        </div>

        {/* NO expands: comment + corrective + photos */}
        {item.response === "NO" && !templateMode && (
          <div className="ml-4 space-y-3 mt-2 p-3 rounded-lg bg-red-50 border border-red-100">
            <div>
              <Label className="text-xs text-gray-600">Comment <span className="text-red-500">*</span></Label>
              <Input className="mt-1 text-sm bg-white" placeholder="Describe the issue..."
                value={item.comment} onChange={e => set(i => ({ ...i, comment: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Corrective Action <span className="text-red-500">*</span></Label>
              <Input className="mt-1 text-sm bg-white" placeholder="Action taken or planned..."
                value={item.corrective} onChange={e => set(i => ({ ...i, corrective: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Photo Evidence (multiple allowed)</Label>
              <PhotoStrip
                photos={item.photos}
                onAdd={newPhotos => set(i => ({ ...i, photos: [...i.photos, ...newPhotos] }))}
                onRemove={pid => set(i => ({ ...i, photos: i.photos.filter(p => p.id !== pid) }))}
              />
            </div>
          </div>
        )}

        {/* Optional photo for YES/NA too */}
        {(item.response === "YES" || item.response === "NA") && !templateMode && (
          <div className="ml-4 mt-2">
            <PhotoStrip
              photos={item.photos}
              onAdd={newPhotos => set(i => ({ ...i, photos: [...i.photos, ...newPhotos] }))}
              onRemove={pid => set(i => ({ ...i, photos: i.photos.filter(p => p.id !== pid) }))}
            />
          </div>
        )}
      </div>
    )
  }

  // ── Section label edit ───────────────────────────────────────────────────────

  function SectionLabelEdit({ sec }: { sec: Section }) {
    const [draft, setDraft] = useState(sec.label)
    return (
      <div className="flex items-center gap-2 px-3 py-2.5">
        <input
          autoFocus
          className="flex-1 rounded border border-blue-300 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") updateSection(sec.id, s => ({ ...s, label: draft.trim() || s.label, editingLabel: false }))
          }}
        />
        <button type="button" onClick={() => updateSection(sec.id, s => ({ ...s, label: draft.trim() || s.label, editingLabel: false }))}>
          <Check className="h-3.5 w-3.5 text-green-600" />
        </button>
      </div>
    )
  }

  // ── Active section data ───────────────────────────────────────────────────────

  const activeSec = sections.find(s => s.id === activeSection)!
  const prevSec = sections[sections.findIndex(s => s.id === activeSection) - 1]
  const nextSec = sections[sections.findIndex(s => s.id === activeSection) + 1]

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-56px)]">

        {/* Top bar */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Inspection" : "New Inspection"}</h1>
                {isEdit && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Editing</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {site ? `${site}${params.get("id") ? ` (${params.get("id")})` : ""}` : "Select a site to begin"}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full bg-red-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-500">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
              {/* Template mode toggle */}
              <button
                type="button"
                onClick={() => setTemplateMode(t => !t)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${templateMode ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <LayoutTemplate className="h-4 w-4" />
                {templateMode ? "Exit Template Edit" : "Edit Template"}
              </button>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-700">
                <BookmarkPlus className="h-4 w-4" /> Save as Template
              </Button>
            </div>
          </div>
          {templateMode && (
            <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <Pencil className="h-3.5 w-3.5" />
              Template edit mode — hover questions to edit or delete them, add new questions, rename sections.
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left nav */}
          <div className="w-56 shrink-0 border-r border-gray-100 bg-white py-4 overflow-y-auto">
            {sections.map(s => (
              <div key={s.id}>
                {s.editingLabel ? (
                  <SectionLabelEdit sec={s} />
                ) : (
                  <div className="flex items-center group">
                    <button
                      onClick={() => setActiveSection(s.id)}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left mx-2 rounded-lg ${
                        activeSection === s.id ? "bg-slate-900 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        activeSection === s.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}>{s.id}</span>
                      {s.label}
                      {s.id !== 1 && (
                        <span className={`ml-auto text-[10px] font-normal ${activeSection === s.id ? "text-white/60" : "text-gray-400"}`}>
                          {s.items.filter(i => i.response !== "").length}/{s.items.length}
                        </span>
                      )}
                    </button>
                    {(templateMode || s.id === activeSection) && s.id !== 1 && (
                      <button
                        type="button"
                        onClick={() => updateSection(s.id, sec => ({ ...sec, editingLabel: true }))}
                        className="opacity-0 group-hover:opacity-100 p-1 mr-2 text-gray-400 hover:text-blue-600 rounded transition-opacity"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addSection}
              className="w-full flex items-center gap-2 px-5 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Section
            </button>
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 p-6">

              {/* ── 1. SITE INFO ── */}
              {activeSection === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label>Site <span className="text-red-500">*</span></Label>
                      <SiteCombobox
                        value={site}
                        onChange={setSite}
                        onRegionChange={setRegion}
                      />
                    </div>
                    <div>
                      <Label>Technician</Label>
                      <select className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={technician} onChange={e => setTechnician(e.target.value)}>
                        <option value="">Select technician</option>
                        {["Jacob Fayiah","Mohammed Konneh","Aaron Gotogo","Khalifa Konneh","Abraham Cole","Moses Kollie"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Inspection Date</Label>
                      <Input className="mt-1" type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>Region</Label>
                      <Input className="mt-1" placeholder="Region" value={region} onChange={e => setRegion(e.target.value)} />
                    </div>
                    <div>
                      <Label>Generator Brand</Label>
                      <Input className="mt-1" value={genBrand} onChange={e => setGenBrand(e.target.value)} />
                    </div>
                    <div>
                      <Label>No. of Generators</Label>
                      <Input className="mt-1" type="number" value={numGens} onChange={e => setNumGens(e.target.value)} />
                    </div>
                    <div>
                      <Label>Capacity (kVA)</Label>
                      <Input className="mt-1" value={capacity} onChange={e => setCapacity(e.target.value)} />
                    </div>
                    <div>
                      <Label>GPS Location</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Not captured" value={gps} readOnly={!gps} className="flex-1" />
                        <Button type="button" variant="outline" className="gap-1.5 shrink-0"
                          onClick={() => navigator.geolocation?.getCurrentPosition(p => setGps(`${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`))}>
                          <MapPin className="h-4 w-4" /> Capture
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="General notes about this visit..." value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveSection(nextSec?.id ?? 2)} className="bg-slate-900 hover:bg-slate-800 text-white">
                      Next: {nextSec?.label} →
                    </Button>
                  </div>
                </div>
              )}

              {/* ── CHECKLIST SECTIONS (2–7+) ── */}
              {activeSection !== 1 && activeSec && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-gray-900">{activeSec.label} Checklist</h2>
                    {templateMode && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Template edit mode</span>
                    )}
                  </div>

                  {activeSec.items.map(item => (
                    <QuestionRow key={item.id} sec={activeSec} item={item} />
                  ))}

                  {activeSec.items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">No questions yet. Add one below.</p>
                  )}

                  {/* Add question */}
                  <button
                    type="button"
                    onClick={() => addQuestion(activeSec.id)}
                    className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Question
                  </button>

                  {/* DC System extras */}
                  {activeSec.id === 3 && !templateMode && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Amp Phase Measurements (A)</p>
                      <div className="grid grid-cols-4 gap-3">
                        {DC_PHASES.map((phase, i) => (
                          <div key={phase}>
                            <Label className="text-xs">{phase}</Label>
                            <Input className="mt-1" type="number" placeholder="0.0" value={dcAmps[i]} onChange={e => { const n = [...dcAmps]; n[i] = e.target.value; setDcAmps(n) }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Battery extras */}
                  {activeSec.id === 4 && !templateMode && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Battery Voltage Measurements (V)</p>
                      <div className="grid grid-cols-4 gap-3">
                        {BATTERY_LABELS.map((label, i) => (
                          <div key={label}>
                            <Label className="text-xs">{label}</Label>
                            <Input className="mt-1" type="number" placeholder="0.0" value={battVolts[i]} onChange={e => { const n = [...battVolts]; n[i] = e.target.value; setBattVolts(n) }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solar extras */}
                  {activeSec.id === 5 && !templateMode && (
                    <div className="mt-4">
                      <Label>Number of Damaged Panels</Label>
                      <Input className="mt-1 w-32" type="number" min={0} placeholder="0" value={damagedPanels} onChange={e => setDamagedPanels(e.target.value)} />
                    </div>
                  )}

                  {/* Last section: summary + submit */}
                  {!nextSec && !templateMode && (
                    <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Inspection Summary</p>
                      <p className="text-xs text-gray-500">
                        {answered} of {allItems.length} questions answered • Completion: <span className="font-semibold text-gray-800">{progress}%</span>
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(prevSec?.id ?? 1)}>
                      ← {prevSec?.label}
                    </Button>
                    {nextSec ? (
                      <Button onClick={() => setActiveSection(nextSec.id)} className="bg-slate-900 hover:bg-slate-800 text-white">
                        Next: {nextSec.label} →
                      </Button>
                    ) : (
                      <Button onClick={() => setShowSubmitModal(true)} className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
                        <Save className="h-4 w-4" /> {isEdit ? "Save Changes" : "Submit Inspection"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      {/* Submit confirmation modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
                <p className="text-lg font-semibold text-gray-900">{isEdit ? "Inspection Updated!" : "Inspection Submitted!"}</p>
                <p className="text-sm text-gray-500 text-center">Redirecting to Work Orders…</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{isEdit ? "Save Changes?" : "Submit Inspection?"}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {unanswered === 0
                        ? "All questions answered. Ready to submit."
                        : `${unanswered} question${unanswered !== 1 ? "s" : ""} unanswered. You can still submit.`}
                    </p>
                  </div>
                </div>
                {unanswered > 0 && (
                  <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                    Unanswered questions will be recorded as incomplete.
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 mb-5 text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between"><span>Site</span><span className="font-medium text-gray-800">{site || "—"}</span></div>
                  <div className="flex justify-between"><span>Technician</span><span className="font-medium text-gray-800">{technician || "—"}</span></div>
                  <div className="flex justify-between"><span>Date</span><span className="font-medium text-gray-800">{date}</span></div>
                  <div className="flex justify-between"><span>Completion</span><span className="font-medium text-gray-800">{progress}%</span></div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowSubmitModal(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-1.5"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {isEdit ? "Saving…" : "Submitting…"}</>
                    ) : (
                      <><Save className="h-4 w-4" /> {isEdit ? "Save Changes" : "Confirm Submit"}</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default function NewInspectionPage() {
  return (
    <Suspense>
      <NewInspectionInner />
    </Suspense>
  )
}
