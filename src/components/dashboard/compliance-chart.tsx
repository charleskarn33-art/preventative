"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { month: "Jan", daily: 92, weekly: 88, monthly: 95 },
  { month: "Feb", daily: 88, weekly: 91, monthly: 87 },
  { month: "Mar", daily: 94, weekly: 85, monthly: 92 },
  { month: "Apr", daily: 91, weekly: 93, monthly: 96 },
  { month: "May", daily: 96, weekly: 90, monthly: 89 },
  { month: "Jun", daily: 93, weekly: 94, monthly: 97 },
]

export function ComplianceChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">PM Compliance Trend</CardTitle>
        <p className="text-xs text-gray-500">Monthly compliance rate by PM type (%)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="daily" stroke="#2563eb" strokeWidth={2} dot={false} name="Daily PM" />
            <Line type="monotone" dataKey="weekly" stroke="#7c3aed" strokeWidth={2} dot={false} name="Weekly PM" />
            <Line type="monotone" dataKey="monthly" stroke="#059669" strokeWidth={2} dot={false} name="Monthly PM" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
