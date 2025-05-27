"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { getCookie } from "@/utils/cookies";

interface ErrorCategoryReportProps {
  date?: Date;
  data?: {
    name: string;
    errors: number;
    percentage: string;
  }[];
  loading?: boolean;
  error?: boolean;
}

interface FrameworkErrorData {
  [key: string]: {
    errors: number;
    percentage: string;
  };
}

const COLORS = ["#3b82f6", "#f43f5e", "#10b981", "#f59e0b", "#a855f7", "#64748b"]

const getFilteredData = (date: Date | undefined, baseData: {name: string, value: number}[]) => {
  if (!date) return baseData;
  
  const monthIndex = date.getMonth();
  const multiplier = (monthIndex + 1) / 12;
  return baseData.map(item => ({
    ...item,
    value: Math.round(item.value * multiplier)
  }));
}

export function ErrorCategoryReport({ date, data, loading, error }: ErrorCategoryReportProps) {
  const [frameworkData, setFrameworkData] = useState<{name: string, value: number}[]>([]);
  const [frameworkLoading, setFrameworkLoading] = useState(true);
  const [frameworkError, setFrameworkError] = useState(false);
  const csrftoken=getCookie("csrftoken")

  useEffect(() => {
    const fetchFrameworkData = async () => {
      try {
        setFrameworkLoading(true);
        const response = await fetch('http://127.0.0.1:8000/bugtracker/framework-error/',{
          credentials: "include",
          headers:{
            'Content-Type': 'application/json',
            "X-CSRFToken":  csrftoken ?? ""
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch framework data');
        }
        const data: FrameworkErrorData[] = await response.json();
        
        // Transform the API data into the format we need
        const transformedData = data.flatMap(item => 
          Object.entries(item).map(([name, { errors }]) => ({
            name,
            value: errors
          }))
        );
        
        setFrameworkData(transformedData);
        setFrameworkError(false);
      } catch (error) {
        console.error('Error fetching framework data:', error);
        setFrameworkError(true);
      } finally {
        setFrameworkLoading(false);
      }
    };

    fetchFrameworkData();
  }, []);

  if (loading || frameworkLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error || frameworkError) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error loading data</div>;
  }

  const languageData = data ? data.map(item => ({
    name: item.name,
    value: item.errors
  })) : getFilteredData(date, [
    { name: "JavaScript", value: 40 },
    { name: "Python", value: 25 },
    { name: "Java", value: 15 },
    { name: "C#", value: 10 },
    { name: "PHP", value: 5 },
    { name: "TypeScript", value: 5 },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Errors by Language</CardTitle>
          <CardDescription>
            {date ? `Language distribution up to ${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}` : 'Distribution of errors by programming language'}
          </CardDescription>
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
                            {typeof payload[0]?.value === "number"
                              ? `${payload[0].value} errors (${(
                                  (payload[0].value /
                                    languageData.reduce(
                                      (sum, item) => sum + item.value,
                                      0
                                    )) *
                                  100
                                ).toFixed(0)}%)`
                              : "N/A"}
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
          <CardDescription>
            {date ? `Framework distribution up to ${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}` : 'Distribution of errors by framework'}
          </CardDescription>
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
                            {typeof payload[0]?.value === "number"
                              ? `${payload[0].value} errors (${(
                                  (payload[0].value /
                                    frameworkData.reduce(
                                      (sum, item) => sum + item.value,
                                      0
                                    )) *
                                  100
                                ).toFixed(0)}%)`
                              : "N/A"}
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