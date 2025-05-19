"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  {
    name: "JavaScript",
    time: 24,
  },
  {
    name: "Python",
    time: 18,
  },
  {
    name: "Java",
    time: 36,
  },
  {
    name: "C#",
    time: 30,
  },
  {
    name: "PHP",
    time: 22,
  },
  {
    name: "TypeScript",
    time: 20,
  },
  {
    name: "Ruby",
    time: 16,
  },
]

export function ResolutionTimeChart() {
  return (
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
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                    <span className="font-bold text-muted-foreground">{payload[0].value} hours</span>
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
