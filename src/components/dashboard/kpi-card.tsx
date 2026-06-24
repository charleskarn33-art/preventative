import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  color: "blue" | "purple" | "green" | "amber" | "red" | "slate"
}

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
  green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-100" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
  red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
  slate: { bg: "bg-slate-50", icon: "text-slate-600", border: "border-slate-100" },
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color }: KPICardProps) {
  const colors = colorMap[color]
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
            {trend && (
              <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs last month
              </p>
            )}
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
