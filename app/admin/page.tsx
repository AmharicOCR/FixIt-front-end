import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { PendingApprovals } from "@/components/admin/pending-approvals"
import { ErrorDistributionChart } from "@/components/admin/error-distribution-chart"
import { ResolutionTimeChart } from "@/components/admin/resolution-time-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Distribution of errors by programming language and framework</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorDistributionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Time</CardTitle>
            <CardDescription>Average time to resolve errors by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResolutionTimeChart />
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
