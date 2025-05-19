"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const languageData = [
  { name: "JavaScript", value: 40 },
  { name: "Python", value: 25 },
  { name: "Java", value: 15 },
  { name: "C#", value: 10 },
  { name: "PHP", value: 5 },
  { name: "TypeScript", value: 5 },
]

const frameworkData = [
  { name: "React", value: 35 },
  { name: "Angular", value: 20 },
  { name: "Django", value: 15 },
  { name: "Spring", value: 10 },
  { name: "Laravel", value: 10 },
  { name: "Vue", value: 10 },
]

const COLORS = ["#3b82f6", "#f43f5e", "#10b981", "#f59e0b", "#a855f7", "#64748b"]

export function ErrorCategoryReport() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Errors by Language</CardTitle>
          <CardDescription>Distribution of errors by programming language</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: payload[0].payload.fill }}
                            />
                            <span className="text-sm font-bold">{payload[0].name}</span>
                          </div>
                          <div className="text-sm">
                            {payload[0].value} errors ({((payload[0].value / 100) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Errors by Framework</CardTitle>
          <CardDescription>Distribution of errors by framework</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={frameworkData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {frameworkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: payload[0].payload.fill }}
                            />
                            <span className="text-sm font-bold">{payload[0].name}</span>
                          </div>
                          <div className="text-sm">
                            {payload[0].value} errors ({((payload[0].value / 100) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
