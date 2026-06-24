import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const recentOrders = [
  { id: "WO-2024-001", site: "KSM-001 Kisumu North", type: "Monthly PM", tech: "John Odhiambo", status: "pending_approval", due: "2024-01-15" },
  { id: "WO-2024-002", site: "NRB-045 Westlands", type: "Weekly PM", tech: "Mary Wanjiku", status: "in_progress", due: "2024-01-16" },
  { id: "WO-2024-003", site: "MSA-012 Mombasa CBD", type: "Daily PM", tech: "Peter Kamau", status: "completed", due: "2024-01-14" },
  { id: "WO-2024-004", site: "ELD-003 Eldoret South", type: "Monthly PM", tech: "Grace Akinyi", status: "overdue", due: "2024-01-10" },
  { id: "WO-2024-005", site: "NKR-007 Nakuru Central", type: "Weekly PM", tech: "David Mwangi", status: "assigned", due: "2024-01-17" },
]

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" | "info" }> = {
  open: { label: "Open", variant: "secondary" },
  assigned: { label: "Assigned", variant: "info" },
  in_progress: { label: "In Progress", variant: "default" },
  pending_approval: { label: "Pending Approval", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
}

export function RecentWorkOrders() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent Work Orders</CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Latest PM work orders activity</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/work-orders" className="text-xs text-blue-600 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => {
            const status = statusConfig[order.status]
            return (
              <div key={order.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-blue-600">{order.id}</span>
                    <Badge variant={status.variant} className="text-[10px] py-0">{status.label}</Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{order.site}</p>
                  <p className="text-xs text-gray-500">{order.type} • {order.tech}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">Due</p>
                  <p className="text-xs font-medium text-gray-700">{order.due}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
