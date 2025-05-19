import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export function SolutionFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Status</h3>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all">All Status</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="status-pending" />
              <Label htmlFor="status-pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="approved" id="status-approved" />
              <Label htmlFor="status-approved">Approved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rejected" id="status-rejected" />
              <Label htmlFor="status-rejected">Rejected</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Votes</h3>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="votes-all" />
              <Label htmlFor="votes-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="votes-high" />
              <Label htmlFor="votes-high">High (20+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="votes-medium" />
              <Label htmlFor="votes-medium">Medium (5-20)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="votes-low" />
              <Label htmlFor="votes-low">Low (0-5)</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Submitted Date</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="submitted-last-7-days" />
              <Label htmlFor="submitted-last-7-days">Last 7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="submitted-last-30-days" />
              <Label htmlFor="submitted-last-30-days">Last 30 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="submitted-last-90-days" />
              <Label htmlFor="submitted-last-90-days">Last 90 days</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
