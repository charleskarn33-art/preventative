"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Bell,
  Users,
  Shield,
  Database,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <Header title="Settings" subtitle="Platform configuration and system preferences" />
      <div className="p-6">
        <Tabs defaultValue="organization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="organization" className="gap-1.5 text-xs">
              <Building2 className="h-3.5 w-3.5" /> Organization
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" /> User Roles
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" /> Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input className="mt-1" defaultValue="TelcoCare Operations Ltd" />
                  </div>
                  <div>
                    <Label>Platform Name</Label>
                    <Input className="mt-1" defaultValue="TelcoCare PM" />
                  </div>
                  <div>
                    <Label>Primary Region</Label>
                    <Input className="mt-1" defaultValue="Kenya" />
                  </div>
                  <div>
                    <Label>Default Time Zone</Label>
                    <Select defaultValue="eat">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eat">Africa/Nairobi (EAT +3)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="wat">Africa/Lagos (WAT +1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Work Order Prefix</Label>
                    <Input className="mt-1" defaultValue="WO" />
                  </div>
                  <div>
                    <Label>PM Compliance Target (%)</Label>
                    <Input className="mt-1" type="number" defaultValue={95} min={0} max={100} />
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">PM Overdue Thresholds</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">Daily PM (hours)</Label>
                      <Input className="mt-1" type="number" defaultValue={4} />
                    </div>
                    <div>
                      <Label className="text-xs">Weekly PM (days)</Label>
                      <Input className="mt-1" type="number" defaultValue={2} />
                    </div>
                    <div>
                      <Label className="text-xs">Monthly PM (days)</Label>
                      <Input className="mt-1" type="number" defaultValue={5} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSave} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "PM Due Reminder", desc: "Notify technician and supervisor when PM is due", enabled: true },
                  { label: "Overdue PM Alert", desc: "Send alerts when PM becomes overdue", enabled: true },
                  { label: "Work Order Assignment", desc: "Notify technician when assigned a work order", enabled: true },
                  { label: "Checklist Submitted", desc: "Notify supervisor when checklist is submitted", enabled: true },
                  { label: "PM Approved", desc: "Notify technician when PM is approved", enabled: true },
                  { label: "Daily Summary Email", desc: "Send daily PM status summary to managers", enabled: false },
                  { label: "Weekly Compliance Report", desc: "Auto-send weekly compliance reports", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="sr-only" defaultChecked={item.enabled} />
                      <div className={`h-5 w-9 rounded-full transition-colors ${item.enabled ? "bg-blue-600" : "bg-gray-200"}`}>
                        <div className={`h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${item.enabled ? "ml-4" : "ml-0.5"}`} />
                      </div>
                    </label>
                  </div>
                ))}
                <Button onClick={handleSave} className="gap-1.5 mt-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Roles & Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      role: "Super Admin",
                      desc: "Full platform access including user management, settings, and all data",
                      permissions: ["All modules", "User management", "Settings", "Reports", "Approvals"],
                      color: "bg-red-100 text-red-700",
                    },
                    {
                      role: "Maintenance Manager",
                      desc: "Manage PM schedules, work orders, and view all reports",
                      permissions: ["PM Schedule", "Work Orders", "Sites", "Reports", "Approvals"],
                      color: "bg-blue-100 text-blue-700",
                    },
                    {
                      role: "Regional Supervisor",
                      desc: "Oversee regional PM operations and approve completed work orders",
                      permissions: ["Work Orders (region)", "Checklists", "Approvals", "Reports (region)"],
                      color: "bg-purple-100 text-purple-700",
                    },
                    {
                      role: "Field Technician",
                      desc: "Complete assigned PM work orders and submit checklists",
                      permissions: ["Assigned Work Orders", "PM Checklists", "Photo Upload", "Mobile App"],
                      color: "bg-green-100 text-green-700",
                    },
                  ].map((role) => (
                    <div key={role.role} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.color}`}>{role.role}</span>
                          </div>
                          <p className="text-sm text-gray-600">{role.desc}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {role.permissions.map(p => (
                              <span key={p} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">PM Compliance Rules</h3>
                  <div className="space-y-3">
                    {[
                      { label: "N/A responses excluded from compliance calculation", checked: true },
                      { label: "NO response requires mandatory comment", checked: true },
                      { label: "NO response requires mandatory photo evidence", checked: true },
                      { label: "NO response requires corrective action", checked: true },
                      { label: "Supervisor approval required before PM is counted as complete", checked: true },
                      { label: "Auto-generate next work order after approval", checked: true },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Checklist Categories (Monthly PM)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Generator", "DC System", "Battery", "Solar", "Cleaning", "RMS"].map(cat => (
                      <label key={cat} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSave} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
