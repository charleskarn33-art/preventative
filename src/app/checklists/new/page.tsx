"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, LayoutTemplate, BookmarkPlus, MapPin, Plus, Camera } from "lucide-react"

const sections = [
  { id: 1, label: "Site Info" },
  { id: 2, label: "Generator" },
  { id: 3, label: "DC System" },
  { id: 4, label: "Battery" },
  { id: 5, label: "Solar" },
  { id: 6, label: "Cleaning" },
  { id: 7, label: "RMS" },
]

const generatorQuestions = [
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
]

const dcQuestions = [
  "Is the rectifier operating normally?",
  "Are all DC breakers in good condition?",
  "Is the DC output voltage within specification?",
  "Are there any alarms on the DC system?",
  "Is the earthing/grounding system intact?",
]

const dcPhases = ["L1-N", "L2-N", "L3-N", "L1-L2", "L2-L3", "L1-L3", "Earth"]

const batteryQuestions = [
  "Are all batteries connected and secure?",
  "Are battery terminals free from corrosion?",
  "Is the battery room/cabinet ventilated?",
]

const batteryLabels = ["Battery 1", "Battery 2", "Battery 3", "Battery 4", "Battery 5", "Battery 6", "Battery 7", "Battery 8"]

const solarQuestions = [
  "Are solar panels clean and free from debris?",
  "Are all panel connections secure?",
  "Is the solar charge controller operating normally?",
]

const cleaningQuestions = [
  "Is the site compound clean and free from vegetation?",
  "Are all equipment cabinets cleaned externally?",
  "Is the shelter/BTS room cleaned?",
  "Are drainage channels clear and unblocked?",
  "Is the site perimeter fence intact?",
]

const rmsQuestions = [
  "Is the RMS/monitoring system active and reporting?",
]

type Response = "YES" | "NO" | "NA" | ""

interface ChecklistItem {
  response: Response
  comment: string
  corrective: string
}

const emptyItem = (): ChecklistItem => ({ response: "", comment: "", corrective: "" })

function ResponseButtons({ value, onChange }: { value: Response; onChange: (v: Response) => void }) {
  return (
    <div className="flex gap-1.5">
      {(["YES", "NO", "NA"] as Response[]).map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
            value === opt
              ? opt === "YES" ? "bg-green-600 text-white border-green-600"
              : opt === "NO" ? "bg-red-600 text-white border-red-600"
              : "bg-gray-500 text-white border-gray-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          {opt === "NA" ? "N/A" : opt}
        </button>
      ))}
    </div>
  )
}

export default function NewInspectionPage() {
  const [activeSection, setActiveSection] = useState(1)

  // Site info
  const [site, setSite] = useState("")
  const [technician, setTechnician] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [region, setRegion] = useState("")
  const [genBrand, setGenBrand] = useState("")
  const [numGens, setNumGens] = useState("")
  const [capacity, setCapacity] = useState("")
  const [gps, setGps] = useState("")
  const [notes, setNotes] = useState("")

  // Generator checklist
  const [genItems, setGenItems] = useState<ChecklistItem[]>(generatorQuestions.map(emptyItem))
  // DC checklist
  const [dcItems, setDcItems] = useState<ChecklistItem[]>(dcQuestions.map(emptyItem))
  const [dcAmps, setDcAmps] = useState<string[]>(dcPhases.map(() => ""))
  // Battery
  const [battItems, setBattItems] = useState<ChecklistItem[]>(batteryQuestions.map(emptyItem))
  const [battVolts, setBattVolts] = useState<string[]>(batteryLabels.map(() => ""))
  // Solar
  const [solarItems, setSolarItems] = useState<ChecklistItem[]>(solarQuestions.map(emptyItem))
  const [damagedPanels, setDamagedPanels] = useState("")
  // Cleaning
  const [cleanItems, setCleanItems] = useState<ChecklistItem[]>(cleaningQuestions.map(emptyItem))
  // RMS
  const [rmsItems, setRmsItems] = useState<ChecklistItem[]>(rmsQuestions.map(emptyItem))

  // Progress calculation
  const allItems = [...genItems, ...dcItems, ...battItems, ...solarItems, ...cleanItems, ...rmsItems]
  const answered = allItems.filter(i => i.response !== "").length
  const progress = Math.round((answered / allItems.length) * 100)

  const updateItem = (
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    idx: number,
    field: keyof ChecklistItem,
    value: string
  ) => {
    const next = [...list]
    next[idx] = { ...next[idx], [field]: value }
    setList(next)
  }

  function QuestionRow({
    idx, question, item,
    list, setList,
  }: {
    idx: number; question: string; item: ChecklistItem
    list: ChecklistItem[]; setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  }) {
    return (
      <div className="border-b border-gray-50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className="text-sm text-gray-700 flex-1">{idx + 1}. {question}</p>
          <ResponseButtons
            value={item.response}
            onChange={v => updateItem(list, setList, idx, "response", v)}
          />
        </div>
        {item.response === "NO" && (
          <div className="ml-4 space-y-2 mt-2">
            <div>
              <Label className="text-xs text-gray-500">Comment *</Label>
              <Input
                className="mt-1 text-sm"
                placeholder="Describe the issue..."
                value={item.comment}
                onChange={e => updateItem(list, setList, idx, "comment", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Corrective Action *</Label>
              <Input
                className="mt-1 text-sm"
                placeholder="Action taken or planned..."
                value={item.corrective}
                onChange={e => updateItem(list, setList, idx, "corrective", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        {/* Top bar */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Inspection</h1>
              <p className="text-sm text-gray-500 mt-0.5">{site ? site : "Select a site to begin"}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress */}
              <div className="flex items-center gap-2 mr-2">
                <div className="w-32 h-2 rounded-full bg-red-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-500">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-700">
                <LayoutTemplate className="h-4 w-4" /> Load Template
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-700">
                <BookmarkPlus className="h-4 w-4" /> Save as Template
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left section nav */}
          <div className="w-56 shrink-0 border-r border-gray-100 bg-white p-4 space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeSection === s.id
                    ? "bg-slate-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  activeSection === s.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  {s.id}
                </span>
                {s.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
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
                      <select
                        className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={site}
                        onChange={e => setSite(e.target.value)}
                      >
                        <option value="">Select a site</option>
                        <option>Baiyema (1418)</option>
                        <option>Hotel Africa 2 (1443)</option>
                        <option>King Farm (1440)</option>
                        <option>Banjor Road (1508)</option>
                        <option>Gbarnga 8 (1801)</option>
                        <option>Duport Road Junction (1179)</option>
                        <option>Public School Community (1347)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Technician</Label>
                      <select
                        className="mt-1 w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={technician}
                        onChange={e => setTechnician(e.target.value)}
                      >
                        <option value="">Select or type technician</option>
                        <option>Jacob Fayiah</option>
                        <option>Mohammed Konneh</option>
                        <option>Aaron Gotogo</option>
                        <option>Khalifa Konneh</option>
                        <option>Abraham Cole</option>
                        <option>Moses Kollie</option>
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
                      <Input className="mt-1" placeholder="" value={genBrand} onChange={e => setGenBrand(e.target.value)} />
                    </div>
                    <div>
                      <Label>No. of Generators</Label>
                      <Input className="mt-1" type="number" placeholder="" value={numGens} onChange={e => setNumGens(e.target.value)} />
                    </div>
                    <div>
                      <Label>Capacity (kVA)</Label>
                      <Input className="mt-1" placeholder="" value={capacity} onChange={e => setCapacity(e.target.value)} />
                    </div>
                    <div>
                      <Label>GPS Location</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="Not captured"
                          value={gps}
                          onChange={e => setGps(e.target.value)}
                          readOnly={!gps}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-1.5 shrink-0"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(p =>
                                setGps(`${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`)
                              )
                            }
                          }}
                        >
                          <MapPin className="h-4 w-4" /> Capture
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="General notes about this visit..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveSection(2)} className="bg-slate-900 hover:bg-slate-800 text-white">
                      Next: Generator →
                    </Button>
                  </div>
                </div>
              )}

              {/* ── 2. GENERATOR ── */}
              {activeSection === 2 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">Generator Checklist</h2>
                  {generatorQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={genItems[i]} list={genItems} setList={setGenItems} />
                  ))}
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(1)}>← Site Info</Button>
                    <Button onClick={() => setActiveSection(3)} className="bg-slate-900 hover:bg-slate-800 text-white">Next: DC System →</Button>
                  </div>
                </div>
              )}

              {/* ── 3. DC SYSTEM ── */}
              {activeSection === 3 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">DC System Checklist</h2>
                  {dcQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={dcItems[i]} list={dcItems} setList={setDcItems} />
                  ))}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Amp Phase Measurements (A)</p>
                    <div className="grid grid-cols-4 gap-3">
                      {dcPhases.map((phase, i) => (
                        <div key={phase}>
                          <Label className="text-xs">{phase}</Label>
                          <Input
                            className="mt-1"
                            type="number"
                            placeholder="0.0"
                            value={dcAmps[i]}
                            onChange={e => { const n = [...dcAmps]; n[i] = e.target.value; setDcAmps(n) }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(2)}>← Generator</Button>
                    <Button onClick={() => setActiveSection(4)} className="bg-slate-900 hover:bg-slate-800 text-white">Next: Battery →</Button>
                  </div>
                </div>
              )}

              {/* ── 4. BATTERY ── */}
              {activeSection === 4 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">Battery Checklist</h2>
                  {batteryQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={battItems[i]} list={battItems} setList={setBattItems} />
                  ))}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Battery Voltage Measurements (V)</p>
                    <div className="grid grid-cols-4 gap-3">
                      {batteryLabels.map((label, i) => (
                        <div key={label}>
                          <Label className="text-xs">{label}</Label>
                          <Input
                            className="mt-1"
                            type="number"
                            placeholder="0.0"
                            value={battVolts[i]}
                            onChange={e => { const n = [...battVolts]; n[i] = e.target.value; setBattVolts(n) }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(3)}>← DC System</Button>
                    <Button onClick={() => setActiveSection(5)} className="bg-slate-900 hover:bg-slate-800 text-white">Next: Solar →</Button>
                  </div>
                </div>
              )}

              {/* ── 5. SOLAR ── */}
              {activeSection === 5 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">Solar Checklist</h2>
                  {solarQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={solarItems[i]} list={solarItems} setList={setSolarItems} />
                  ))}
                  <div className="mt-4">
                    <Label>Number of Damaged Panels</Label>
                    <Input
                      className="mt-1 w-32"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={damagedPanels}
                      onChange={e => setDamagedPanels(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(4)}>← Battery</Button>
                    <Button onClick={() => setActiveSection(6)} className="bg-slate-900 hover:bg-slate-800 text-white">Next: Cleaning →</Button>
                  </div>
                </div>
              )}

              {/* ── 6. CLEANING ── */}
              {activeSection === 6 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">Cleaning Checklist</h2>
                  {cleaningQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={cleanItems[i]} list={cleanItems} setList={setCleanItems} />
                  ))}
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(5)}>← Solar</Button>
                    <Button onClick={() => setActiveSection(7)} className="bg-slate-900 hover:bg-slate-800 text-white">Next: RMS →</Button>
                  </div>
                </div>
              )}

              {/* ── 7. RMS ── */}
              {activeSection === 7 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-5">RMS Checklist</h2>
                  {rmsQuestions.map((q, i) => (
                    <QuestionRow key={i} idx={i} question={q} item={rmsItems[i]} list={rmsItems} setList={setRmsItems} />
                  ))}
                  <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Inspection Summary</p>
                    <p className="text-xs text-gray-500">
                      {answered} of {allItems.length} questions answered • Overall completion: <span className="font-semibold text-gray-800">{progress}%</span>
                    </p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection(6)}>← Cleaning</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
                      <Save className="h-4 w-4" /> Submit Inspection
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
