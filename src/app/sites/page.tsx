"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Radio,
  Search,
  Plus,
  MapPin,
  Calendar,
  User,
  ChevronRight,
  Filter,
} from "lucide-react"

const sites = [
  { id: "KSM-001", name: "Kisumu North", region: "Nyanza", county: "Kisumu", type: "Monopole", status: "active", tech: "John Odhiambo", lastPM: "2024-01-10", nextPM: "2024-01-17", lat: -0.1022, lng: 34.7617, compliance: 97 },
  { id: "NRB-045", name: "Westlands Tower", region: "Nairobi", county: "Nairobi", type: "Self Support", status: "active", tech: "Mary Wanjiku", lastPM: "2024-01-12", nextPM: "2024-01-19", lat: -1.2634, lng: 36.8041, compliance: 95 },
  { id: "MSA-012", name: "Mombasa CBD", region: "Coast", county: "Mombasa", type: "Rooftop", status: "under_maintenance", tech: "Peter Kamau", lastPM: "2024-01-08", nextPM: "2024-01-15", lat: -4.0435, lng: 39.6682, compliance: 88 },
  { id: "ELD-003", name: "Eldoret South", region: "Rift Valley", county: "Uasin Gishu", type: "Guyed Tower", status: "active", tech: "Grace Akinyi", lastPM: "2024-01-05", nextPM: "2024-01-12", lat: 0.5143, lng: 35.2698, compliance: 72 },
  { id: "NKR-007", name: "Nakuru Central", region: "Rift Valley", county: "Nakuru", type: "Monopole", status: "active", tech: "David Mwangi", lastPM: "2024-01-11", nextPM: "2024-01-18", lat: -0.3031, lng: 36.0800, compliance: 91 },
  { id: "NYR-002", name: "Nyeri Hill", region: "Central", county: "Nyeri", type: "Self Support", status: "active", tech: "James Njoroge", lastPM: "2024-01-09", nextPM: "2024-01-16", lat: -0.4169, lng: 36.9558, compliance: 99 },
  { id: "KRN-018", name: "Kirinyaga East", region: "Central", county: "Kirinyaga", type: "Monopole", status: "inactive", tech: "Susan Wahu", lastPM: "2024-01-03", nextPM: "2024-01-10", lat: -0.6167, lng: 37.3667, compliance: 45 },
  { id: "HOM-005", name: "Homa Bay Central", region: "Nyanza", county: "Homa Bay", type: "Guyed Tower", status: "active", tech: "Alex Ochieng", lastPM: "2024-01-13", nextPM: "2024-01-20", lat: -0.5273, lng: 34.4571, compliance: 93 },
]

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  under_maintenance: { label: "Under Maintenance", variant: "warning" as const },
  decommissioned: { label: "Decommissioned", variant: "destructive" as const },
}

export default function SitesPage() {
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("all")
  const [status, setStatus] = useState("all")
  const [view, setView] = useState<"grid" | "table">("grid")

  const filtered = sites.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === "all" || s.region === region
    const matchStatus = status === "all" || s.status === status
    return matchSearch && matchRegion && matchStatus
  })

  return (
    <AppLayout>
      
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Sites", value: sites.length, color: "text-blue-600" },
            { label: "Active", value: sites.filter(s => s.status === "active").length, color: "text-green-600" },
            { label: "Under Maintenance", value: sites.filter(s => s.status === "under_maintenance").length, color: "text-amber-600" },
            { label: "Inactive", value: sites.filter(s => s.status === "inactive").length, color: "text-gray-500" },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search by site ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Nairobi">Nairobi</SelectItem>
              <SelectItem value="Nyanza">Nyanza</SelectItem>
              <SelectItem value="Coast">Coast</SelectItem>
              <SelectItem value="Rift Valley">Rift Valley</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Site
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500">Showing {filtered.length} of {sites.length} sites</p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((site) => {
            const st = statusConfig[site.status as keyof typeof statusConfig]
            const complianceColor = site.compliance >= 90 ? "text-green-600" : site.compliance >= 75 ? "text-amber-600" : "text-red-600"
            return (
              <Card key={site.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <Radio className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold text-blue-600">{site.id}</p>
                        <p className="font-semibold text-gray-900">{site.name}</p>
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{site.county}, {site.region}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Radio className="h-3 w-3" />
                      <span>{site.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <User className="h-3 w-3" />
                      <span className="truncate">{site.tech}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {site.nextPM}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">PM Compliance</p>
                      <p className={`text-lg font-bold ${complianceColor}`}>{site.compliance}%</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 gap-1 group-hover:bg-blue-50">
                      View Site <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
