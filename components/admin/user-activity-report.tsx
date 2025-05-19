"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const activityData = [
  {
    name: "Jan",
    errors: 65,
    solutions: 48,
    comments: 92,
  },
  {
    name: "Feb",
    errors: 78,
    solutions: 52,
    comments: 105,
  },
  {
    name: "Mar",
    errors: 82,
    solutions: 60,
    comments: 120,
  },
  {
    name: "Apr",
    errors: 70,
    solutions: 65,
    comments: 110,
  },
  {
    name: "May",
    errors: 85,
    solutions: 75,
    comments: 125,
  },
]

const userGrowthData = [
  {
    name: "Jan",
    free: 120,
    premium: 45,
  },
  {
    name: "Feb",
    free: 150,
    premium: 60,
  },
  {
    name: "Mar",
    free: 190,
    premium: 75,
  },
  {
    name: "Apr",
    free: 220,
    premium: 90,
  },
  {
    name: "May",
    free: 280,
    premium: 110,
  },
]

export function UserActivityReport() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Monthly activity breakdown by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={activityData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
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
                                {entry.name}: {entry.value}
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
              <Bar dataKey="errors" fill="#f43f5e" name="Errors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="solutions" fill="#3b82f6" name="Solutions" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#10b981" name="Comments" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly new user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={userGrowthData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
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
                                {entry.name}: {entry.value}
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
              <Bar dataKey="free" fill="#a855f7" name="Free Users" radius={[4, 4, 0, 0]} />
              <Bar dataKey="premium" fill="#f59e0b" name="Premium Users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
