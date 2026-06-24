import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const alerts = [
  { type: "overdue", message: "5 PM work orders are overdue", site: "Multiple sites", time: "Now", icon: AlertTriangle },
  { type: "warning", message: "Monthly PM due tomorrow", site: "KSM-001 Kisumu North", time: "1h ago", icon: Clock },
  { type: "warning", message: "Technician not checked in", site: "MSA-012 Mombasa CBD", time: "2h ago", icon: Clock },
  { type: "success", message: "PM Approved by supervisor", site: "NRB-045 Westlands", time: "3h ago", icon: CheckCircle2 },
  { type: "info", message: "New PM schedule created", site: "ELD-003 Eldoret", time: "5h ago", icon: Info },
]

const alertColors = {
  overdue: "text-red-600 bg-red-50",
  warning: "text-amber-600 bg-amber-50",
  success: "text-green-600 bg-green-50",
  info: "text-blue-600 bg-blue-50",
}

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Alerts & Notifications</CardTitle>
        <p className="text-xs text-gray-500">Recent system alerts</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {alerts.map((alert, idx) => {
            const Icon = alert.icon
            return (
              <div key={idx} className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5", alertColors[alert.type as keyof typeof alertColors])}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.site}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{alert.time}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
