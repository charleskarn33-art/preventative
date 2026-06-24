"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Calendar, Radio, User, RepeatIcon, ChevronRight, Pencil, Trash2 } from "lucide-react"

const schedules = [
  { id: "SCH-001", site: "KSM-001 Kisumu North", region: "Nyanza", type: "daily", frequency: "Daily", tech: "John Odhiambo", nextDue: "2024-01-16", lastCompleted: "2024-01-15", active: true },
  { id: "SCH-002", site: "KSM-001 Kisumu North", region: "Nyanza", type: "weekly", frequency: "Weekly", tech: "John Odhiambo", nextDue: "2024-01-20", lastCompleted: "2024-01-13", active: true },
  { id: "SCH-003", site: "KSM-001 Kisumu North", region: "Nyanza", type: "monthly", frequency: "Monthly", tech: "John Odhiambo", nextDue: "2024-02-10", lastCompleted: "2024-01-10", active: true },
  { id: "SCH-004", site: "NRB-045 Westlands", region: "Nairobi", type: "daily", frequency: "Daily", tech: "Mary Wanjiku", nextDue: "2024-01-16", lastCompleted: "2024-01-15", active: true },
  { id: "SCH-005", site: "NRB-045 Westlands", region: "Nairobi", type: "weekly", frequency: "Weekly", tech: "Mary Wanjiku", nextDue: "2024-01-19", lastCompleted: "2024-01-12", active: true },
  { id: "SCH-006", site: "MSA-012 Mombasa CBD", region: "Coast", type: "monthly", frequency: "Monthly", tech: "Peter Kamau", nextDue: "2024-02-08", lastCompleted: "2024-01-08", active: false },
  { id: "SCH-007", site: "ELD-003 Eldoret South", region: "Rift Valley", type: "weekly", frequency: "Weekly", tech: "Grace Akinyi", nextDue: "2024-01-17", lastCompleted: "2024-01-10", active: true },
  { id: "SCH-008", site: "NKR-007 Nakuru Central", region: "Rift Valley", type: "monthly", frequency: "Monthly", tech: "David Mwangi", nextDue: "2024-02-11", lastCompleted: "2024-01-11", active: true },
]

const typeColors = {
  daily: "info",
  weekly: "secondary",
  monthly: "default",
} as const

export default function PMSchedulePage() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = schedules.filter((s) => {
    const matchSearch = s.site.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || s.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <AppLayout>
      <Header title="PM Schedule" subtitle="Configure and manage recurring preventive maintenance schedules" />
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Schedules", value: schedules.length, color: "text-blue-600" },
            { label: "Daily PM", value: schedules.filter(s => s.type === "daily").length, color: "text-cyan-600" },
            { label: "Weekly PM", value: schedules.filter(s => s.type === "weekly").length, color: "text-purple-600" },
            { label: "Monthly PM", value: schedules.filter(s => s.type === "monthly").length, color: "text-green-600" },
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
            <Input placeholder="Search by site name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="PM Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="daily">Daily PM</SelectItem>
              <SelectItem value="weekly">Weekly PM</SelectItem>
              <SelectItem value="monthly">Monthly PM</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New PM Schedule
          </Button>
        </div>

        {/* Schedule list */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Schedule ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Site</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">PM Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned Tech</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Next Due</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Completed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((sch) => (
                <tr key={sch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-blue-600">{sch.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{sch.site}</p>
                        <p className="text-xs text-gray-500">{sch.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={typeColors[sch.type as keyof typeof typeColors]}>
                      <RepeatIcon className="h-2.5 w-2.5 mr-1" />
                      {sch.frequency}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">
                        {sch.tech.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-xs text-gray-700">{sch.tech}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-gray-700">{sch.nextDue}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{sch.lastCompleted ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={sch.active ? "success" : "secondary"}>
                      {sch.active ? "Active" : "Paused"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Schedule Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New PM Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tower Site *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a site..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ksm001">KSM-001 Kisumu North</SelectItem>
                    <SelectItem value="nrb045">NRB-045 Westlands</SelectItem>
                    <SelectItem value="msa012">MSA-012 Mombasa CBD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>PM Type *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily PM</SelectItem>
                    <SelectItem value="weekly">Weekly PM</SelectItem>
                    <SelectItem value="monthly">Monthly PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned Technician *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select tech..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Odhiambo</SelectItem>
                    <SelectItem value="mary">Mary Wanjiku</SelectItem>
                    <SelectItem value="peter">Peter Kamau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date *</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label>End Date (optional)</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
