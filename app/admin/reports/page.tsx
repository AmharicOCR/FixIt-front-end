"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Download, BarChart, PieChart, LineChart, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { UserActivityReport } from "@/components/admin/user-activity-report"
import { ErrorCategoryReport } from "@/components/admin/error-category-report"
import { ResolutionTimeReport } from "@/components/admin/resolution-time-report"
import { PlatformUsageReport } from "@/components/admin/platform-usage-report"
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

interface MonthData {
  [key: string]: {
    users?: number
    solutions?: number
    errors?: number
    comments?: number
    free?: number
    premium?: number
  }
}

interface LanguageError {
  [key: string]: {
    errors: number
    percentage: string
  }
}

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [platformGrowth, setPlatformGrowth] = useState<MonthData[]>([])
  const [userActivity, setUserActivity] = useState<MonthData[]>([])
  const [userGrowth, setUserGrowth] = useState<MonthData[]>([])
  const [languageErrors, setLanguageErrors] = useState<LanguageError[]>([])
  const [loading, setLoading] = useState({
    stats: true,
    growth: true,
    activity: true,
    userGrowth: true,
    langErrors: true
  })
  const [error, setError] = useState({
    stats: false,
    growth: false,
    activity: false,
    userGrowth: false,
    langErrors: false
  })
  const csrftoken= getCookie("csrftoken")

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
        const stats = data.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
        setPlatformStats(stats)
        setLoading(prev => ({ ...prev, stats: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, stats: true }))
        setLoading(prev => ({ ...prev, stats: false }))
      })

    // Fetch platform growth
    fetch('http://127.0.0.1:8000/bugtracker/platfrom-growth/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setPlatformGrowth(data)
        setLoading(prev => ({ ...prev, growth: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, growth: true }))
        setLoading(prev => ({ ...prev, growth: false }))
      })

    // Fetch user activity
    fetch('http://127.0.0.1:8000/bugtracker/user-activity/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setUserActivity(data)
        setLoading(prev => ({ ...prev, activity: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, activity: true }))
        setLoading(prev => ({ ...prev, activity: false }))
      })

    // Fetch user growth
    fetch('http://127.0.0.1:8000/bugtracker/user-growth/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setUserGrowth(data)
        setLoading(prev => ({ ...prev, userGrowth: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, userGrowth: true }))
        setLoading(prev => ({ ...prev, userGrowth: false }))
      })

    // Fetch language errors
    fetch('http://127.0.0.1:8000/bugtracker/lang-error/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setLanguageErrors(data)
        setLoading(prev => ({ ...prev, langErrors: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, langErrors: true }))
        setLoading(prev => ({ ...prev, langErrors: false }))
      })
  }, [])

  // Transform platform growth data for charts
  const transformGrowthData = (data: MonthData[]) => {
    return data.map(monthObj => {
      const month = Object.keys(monthObj)[0]
      return {
        name: month,
        ...monthObj[month]
      }
    })
  }

  // Transform language error data for charts
  const transformLanguageData = (data: LanguageError[]) => {
    return data.map(langObj => {
      const lang = Object.keys(langObj)[0]
      return {
        name: lang,
        ...langObj[lang]
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_users || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_errors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_errors || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_solutions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_solutions || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.solution_rate || '0%'}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_solution_rate || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            User Activity
          </TabsTrigger>
          <TabsTrigger value="errors">
            <PieChart className="mr-2 h-4 w-4" />
            Error Categories
          </TabsTrigger>
          <TabsTrigger value="resolution">
            <LineChart className="mr-2 h-4 w-4" />
            Resolution Time
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 mt-6">
          <PlatformUsageReport 
            data={transformGrowthData(platformGrowth)} 
            loading={loading.growth} 
            error={error.growth} 
          />
        </TabsContent>
        <TabsContent value="users" className="space-y-4 mt-6">
          <UserActivityReport 
            activityData={transformGrowthData(userActivity)} 
            growthData={transformGrowthData(userGrowth)} 
            loading={loading.activity || loading.userGrowth} 
            error={error.activity || error.userGrowth} 
          />
        </TabsContent>
        <TabsContent value="errors" className="space-y-4 mt-6">
          <ErrorCategoryReport 
            data={transformLanguageData(languageErrors)} 
            loading={loading.langErrors} 
            error={error.langErrors} 
          />
        </TabsContent>
        <TabsContent value="resolution" className="space-y-4 mt-6">
          {/* 
          TODO: Add resolution time API endpoint
          <ResolutionTimeReport 
            data={resolutionData} 
            loading={loading.resolution} 
            error={error.resolution} 
          /> 
          */}
          <ResolutionTimeReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}