import { AppLayout } from "@/components/layout/app-layout"
import { Header } from "@/components/layout/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { SiteStatusChart } from "@/components/dashboard/site-status-chart"
import { RecentWorkOrders } from "@/components/dashboard/recent-work-orders"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { TechnicianActivity } from "@/components/dashboard/technician-activity"
import {
  Radio,
  TrendingUp,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <AppLayout>
      <Header
        title="Operations Dashboard"
        subtitle="TelcoCare PM — Real-time telecom tower maintenance overview"
      />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          <KPICard
            title="Total Sites"
            value="248"
            subtitle="Active tower sites"
            icon={Radio}
            color="slate"
            trend={{ value: 3, positive: true }}
          />
          <KPICard
            title="PM Compliance"
            value="94.2%"
            subtitle="This month"
            icon={TrendingUp}
            color="green"
            trend={{ value: 2, positive: true }}
          />
          <KPICard
            title="Upcoming PM"
            value="32"
            subtitle="Next 7 days"
            icon={CalendarClock}
            color="blue"
          />
          <KPICard
            title="Completed PM"
            value="186"
            subtitle="This month"
            icon={CheckCircle2}
            color="green"
            trend={{ value: 8, positive: true }}
          />
          <KPICard
            title="Overdue PM"
            value="5"
            subtitle="Requires attention"
            icon={AlertTriangle}
            color="red"
            trend={{ value: 40, positive: false }}
          />
          <KPICard
            title="Open Work Orders"
            value="28"
            subtitle="In pipeline"
            icon={ClipboardList}
            color="amber"
          />
          <KPICard
            title="Active Technicians"
            value="18"
            subtitle="On field today"
            icon={Users}
            color="purple"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ComplianceChart />
          </div>
          <SiteStatusChart />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecentWorkOrders />
          <AlertsPanel />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TechnicianActivity />
          <UpcomingPMWidget />
        </div>
      </div>
    </AppLayout>
  )
}

function UpcomingPMWidget() {
  const upcoming = [
    { site: "KSM-001 Kisumu North", type: "Monthly PM", date: "Jan 16", tech: "John O.", priority: "high" },
    { site: "NRB-045 Westlands", type: "Weekly PM", date: "Jan 16", tech: "Mary W.", priority: "medium" },
    { site: "MSA-012 Mombasa CBD", type: "Daily PM", date: "Jan 17", tech: "Peter K.", priority: "medium" },
    { site: "ELD-003 Eldoret South", type: "Monthly PM", date: "Jan 18", tech: "Grace A.", priority: "high" },
    { site: "NKR-007 Nakuru Central", type: "Weekly PM", date: "Jan 19", tech: "David M.", priority: "low" },
  ]

  const priorityColors = {
    high: "bg-red-50 text-red-700 border-red-100",
    medium: "bg-amber-50 text-amber-700 border-amber-100",
    low: "bg-green-50 text-green-700 border-green-100",
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="font-semibold text-gray-900 text-base">Upcoming PM Schedule</h3>
        <p className="text-xs text-gray-500 mt-0.5">Next 7 days preventive maintenance</p>
      </div>
      <div className="divide-y divide-gray-50">
        {upcoming.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{item.site}</p>
              <p className="text-xs text-gray-500">{item.type} • {item.tech}</p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
                {item.priority.toUpperCase()}
              </span>
              <span className="text-xs font-medium text-gray-700">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
