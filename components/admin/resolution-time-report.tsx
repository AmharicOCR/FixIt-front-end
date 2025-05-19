"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const monthlyData = [
  {
    name: "Jan",
    avgTime: 36,
    medianTime: 24,
  },
  {
    name: "Feb",
    avgTime: 32,
    medianTime: 22,
  },
  {
    name: "Mar",
    avgTime: 28,
    medianTime: 20,
  },
  {
    name: "Apr",
    avgTime: 24,
    medianTime: 18,
  },
  {
    name: "May",
    avgTime: 20,
    medianTime: 16,
  },
]

const categoryData = [
  {
    name: "JavaScript",
    avgTime: 24,
  },
  {
    name: "Python",
    avgTime: 18,
  },
  {
    name: "Java",
    avgTime: 36,
  },
  {
    name: "C#",
    avgTime: 30,
  },
  {
    name: "PHP",
    avgTime: 22,
  },
  {
    name: "TypeScript",
    avgTime: 20,
  },
  {
    name: "Ruby",
    avgTime: 16,
  },
]

export function ResolutionTimeReport() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resolution Time Trend</CardTitle>
          <CardDescription>Average and median resolution time by month (hours)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-sm font-bold">{label}</div>
                          {payload.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-sm capitalize">
                                {entry.name}: {entry.value} hours
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgTime"
                name="Average Time"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="medianTime"
                name="Median Time"
                stroke="#f43f5e"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Time by Category</CardTitle>
          <CardDescription>Average resolution time by language (hours)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={categoryData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{label}</span>
                          <span className="text-sm">{payload[0].value} hours</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgTime"
                name="Avg. Resolution Time"
                stroke="#10b981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
