"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  FileText,
  Download,
  TrendingUp,
  ClipboardList,
  Users,
  AlertTriangle,
  CheckCircle2,
  Radio,
} from "lucide-react"

const complianceByRegion = [
  { region: "Nairobi", compliance: 96, target: 95 },
  { region: "Nyanza", compliance: 92, target: 95 },
  { region: "Coast", compliance: 88, target: 95 },
  { region: "Rift Valley", compliance: 79, target: 95 },
  { region: "Central", compliance: 98, target: 95 },
  { region: "Eastern", compliance: 85, target: 95 },
]

const monthlyPMTrend = [
  { month: "Aug", completed: 142, overdue: 8, total: 152 },
  { month: "Sep", completed: 158, overdue: 5, total: 165 },
  { month: "Oct", completed: 171, overdue: 3, total: 176 },
  { month: "Nov", completed: 165, overdue: 9, total: 178 },
  { month: "Dec", completed: 180, overdue: 4, total: 187 },
  { month: "Jan", completed: 186, overdue: 5, total: 196 },
]

const techPerformance = [
  { name: "James N.", completed: 10, target: 10, compliance: 100 },
  { name: "Mary W.", completed: 12, target: 14, compliance: 86 },
  { name: "David M.", completed: 9, target: 11, compliance: 82 },
  { name: "John O.", completed: 8, target: 10, compliance: 80 },
  { name: "Alex O.", completed: 7, target: 9, compliance: 78 },
  { name: "Peter K.", completed: 5, target: 8, compliance: 63 },
]

const reportTypes = [
  { icon: TrendingUp, title: "PM Compliance Report", desc: "Overall PM compliance rates by region and PM type", color: "text-blue-600 bg-blue-50" },
  { icon: Radio, title: "Site PM History", desc: "Complete maintenance history for all tower sites", color: "text-purple-600 bg-purple-50" },
  { icon: Users, title: "Technician Performance", desc: "Individual technician PM completion and efficiency metrics", color: "text-green-600 bg-green-50" },
  { icon: AlertTriangle, title: "Overdue PM Report", desc: "All overdue preventive maintenance work orders", color: "text-red-600 bg-red-50" },
  { icon: CheckCircle2, title: "Completed PM Report", desc: "All completed PM work orders with details", color: "text-emerald-600 bg-emerald-50" },
  { icon: ClipboardList, title: "Equipment Health Report", desc: "Equipment condition summary from PM checklists", color: "text-amber-600 bg-amber-50" },
]

export default function ReportsPage() {
  return (
    <AppLayout>
      
      <div className="p-6 space-y-6">
        {/* Report generators */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Generate Reports</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <div key={report.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${report.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 px-2">
                      <FileText className="h-3 w-3 mr-1" /> PDF
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600 px-2">
                      <Download className="h-3 w-3 mr-1" /> Excel
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Analytics charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">PM Compliance by Region</CardTitle>
              <p className="text-xs text-gray-500">Current month compliance rate vs 95% target</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={complianceByRegion} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(value) => [`${value}%`]}
                  />
                  <Bar dataKey="compliance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Compliance" />
                  <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly PM Completion Trend</CardTitle>
              <p className="text-xs text-gray-500">Completed vs overdue PM over 6 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyPMTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="completed" stroke="#059669" strokeWidth={2} dot={false} name="Completed" />
                  <Line type="monotone" dataKey="overdue" stroke="#dc2626" strokeWidth={2} dot={false} name="Overdue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Technician performance table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Technician Performance</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Monthly PM completion metrics</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Technician</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Compliance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {techPerformance.map((tech) => (
                  <tr key={tech.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{tech.name}</td>
                    <td className="px-4 py-3 text-gray-700">{tech.completed}</td>
                    <td className="px-4 py-3 text-gray-700">{tech.target}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${tech.compliance >= 90 ? "text-green-600" : tech.compliance >= 75 ? "text-amber-600" : "text-red-600"}`}>
                        {tech.compliance}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-24 h-2 rounded-full bg-gray-100">
                          <div
                            className={`h-2 rounded-full ${tech.compliance >= 90 ? "bg-green-500" : tech.compliance >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${tech.compliance}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{tech.completed}/{tech.target}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
