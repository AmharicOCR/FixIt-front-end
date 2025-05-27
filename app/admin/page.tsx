"use client"

import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { PendingApprovals } from "@/components/admin/pending-approvals"
import { ErrorDistributionChart } from "@/components/admin/error-distribution-chart"
import { ResolutionTimeChart } from "@/components/admin/resolution-time-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { getCookie } from "@/utils/cookies"

interface PlatformStats {
  total_users: number
  change_in_users: string
  total_errors: number
  change_in_errors: string
  total_solutions: number
  change_in_solutions: string
  solution_rate: string
  change_in_solution_rate: string
}

interface ErrorDistribution {
  lang_or_framework: string
  errors: number
  solutions: number
}

interface ResolutionTime {
  category: string
  hours: number
}

export default function AdminDashboard() {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [errorDistribution, setErrorDistribution] = useState<ErrorDistribution[]>([])
  const [resolutionTimes, setResolutionTimes] = useState<ResolutionTime[]>([])
  const [loading, setLoading] = useState({
    stats: true,
    errors: true,
    resolution: true
  })
  const [error, setError] = useState({
    stats: false,
    errors: false,
    resolution: false
  })
  const csrftoken=getCookie("csrftoken")

  useEffect(() => {
    // Fetch platform stats
    fetch('http://127.0.0.1:8000/bugtracker/platform-stats/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        // Convert array response to single object
        const stats = data.reduce((acc: any, item: any) => {
          return { ...acc, ...item }
        }, {})
        setPlatformStats(stats)
        setLoading(prev => ({ ...prev, stats: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, stats: true }))
        setLoading(prev => ({ ...prev, stats: false }))
      })

    // Fetch error distribution
    fetch('http://127.0.0.1:8000/bugtracker/top-errors/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setErrorDistribution(data)
        setLoading(prev => ({ ...prev, errors: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, errors: true }))
        setLoading(prev => ({ ...prev, errors: false }))
      })

    // Fetch resolution times
    fetch('http://127.0.0.1:8000/bugtracker/avg-resolution-time/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        // Ensure hours are positive numbers
        const processedData = data.map((item: any) => ({
          ...item,
          hours: Math.abs(item.hours)
        }))
        setResolutionTimes(processedData)
        setLoading(prev => ({ ...prev, resolution: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, resolution: true }))
        setLoading(prev => ({ ...prev, resolution: false }))
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <DashboardStats 
        stats={platformStats} 
        loading={loading.stats} 
        error={error.stats} 
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Distribution of errors by programming language and framework</CardDescription>
          </CardHeader>
          <CardContent>
            {error.errors ? (
              <div className="text-center py-8 text-red-500">
                Failed to load error distribution data
              </div>
            ) : loading.errors ? (
              <div className="text-center py-8 text-gray-500">
                Loading error distribution...
              </div>
            ) : (
              <ErrorDistributionChart 
                data={errorDistribution} 
                height={300}
                margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Time</CardTitle>
            <CardDescription>Average time to resolve errors by category</CardDescription>
          </CardHeader>
          <CardContent>
            {error.resolution ? (
              <div className="text-center py-8 text-red-500">
                Failed to load resolution time data
              </div>
            ) : loading.resolution ? (
              <div className="text-center py-8 text-gray-500">
                Loading resolution times...
              </div>
            ) : (
              <ResolutionTimeChart 
                data={resolutionTimes} 
                height={300}
                margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <RecentActivity />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <PendingApprovals />
        </TabsContent>
      </Tabs>
    </div>
  )
}