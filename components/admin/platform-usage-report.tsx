"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface PlatformUsageReportProps {
  date?: Date;
  data?: {
    name: string;
    users?: number;
    solutions?: number;
    errors?: number;
    comments?: number;
    free?: number;
    premium?: number;
  }[];
  loading?: boolean;
  error?: boolean;
}

export function PlatformUsageReport({ date, data, loading, error }: PlatformUsageReportProps) {
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error loading data</div>;
  }

  const usageData = data || [
    {
      name: "Jan",
      users: 1200,
      errors: 450,
      solutions: 380,
    },
    {
      name: "Feb",
      users: 1500,
      errors: 520,
      solutions: 450,
    },
    {
      name: "Mar",
      users: 1800,
      errors: 600,
      solutions: 520,
    },
    {
      name: "Apr",
      users: 2100,
      errors: 700,
      solutions: 620,
    },
    {
      name: "May",
      users: 2500,
      errors: 850,
      solutions: 750,
    },
  ]

  const engagementData = [
    {
      name: "Jan",
      viewsPerUser: 12,
      solutionsPerError: 0.8,
    },
    {
      name: "Feb",
      viewsPerUser: 14,
      solutionsPerError: 0.85,
    },
    {
      name: "Mar",
      viewsPerUser: 15,
      solutionsPerError: 0.87,
    },
    {
      name: "Apr",
      viewsPerUser: 18,
      solutionsPerError: 0.9,
    },
    {
      name: "May",
      viewsPerUser: 20,
      solutionsPerError: 0.92,
    },
  ]

  const filteredUsageData = date 
    ? usageData.filter(item => {
        const itemDate = new Date(`${item.name} 1, 2023`);
        return itemDate <= (date || new Date());
      })
    : usageData;

  const filteredEngagementData = date 
    ? engagementData.filter(item => {
        const itemDate = new Date(`${item.name} 1, 2023`);
        return itemDate <= (date || new Date());
      })
    : engagementData;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
          <CardDescription>
            {date ? `Growth data up to ${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}` : 'Monthly growth in users, errors, and solutions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={filteredUsageData}
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
              <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="errors" name="Errors" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              <Area
                type="monotone"
                dataKey="solutions"
                name="Solutions"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>
            {date ? `Engagement metrics up to ${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}` : 'Monthly engagement metrics'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={filteredEngagementData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
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
              <Bar yAxisId="left" dataKey="viewsPerUser" name="Views Per User" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar
                yAxisId="right"
                dataKey="solutionsPerError"
                name="Solutions Per Error"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}