"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Trash2, Pencil, User, ClipboardList } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
  { name: "Grand Cape",  sites: 14,  techs: 1,  inspections: 4 },
  { name: "Sinoe",       sites: 11,  techs: 1,  inspections: 2 },
  { name: "Gbarpolu",    sites: 8,   techs: 1,  inspections: 2 },
  { name: "Bomi",        sites: 7,   techs: 1,  inspections: 1 },
  { name: "River Cess",  sites: 5,   techs: 1,  inspections: 0 },
]

const totalSites = countyData.reduce((s, c) => s + c.sites, 0)
const totalTechs = countyData.reduce((s, c) => s + c.techs, 0)

export default function RegionsPage() {
  const [search, setSearch] = useState("")
  const [regions, setRegions] = useState(countyData)

  const filtered = regions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  const remove = (name: string) => setRegions(regions.filter(r => r.name !== name))

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage coverage regions and county data</p>
          </div>
          <Button className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4" /> Add Region
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              value: countyData.length,
              label: "Regions Covered",
              icon: (
                <svg className="h-9 w-9 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              ),
            },
            {
              value: totalSites,
              label: "Total Sites",
              icon: (
                <svg className="h-9 w-9 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l-2.5 5h5L12 2z"/>
                  <path d="M9.5 7L5 19h14L14.5 7"/>
                  <line x1="12" y1="7" x2="12" y2="19"/>
                  <path d="M7.5 11c-1.5.5-2.5 1-2.5 1M16.5 11c1.5.5 2.5 1 2.5 1"/>
                </svg>
              ),
            },
            {
              value: totalTechs,
              label: "Technicians",
              icon: (
                <svg className="h-9 w-9 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="7" r="3"/>
                  <circle cx="17" cy="8" r="2.5"/>
                  <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                  <path d="M17 13c2.2 0 4 1.8 4 4"/>
                </svg>
              ),
            },
          ].map(({ value, label, icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-sm">
              {icon}
              <p className="text-3xl font-bold text-gray-900 mt-3">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Sites &amp; Inspections by Region</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={countyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                formatter={(value) => value === "sites" ? "Sites" : "PM"}
              />
              <Bar dataKey="sites" fill="#1e3a5f" radius={[3, 3, 0, 0]} name="sites" />
              <Bar dataKey="inspections" fill="#dc2626" radius={[3, 3, 0, 0]} name="PM" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* County list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              All {countyData.length} Counties
            </p>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input className="pl-9" placeholder="Search county..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filtered.map(county => (
              <div key={county.name} className="bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
                    <span className="font-semibold text-gray-900 text-sm">{county.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-300 hover:text-blue-500 transition-colors rounded">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(county.name)} className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l-2 4h4L12 2z"/><path d="M10 6L6 18h12L14 6"/><line x1="12" y1="6" x2="12" y2="18"/>
                    </svg>
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
    </AppLayout>
  )
}
