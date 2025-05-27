"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ResolutionTimeReportProps {
  data: {
    name: string
    average_hours: number
    median_hours: number
  }[]
  loading: boolean
  error: boolean
}

export function ResolutionTimeReport({ data, loading, error }: ResolutionTimeReportProps) {
  if (error) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-500 text-center py-8">
              Failed to load resolution time data
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4 py-8">
              <div className="h-8 w-full bg-gray-200 rounded"></div>
              <div className="h-64 w-full bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform data for the second chart (by category)
  // Note: This is a placeholder - you'll need to implement actual category data from your API
  const categoryData = data.length > 0 ? [
    {
      name: "JavaScript",
      avgTime: Math.round(data[0].average_hours * 0.8),
    },
    {
      name: "Python",
      avgTime: Math.round(data[0].average_hours * 0.6),
    },
    {
      name: "Java",
      avgTime: Math.round(data[0].average_hours * 1.2),
    },
    {
      name: "C#",
      avgTime: Math.round(data[0].average_hours),
    },
    {
      name: "PHP",
      avgTime: Math.round(data[0].average_hours * 0.7),
    },
    {
      name: "TypeScript",
      avgTime: Math.round(data[0].average_hours * 0.9),
    },
  ] : []

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resolution Time Trend</CardTitle>
          <CardDescription>Average and median resolution time by month (hours)</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No resolution time data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={data}
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
                  dataKey="average_hours"
                  name="Average Time"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="median_hours"
                  name="Median Time"
                  stroke="#f43f5e"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolution Time by Category</CardTitle>
          <CardDescription>Average resolution time by language (hours)</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No category data available
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}