"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ErrorDistributionChartProps {
  data: Array<{
    lang_or_framework: string
    errors: number
    solutions: number
  }>
  height?: number
  margin?: { top: number; right: number; left: number; bottom: number }
}

export function ErrorDistributionChart({ 
  data, 
  height = 350, 
  margin = { top: 5, right: 30, left: 20, bottom: 5 } 
}: ErrorDistributionChartProps) {
  // Transform data to match the chart's expected format
  const chartData = data.map(item => ({
    name: item.lang_or_framework,
    errors: item.errors,
    solutions: item.solutions
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          domain={[0, 'dataMax + 5']} // Ensure some padding at the top
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value} errors</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Solutions</span>
                      <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar 
          dataKey="errors" 
          fill="#ec4899" 
          name="Errors" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={40}
        />
        <Bar 
          dataKey="solutions" 
          fill="#8884d8" 
          name="Solutions" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}