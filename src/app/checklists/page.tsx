"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  Battery,
  Sun,
  Cpu,
  Sparkles,
  Wifi,
  CheckCircle2,
  XCircle,
  Minus,
  Upload,
  AlertTriangle,
  Save,
  Send,
} from "lucide-react"

type Response = "yes" | "no" | "na" | null

interface ChecklistItemData {
  key: string
  label: string
  response: Response
  comment: string
  photo: File | null
  corrective_action: string
}

const generatorQuestions = [
  "Is Automation Working?",
  "Change Engine Oil & Check Level",
  "Fuel Filter Change",
  "Oil Filter Change",
  "Air Filter Clean and Intact",
  "Check Breakers & Power Cable",
  "Check Radiator",
  "Is the Solenoid Connected & Operational?",
  "Battery Charger Operational",
  "Check Oil Sensor Protection",
  "Radiator Hose Free From Cracks And Leaks",
  "Is The Machine Burning Oil?",
]

const dcSystemQuestions = [
  "All Rectifier Modules Operational",
  "Breakers Properly Labeled",
  "DC Cables In Good Condition",
  "Alarms Tested And Functional",
  "Grounding Connections Secure",
]

const batteryQuestions = [
  "Terminals Clean And Tight",
  "Check Electrolyte Level",
  "Check Cell Terminal",
]

const solarQuestions = [
  "Panels Clean And Free Of Debris",
  "Check If There Is Any Obstruction Or Shadow",
  "Is The Solar Panel Clean",
]

const cleaningQuestions = [
  "Shelter/Cabinet Cleaned",
  "Site Clear Of Vegetation",
  "No Debris Or Waste On Site",
  "Cable Trays Clean And Organized",
  "Fence And Gate In Good Condition",
]

const rmsQuestions = [
  "RMS Installed",
]

function initItems(questions: string[]): ChecklistItemData[] {
  return questions.map((q, i) => ({
    key: `q${i}`,
    label: q,
    response: null,
    comment: "",
    photo: null,
    corrective_action: "",
  }))
}

function ResponseSelector({
  value,
  onChange,
}: {
  value: Response
  onChange: (v: Response) => void
}) {
  const options: { val: Response; label: string; icon: typeof CheckCircle2; color: string; active: string }[] = [
    { val: "yes", label: "YES", icon: CheckCircle2, color: "text-green-600 border-green-200 hover:border-green-400", active: "bg-green-600 text-white border-green-600" },
    { val: "no", label: "NO", icon: XCircle, color: "text-red-600 border-red-200 hover:border-red-400", active: "bg-red-600 text-white border-red-600" },
    { val: "na", label: "N/A", icon: Minus, color: "text-gray-500 border-gray-200 hover:border-gray-400", active: "bg-gray-500 text-white border-gray-500" },
  ]

  return (
    <div className="flex gap-2">
      {options.map(({ val, label, icon: Icon, color, active }) => (
        <button
          key={val}
          onClick={() => onChange(value === val ? null : val)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            value === val ? active : `bg-white ${color}`
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  )
}

function ChecklistSection({
  title,
  items,
  onUpdate,
}: {
  title: string
  items: ChecklistItemData[]
  onUpdate: (idx: number, field: keyof ChecklistItemData, value: string | Response | File | null) => void
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <Card key={item.key} className={item.response === "no" ? "border-red-200 bg-red-50/30" : ""}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                </div>
                <ResponseSelector
                  value={item.response}
                  onChange={(v) => onUpdate(idx, "response", v)}
                />
              </div>

              {/* Required fields when NO is selected */}
              {item.response === "no" && (
                <div className="space-y-3 pl-7 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Comment, photo, and corrective action required</span>
                  </div>
                  <div className="grid gap-2">
                    <div>
                      <Label className="text-xs">Comment *</Label>
                      <Textarea
                        placeholder="Describe the issue found..."
                        value={item.comment}
                        onChange={(e) => onUpdate(idx, "comment", e.target.value)}
                        className="mt-1 min-h-[60px] text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Corrective Action Required *</Label>
                      <Textarea
                        placeholder="Describe the corrective action needed..."
                        value={item.corrective_action}
                        onChange={(e) => onUpdate(idx, "corrective_action", e.target.value)}
                        className="mt-1 min-h-[60px] text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Photo Evidence *</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          {item.photo ? item.photo.name : "Upload photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onUpdate(idx, "photo", e.target.files?.[0] ?? null)}
                          />
                        </label>
                        {item.photo && (
                          <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional comment for YES / N/A */}
              {item.response && item.response !== "no" && (
                <div className="pl-7">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Optional comment..."
                      value={item.comment}
                      onChange={(e) => onUpdate(idx, "comment", e.target.value)}
                      className="text-xs h-8"
                    />
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-500 hover:border-blue-400 transition-colors">
                      <Upload className="h-3 w-3" />
                      Photo
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ChecklistsPage() {
  const [generatorItems, setGeneratorItems] = useState(initItems(generatorQuestions))
  const [dcItems, setDcItems] = useState(initItems(dcSystemQuestions))
  const [batteryItems, setBatteryItems] = useState(initItems(batteryQuestions))
  const [solarItems, setSolarItems] = useState(initItems(solarQuestions))
  const [cleaningItems, setCleaningItems] = useState(initItems(cleaningQuestions))
  const [rmsItems, setRmsItems] = useState(initItems(rmsQuestions))

  // DC measurements
  const [dcAmps, setDcAmps] = useState<string[]>(Array(7).fill(""))
  // Battery voltages
  const [batteryVoltages, setBatteryVoltages] = useState<string[]>(Array(8).fill(""))
  // Solar
  const [damagedPanels, setDamagedPanels] = useState("")

  function makeUpdater(setter: React.Dispatch<React.SetStateAction<ChecklistItemData[]>>) {
    return (idx: number, field: keyof ChecklistItemData, value: string | Response | File | null) => {
      setter((prev) => {
        const next = [...prev]
        next[idx] = { ...next[idx], [field]: value }
        return next
      })
    }
  }

  function calcCompliance(items: ChecklistItemData[]) {
    const applicable = items.filter(i => i.response !== "na" && i.response !== null)
    const yes = applicable.filter(i => i.response === "yes").length
    if (applicable.length === 0) return null
    return Math.round((yes / applicable.length) * 100)
  }

  const allItems = [...generatorItems, ...dcItems, ...batteryItems, ...solarItems, ...cleaningItems, ...rmsItems]
  const totalCompliance = calcCompliance(allItems)
  const answered = allItems.filter(i => i.response !== null).length

  const categories = [
    { key: "generator", label: "Generator", icon: Zap, items: generatorItems, setter: setGeneratorItems },
    { key: "dc_system", label: "DC System", icon: Cpu, items: dcItems, setter: setDcItems },
    { key: "battery", label: "Battery", icon: Battery, items: batteryItems, setter: setBatteryItems },
    { key: "solar", label: "Solar", icon: Sun, items: solarItems, setter: setSolarItems },
    { key: "cleaning", label: "Cleaning", icon: Sparkles, items: cleaningItems, setter: setCleaningItems },
    { key: "rms", label: "RMS", icon: Wifi, items: rmsItems, setter: setRmsItems },
  ]

  return (
    <AppLayout>
      
      <div className="p-6 space-y-4">
        {/* Work order info banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div><span className="text-gray-500">Work Order:</span> <span className="font-semibold text-blue-700">WO-2024-002</span></div>
              <div><span className="text-gray-500">Site:</span> <span className="font-semibold">NRB-045 Westlands Tower</span></div>
              <div><span className="text-gray-500">PM Type:</span> <span className="font-semibold">Weekly PM</span></div>
              <div><span className="text-gray-500">Technician:</span> <span className="font-semibold">Mary Wanjiku</span></div>
              <div><span className="text-gray-500">Due:</span> <span className="font-semibold">2024-01-16</span></div>
              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-bold text-blue-700">{answered}/{allItems.length} answered</p>
                </div>
                {totalCompliance !== null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Compliance</p>
                    <p className={`font-bold text-lg ${totalCompliance >= 90 ? "text-green-600" : totalCompliance >= 75 ? "text-amber-600" : "text-red-600"}`}>
                      {totalCompliance}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist tabs */}
        <Tabs defaultValue="generator">
          <TabsList className="flex-wrap h-auto gap-1 p-1">
            {categories.map(({ key, label, icon: Icon, items }) => {
              const c = calcCompliance(items)
              const answered = items.filter(i => i.response !== null).length
              return (
                <TabsTrigger key={key} value={key} className="gap-1.5 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span className="ml-1 rounded-full bg-gray-200 px-1.5 text-[10px] font-semibold">
                    {answered}/{items.length}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="generator" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                    <Zap className="h-4 w-4 text-orange-600" />
                  </div>
                  Generator Checklist
                  <Badge variant="secondary" className="ml-2">{generatorQuestions.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistSection title="Generator" items={generatorItems} onUpdate={makeUpdater(setGeneratorItems)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dc_system" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <Cpu className="h-4 w-4 text-blue-600" />
                  </div>
                  DC System Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ChecklistSection title="DC System" items={dcItems} onUpdate={makeUpdater(setDcItems)} />
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Clamp Meter Amp Load Measurements</h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {dcAmps.map((val, i) => (
                      <div key={i}>
                        <Label className="text-xs">Phase {i + 1}</Label>
                        <div className="relative mt-1">
                          <Input
                            type="number"
                            placeholder="0.0"
                            value={val}
                            onChange={(e) => {
                              const next = [...dcAmps]
                              next[i] = e.target.value
                              setDcAmps(next)
                            }}
                            className="pr-10 text-sm"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">A</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="battery" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <Battery className="h-4 w-4 text-green-600" />
                  </div>
                  Battery Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ChecklistSection title="Battery" items={batteryItems} onUpdate={makeUpdater(setBatteryItems)} />
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Battery Voltage Measurements</h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {batteryVoltages.map((val, i) => (
                      <div key={i}>
                        <Label className="text-xs">Battery {i + 1}</Label>
                        <div className="relative mt-1">
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={val}
                            onChange={(e) => {
                              const next = [...batteryVoltages]
                              next[i] = e.target.value
                              setBatteryVoltages(next)
                            }}
                            className="pr-10 text-sm"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">V</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solar" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50">
                    <Sun className="h-4 w-4 text-yellow-600" />
                  </div>
                  Solar Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ChecklistSection title="Solar" items={solarItems} onUpdate={makeUpdater(setSolarItems)} />
                <Separator />
                <div className="max-w-xs">
                  <Label className="text-sm font-semibold">Number of Damaged Solar Panels On Site</Label>
                  <div className="relative mt-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={damagedPanels}
                      onChange={(e) => setDamagedPanels(e.target.value)}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">panels</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cleaning" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  Cleaning Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistSection title="Cleaning" items={cleaningItems} onUpdate={makeUpdater(setCleaningItems)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rms" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <Wifi className="h-4 w-4 text-indigo-600" />
                  </div>
                  RMS Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistSection title="RMS" items={rmsItems} onUpdate={makeUpdater(setRmsItems)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">
            {answered < allItems.length ? (
              <span className="text-amber-600">⚠ {allItems.length - answered} questions remaining</span>
            ) : (
              <span className="text-green-600">✓ All questions answered</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button className="gap-2" disabled={answered < allItems.length}>
              <Send className="h-4 w-4" /> Submit for Approval
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
