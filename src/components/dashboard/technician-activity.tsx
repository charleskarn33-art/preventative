import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const technicians = [
  { name: "John Odhiambo", region: "Kisumu", completed: 8, total: 10, status: "active" },
  { name: "Mary Wanjiku", region: "Nairobi", completed: 12, total: 14, status: "active" },
  { name: "Peter Kamau", region: "Mombasa", completed: 5, total: 8, status: "on_site" },
  { name: "Grace Akinyi", region: "Eldoret", completed: 3, total: 6, status: "offline" },
  { name: "David Mwangi", region: "Nakuru", completed: 9, total: 11, status: "active" },
]

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  on_site: { label: "On Site", variant: "default" as const },
  offline: { label: "Offline", variant: "secondary" as const },
}

export function TechnicianActivity() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Technician Activity</CardTitle>
        <p className="text-xs text-gray-500">PM completion progress this month</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {technicians.map((tech) => {
          const pct = Math.round((tech.completed / tech.total) * 100)
          const status = statusConfig[tech.status as keyof typeof statusConfig]
          return (
            <div key={tech.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {tech.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{tech.completed}/{tech.total}</span>
                  <Badge variant={status.variant} className="text-[10px] py-0">{status.label}</Badge>
                </div>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
