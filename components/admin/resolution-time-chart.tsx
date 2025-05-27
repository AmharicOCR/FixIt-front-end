"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ResolutionTimeChartProps {
  data: Array<{
    category: string
    hours: number
  }>
  height?: number
  margin?: { top: number; right: number; left: number; bottom: number }
}

export function ResolutionTimeChart({ 
  data, 
  height = 350, 
  margin = { top: 5, right: 30, left: 20, bottom: 5 } 
}: ResolutionTimeChartProps) {
  // Transform data to match the chart's expected format
  const chartData = data.map(item => ({
    name: item.category,
    time: item.hours
  }))

  // Calculate the maximum value for YAxis domain
  const maxTime = Math.max(...data.map(item => item.hours), 0)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
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
          domain={[0, maxTime + 5]} // Ensure some padding at the top
          label={{ value: "Hours", angle: -90, position: "insideLeft" }} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                    <span className="font-bold text-muted-foreground">
                      {payload[0].value} hour{payload[0].value !== 1 ? 's' : ''}
                    </span>
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
          dataKey="time"
          name="Avg. Resolution Time"
          stroke="#2563eb"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}