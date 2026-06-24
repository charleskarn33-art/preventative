"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, CheckCircle2, Info, Bell, BellOff, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const notifications = [
  { id: 1, type: "overdue", title: "PM Overdue — ELD-003 Eldoret South", message: "Monthly PM is 6 days overdue. Technician Grace Akinyi has not checked in.", time: "30 min ago", read: false, workOrder: "WO-2024-004" },
  { id: 2, type: "warning", title: "PM Due Tomorrow — KSM-001 Kisumu North", message: "Monthly PM is due tomorrow (Jan 16). Technician John Odhiambo assigned.", time: "1 hour ago", read: false, workOrder: "WO-2024-001" },
  { id: 3, type: "approval", title: "Approval Required — WO-2024-001", message: "John Odhiambo has completed the PM checklist for KSM-001. Awaiting your approval.", time: "2 hours ago", read: false, workOrder: "WO-2024-001" },
  { id: 4, type: "success", title: "PM Completed — MSA-012 Mombasa CBD", message: "Peter Kamau has completed the daily PM checklist. All items passed.", time: "3 hours ago", read: true, workOrder: "WO-2024-003" },
  { id: 5, type: "info", title: "New Work Order Created — WO-2024-005", message: "Weekly PM work order automatically generated for NKR-007 Nakuru Central.", time: "5 hours ago", read: true, workOrder: "WO-2024-005" },
  { id: 6, type: "overdue", title: "PM Overdue — KRN-018 Kirinyaga East", message: "Weekly PM is 8 days overdue. Technician Susan Wahu has been notified.", time: "6 hours ago", read: true, workOrder: "WO-2024-008" },
  { id: 7, type: "success", title: "PM Approved — NRB-045 Westlands", message: "Supervisor has approved the completed PM for NRB-045 Westlands Tower.", time: "Yesterday", read: true, workOrder: "WO-2024-002" },
  { id: 8, type: "info", title: "Technician Assigned — WO-2024-007", message: "Alex Ochieng has been assigned to HOM-005 Homa Bay Central monthly PM.", time: "Yesterday", read: true, workOrder: "WO-2024-007" },
]

const typeConfig = {
  overdue: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  warning: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  approval: { icon: Bell, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  success: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
}

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications)

  const unread = items.filter(n => !n.read)
  const read = items.filter(n => n.read)

  const markAllRead = () => setItems(items.map(n => ({ ...n, read: true })))
  const markRead = (id: number) => setItems(items.map(n => n.id === id ? { ...n, read: true } : n))
  const remove = (id: number) => setItems(items.filter(n => n.id !== id))

  function NotifItem({ notif }: { notif: typeof notifications[0] }) {
    const config = typeConfig[notif.type as keyof typeof typeConfig]
    const Icon = config.icon
    return (
      <div className={cn(
        "flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0",
        !notif.read && "bg-blue-50/30"
      )}>
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn("text-sm font-semibold text-gray-900", !notif.read && "font-bold")}>
              {notif.title}
            </p>
            {!notif.read && (
              <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-gray-400">{notif.time}</span>
            <span className="text-[10px] font-mono text-blue-600">{notif.workOrder}</span>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          {!notif.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-blue-600 px-2"
              onClick={() => markRead(notif.id)}
            >
              Mark read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
            onClick={() => remove(notif.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900">All Notifications</h2>
            {unread.length > 0 && (
              <Badge variant="default">{unread.length} unread</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllRead}>
              <BellOff className="h-3.5 w-3.5" /> Mark all read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({items.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-3">
            <Card>
              <CardContent className="p-0">
                {items.map(notif => <NotifItem key={notif.id} notif={notif} />)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="unread" className="mt-3">
            <Card>
              <CardContent className="p-0">
                {unread.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <CheckCircle2 className="h-10 w-10 text-green-300 mb-3" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm mt-1">No unread notifications</p>
                  </div>
                ) : (
                  unread.map(notif => <NotifItem key={notif.id} notif={notif} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
