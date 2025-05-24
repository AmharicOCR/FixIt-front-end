import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

interface UserFiltersProps {
  roleFilter: string
  setRoleFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  joinedDateFilter: string[]
  onJoinedDateFilterChange: (filter: string) => void
}

export function UserFilters({
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  joinedDateFilter,
  onJoinedDateFilterChange
}: UserFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Role</h3>
          <RadioGroup value={roleFilter} onValueChange={setRoleFilter}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="role-all" />
              <Label htmlFor="role-all">All Roles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="role-free" />
              <Label htmlFor="role-free">Free User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="premium" id="role-premium" />
              <Label htmlFor="role-premium">Premium User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Super Admin" id="role-admin" />
              <Label htmlFor="role-admin">Admin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Moderator" id="Moderator" />
              <Label htmlFor="Moderator">Moderator</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Status</h3>
          <RadioGroup value={statusFilter} onValueChange={setStatusFilter}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all">All Status</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="status-active" />
              <Label htmlFor="status-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="status-inactive" />
              <Label htmlFor="status-inactive">Inactive</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Joined Date</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="joined-last-7-days" 
                checked={joinedDateFilter.includes("last-7-days")}
                onCheckedChange={() => onJoinedDateFilterChange("last-7-days")}
              />
              <Label htmlFor="joined-last-7-days">Last 7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="joined-last-30-days" 
                checked={joinedDateFilter.includes("last-30-days")}
                onCheckedChange={() => onJoinedDateFilterChange("last-30-days")}
              />
              <Label htmlFor="joined-last-30-days">Last 30 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="joined-last-90-days" 
                checked={joinedDateFilter.includes("last-90-days")}
                onCheckedChange={() => onJoinedDateFilterChange("last-90-days")}
              />
              <Label htmlFor="joined-last-90-days">Last 90 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="joined-this-year" 
                checked={joinedDateFilter.includes("this-year")}
                onCheckedChange={() => onJoinedDateFilterChange("this-year")}
              />
              <Label htmlFor="joined-this-year">This year</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}