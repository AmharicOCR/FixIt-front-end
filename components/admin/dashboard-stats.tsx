import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, CheckCircle, ThumbsUp } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    total_users?: number
    change_in_users?: string
    total_errors?: number
    change_in_errors?: string
    total_solutions?: number
    change_in_solutions?: string
    solution_rate?: string
    change_in_solution_rate?: string
  } | null
  loading?: boolean
  error?: boolean
}

export function DashboardStats({ stats, loading = false, error = false }: DashboardStatsProps) {
  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Loading Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">Error</div>
              <p className="text-xs text-muted-foreground">Failed to load stats</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse">...</div>
              <p className="text-xs text-muted-foreground animate-pulse">Loading data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_users || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.change_in_users || '+0%'} from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_errors || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.change_in_errors || '+0%'} from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_solutions || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats.change_in_solutions || '+0%'} from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solution Rate</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.solution_rate || '0%'}</div>
          <p className="text-xs text-muted-foreground">
            {stats.change_in_solution_rate || '+0%'} from last period
          </p>
        </CardContent>
      </Card>
    </div>
  )
}