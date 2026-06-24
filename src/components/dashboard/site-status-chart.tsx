"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Completed", value: 68, color: "#059669" },
  { name: "In Progress", value: 14, color: "#2563eb" },
  { name: "Upcoming", value: 12, color: "#7c3aed" },
  { name: "Overdue", value: 6, color: "#dc2626" },
]

export function SiteStatusChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PM Work Order Status</CardTitle>
        <p className="text-xs text-gray-500">Current period distribution</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
