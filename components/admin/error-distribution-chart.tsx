"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  {
    name: "JavaScript",
    errors: 1200,
    solutions: 980,
  },
  {
    name: "Python",
    errors: 900,
    solutions: 850,
  },
  {
    name: "Java",
    errors: 800,
    solutions: 720,
  },
  {
    name: "C#",
    errors: 600,
    solutions: 540,
  },
  {
    name: "PHP",
    errors: 400,
    solutions: 350,
  },
  {
    name: "TypeScript",
    errors: 700,
    solutions: 630,
  },
  {
    name: "Ruby",
    errors: 300,
    solutions: 270,
  },
]

export function ErrorDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
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
        <YAxis />
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
        <Bar dataKey="errors" fill="#ec4899" name="Errors" radius={[4, 4, 0, 0]} />
        <Bar dataKey="solutions" fill="#8884d8" name="Solutions" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
