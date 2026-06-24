"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Phone, Mail, MapPin, Wrench, CheckCircle2, Clock } from "lucide-react"

const technicians = [
  { id: "TECH-001", name: "John Odhiambo", email: "john.o@iptpowertech.com", phone: "+254 712 345 678", region: "Nyanza", sites: 12, completedThisMonth: 8, totalThisMonth: 10, status: "active", lastActive: "2 hours ago", skills: ["Generator", "DC System", "Battery"] },
  { id: "TECH-002", name: "Mary Wanjiku", email: "mary.w@iptpowertech.com", phone: "+254 723 456 789", region: "Nairobi", sites: 18, completedThisMonth: 12, totalThisMonth: 14, status: "on_site", lastActive: "30 min ago", skills: ["Generator", "Solar", "Cleaning"] },
  { id: "TECH-003", name: "Peter Kamau", email: "peter.k@iptpowertech.com", phone: "+254 734 567 890", region: "Coast", sites: 9, completedThisMonth: 5, totalThisMonth: 8, status: "on_site", lastActive: "1 hour ago", skills: ["DC System", "RMS", "Battery"] },
  { id: "TECH-004", name: "Grace Akinyi", email: "grace.a@iptpowertech.com", phone: "+254 745 678 901", region: "Rift Valley", sites: 7, completedThisMonth: 3, totalThisMonth: 6, status: "offline", lastActive: "1 day ago", skills: ["Generator", "DC System"] },
  { id: "TECH-005", name: "David Mwangi", email: "david.m@iptpowertech.com", phone: "+254 756 789 012", region: "Rift Valley", sites: 14, completedThisMonth: 9, totalThisMonth: 11, status: "active", lastActive: "4 hours ago", skills: ["Solar", "Battery", "Cleaning"] },
  { id: "TECH-006", name: "James Njoroge", email: "james.n@iptpowertech.com", phone: "+254 767 890 123", region: "Central", sites: 11, completedThisMonth: 10, totalThisMonth: 10, status: "active", lastActive: "1 hour ago", skills: ["Generator", "DC System", "RMS"] },
  { id: "TECH-007", name: "Susan Wahu", email: "susan.w@iptpowertech.com", phone: "+254 778 901 234", region: "Central", sites: 6, completedThisMonth: 2, totalThisMonth: 5, status: "offline", lastActive: "2 days ago", skills: ["Solar", "Cleaning"] },
  { id: "TECH-008", name: "Alex Ochieng", email: "alex.o@iptpowertech.com", phone: "+254 789 012 345", region: "Nyanza", sites: 10, completedThisMonth: 7, totalThisMonth: 9, status: "active", lastActive: "3 hours ago", skills: ["Generator", "Battery", "Solar"] },
]

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  on_site: { label: "On Site", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  offline: { label: "Offline", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
}

const skillColors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700"]

export default function TechniciansPage() {
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")

  const filtered = technicians.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === "all" || t.region === regionFilter
    return matchSearch && matchRegion
  })

  const stats = {
    total: technicians.length,
    active: technicians.filter(t => t.status === "active").length,
    onSite: technicians.filter(t => t.status === "on_site").length,
    offline: technicians.filter(t => t.status === "offline").length,
  }

  return (
    <AppLayout>
      
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Technicians", value: stats.total, color: "text-blue-600" },
            { label: "Active", value: stats.active, color: "text-green-600" },
            { label: "On Site", value: stats.onSite, color: "text-blue-600" },
            { label: "Offline", value: stats.offline, color: "text-gray-500" },
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
            <Input className="pl-9" placeholder="Search technicians..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="all">All Regions</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Nyanza">Nyanza</option>
            <option value="Coast">Coast</option>
            <option value="Rift Valley">Rift Valley</option>
            <option value="Central">Central</option>
          </select>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Technician
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tech) => {
            const st = statusConfig[tech.status as keyof typeof statusConfig]
            const completion = Math.round((tech.completedThisMonth / tech.totalThisMonth) * 100)
            return (
              <Card key={tech.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                          {tech.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${st.dot}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tech.name}</p>
                        <p className="text-xs font-mono text-blue-600">{tech.id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{tech.region} Region • {tech.sites} sites</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{tech.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{tech.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Last active: {tech.lastActive}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tech.skills.map((skill, i) => (
                      <span key={skill} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${skillColors[i % skillColors.length]}`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Monthly PM Completion</span>
                      <span className="font-semibold text-gray-900">{tech.completedThisMonth}/{tech.totalThisMonth}</span>
                    </div>
                    <Progress value={completion} className={completion >= 90 ? "[&>div]:bg-green-500" : completion >= 70 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"} />
                    <p className={`text-xs font-semibold ${completion >= 90 ? "text-green-600" : completion >= 70 ? "text-amber-600" : "text-red-600"}`}>
                      {completion}% complete
                    </p>
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
