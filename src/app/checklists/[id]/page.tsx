"use client"

import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Pencil, CheckCircle2, XCircle, MinusCircle } from "lucide-react"

// ─── Shared mock data (keyed by work order id) ───────────────────────────────

const WO_DATA: Record<number, {
  site: string; code: number; region: string; tech: string; date: string
  status: "completed" | "in_progress" | "pending_approval" | "open" | "overdue"
  progress: number; generator: string; capacity: string
}> = {
  1418: { site: "Baiyema",          code: 1418, region: "Bong",            tech: "Adam Kiazolu",    date: "2026-06-24", status: "completed",        progress: 100, generator: "Perkins",  capacity: "30 kVA" },
  1443: { site: "Hotel Africa 2",   code: 1443, region: "Montserrado",     tech: "Mohammed Konneh", date: "2026-06-24", status: "completed",        progress: 100, generator: "Pramac",   capacity: "22 kVA" },
  1440: { site: "King Farm",        code: 1440, region: "Montserrado",     tech: "Jacob Fayiah",    date: "2026-06-10", status: "completed",        progress: 100, generator: "Perkins",  capacity: "30 kVA" },
  1508: { site: "Banjor Road",      code: 1508, region: "Montserrado",     tech: "Mohammed Konneh", date: "2026-06-23", status: "completed",        progress: 100, generator: "Cummins",  capacity: "30 kVA" },
  1391: { site: "Ganta Junction",   code: 1391, region: "Nimba",           tech: "John Doe",        date: "2026-06-22", status: "in_progress",      progress: 65,  generator: "Perkins",  capacity: "20 kVA" },
  1376: { site: "Buchanan Central", code: 1376, region: "Grand Bassa",     tech: "Peter Smith",     date: "2026-06-21", status: "in_progress",      progress: 40,  generator: "Pramac",   capacity: "30 kVA" },
  1355: { site: "Kakata Tower",     code: 1355, region: "Margibi",         tech: "Grace Williams",  date: "2026-06-20", status: "pending_approval", progress: 100, generator: "Cummins",  capacity: "30 kVA" },
  1342: { site: "Robertsport",      code: 1342, region: "Grand Cape Mount",tech: "David Johnson",   date: "2026-06-19", status: "open",             progress: 0,   generator: "—",        capacity: "—"      },
  1318: { site: "Sanniquellie",     code: 1318, region: "Nimba",           tech: "Mary Brown",      date: "2026-06-15", status: "overdue",          progress: 20,  generator: "Perkins",  capacity: "20 kVA" },
  1301: { site: "Voinjama North",   code: 1301, region: "Lofa",            tech: "James Clark",     date: "2026-06-12", status: "overdue",          progress: 0,   generator: "—",        capacity: "—"      },
  1289: { site: "Tubmanburg",       code: 1289, region: "Bomi",            tech: "Susan Taylor",    date: "2026-06-18", status: "completed",        progress: 100, generator: "Cummins",  capacity: "30 kVA" },
  1274: { site: "Zwedru Central",   code: 1274, region: "Grand Gedeh",     tech: "Alex Moore",      date: "2026-06-17", status: "completed",        progress: 85,  generator: "Perkins",  capacity: "30 kVA" },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open:             { label: "Open",             className: "bg-gray-100 text-gray-700" },
  in_progress:      { label: "In Progress",      className: "bg-blue-100 text-blue-700" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-100 text-amber-700" },
  completed:        { label: "Completed",        className: "bg-green-100 text-green-700" },
  overdue:          { label: "Overdue",          className: "bg-red-100 text-red-700" },
}

// ─── Mock checklist answers for completed inspections ────────────────────────

type Resp = "YES" | "NO" | "NA" | ""

interface SectionResult {
  label: string
  extras?: { label: string; value: string }[]
  items: { question: string; response: Resp; comment?: string }[]
}

function mockSections(progress: number): SectionResult[] {
  const p = (r: Resp): Resp => progress === 0 ? "" : r
  return [
    {
      label: "Generator",
      extras: [
        { label: "Running Hours", value: progress > 0 ? "18105" : "—" },
        { label: "Fuel Level (%)", value: progress > 0 ? "59.8" : "—" },
        { label: "Generator KVA", value: progress > 0 ? "30" : "—" },
      ],
      items: [
        { question: "Is Automation Working",              response: p("NA") },
        { question: "Change Engine oil & Check Level",    response: p("YES") },
        { question: "Fuel Filter Change",                 response: p("YES") },
        { question: "Oil Filter Change",                  response: p("YES") },
        { question: "Air filter clean and intact",        response: p("YES") },
        { question: "Is the coolant level adequate?",     response: p("YES") },
        { question: "Are battery terminals clean?",       response: p("YES") },
        { question: "Is exhaust smoke normal?",           response: p("YES") },
        { question: "No visible fuel or oil leaks?",      response: p("YES") },
        { question: "Is control panel free of errors?",   response: p("YES") },
        { question: "Is generator earthed properly?",     response: p("YES") },
        { question: "Overall generator condition OK?",    response: p("YES") },
      ],
    },
    {
      label: "DC System",
      extras: [
        { label: "Phase A (A)", value: progress > 0 ? "12.4" : "—" },
        { label: "Phase B (A)", value: progress > 0 ? "11.9" : "—" },
        { label: "Phase C (A)", value: progress > 0 ? "12.1" : "—" },
      ],
      items: [
        { question: "Is DC system functional?",           response: p("YES") },
        { question: "No DC alarms active?",               response: p("YES") },
        { question: "DC cables intact?",                  response: p("YES") },
        { question: "Rectifier modules OK?",              response: p("YES") },
        { question: "Load distribution normal?",          response: p("YES") },
      ],
    },
    {
      label: "Battery",
      extras: [
        { label: "Battery 1 (V)", value: progress > 0 ? "13.2" : "—" },
        { label: "Battery 2 (V)", value: progress > 0 ? "13.1" : "—" },
        { label: "Battery 3 (V)", value: progress > 0 ? "13.0" : "—" },
      ],
      items: [
        { question: "Battery voltage normal?",            response: p("YES") },
        { question: "No swollen or leaking batteries?",   response: p("YES") },
        { question: "Terminals clean and tight?",         response: p("YES") },
      ],
    },
    {
      label: "Solar",
      extras: [],
      items: [
        { question: "All panels clean?",                  response: p("YES") },
        { question: "No cracked or damaged panels?",      response: p("YES") },
        { question: "Inverter operating correctly?",      response: p("YES") },
      ],
    },
    {
      label: "Cleaning",
      extras: [],
      items: [
        { question: "Site interior cleaned?",             response: p("YES") },
        { question: "Site exterior cleaned?",             response: p("YES") },
        { question: "Cable management tidy?",             response: p("YES") },
        { question: "Drainage clear?",                    response: p("YES") },
        { question: "No pest/rodent signs?",              response: p("YES") },
      ],
    },
    {
      label: "RMS",
      extras: [],
      items: [
        { question: "RMS/monitoring system active and reporting?", response: p("YES") },
      ],
    },
  ]
}

// ─── Response badge ───────────────────────────────────────────────────────────

function ResponseBadge({ r }: { r: Resp }) {
  if (!r) return <span className="text-xs text-gray-300">—</span>
  if (r === "YES") return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 className="h-3 w-3" /> Yes
    </span>
  )
  if (r === "NO") return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
      <XCircle className="h-3 w-3" /> No
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      <MinusCircle className="h-3 w-3" /> N/A
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InspectionViewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const numId = Number(id)
  const wo = WO_DATA[numId]

  if (!wo) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-semibold">Inspection not found</p>
          <button onClick={() => router.push("/work-orders")} className="mt-3 text-sm text-red-600 hover:underline">
            ← Back to Work Orders
          </button>
        </div>
      </AppLayout>
    )
  }

  const st = statusConfig[wo.status]
  const sections = mockSections(wo.progress)

  const editUrl = `/checklists/new?edit=1&id=${wo.code}&site=${encodeURIComponent(wo.site)}&tech=${encodeURIComponent(wo.tech)}&region=${encodeURIComponent(wo.region)}&date=${wo.date}`

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Back link */}
        <button
          onClick={() => router.push("/work-orders")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Inspections
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">{wo.site}</h1>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${st.className}`}>{st.label}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="gap-1.5 text-gray-600" onClick={() => window.print()}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button onClick={() => router.push(editUrl)} className="gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-5">
            {[
              { label: "Site Code",   value: wo.code },
              { label: "Region",      value: wo.region },
              { label: "Technician",  value: wo.tech },
              { label: "Date",        value: wo.date },
              { label: "Generator",   value: wo.generator },
              { label: "Capacity",    value: wo.capacity },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-600 transition-all"
                style={{ width: `${wo.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">{wo.progress}%</span>
          </div>
        </div>

        {/* Checklist sections */}
        {sections.map((sec) => (
          <div key={sec.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">{sec.label}</h2>

            {/* Section extras (running hours, voltages, etc.) */}
            {sec.extras && sec.extras.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {sec.extras.map(e => (
                  <div key={e.label} className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{e.label}</p>
                    <p className="text-sm font-bold text-gray-900">{e.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Questions */}
            <div className="divide-y divide-gray-50">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <p className="text-sm text-gray-700">{item.question}</p>
                  <ResponseBadge r={item.response} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom actions */}
        <div className="flex justify-between pb-6">
          <Button variant="outline" onClick={() => router.push("/work-orders")}>
            ← Back to Inspections
          </Button>
          <Button onClick={() => router.push(editUrl)} className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
            <Pencil className="h-4 w-4" /> Edit Inspection
          </Button>
        </div>

      </div>
    </AppLayout>
  )
}
