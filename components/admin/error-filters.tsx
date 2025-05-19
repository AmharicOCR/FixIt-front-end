import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export function ErrorFilters() {
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
          <h3 className="text-sm font-medium">Language</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="lang-javascript" />
              <Label htmlFor="lang-javascript">JavaScript</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang-python" />
              <Label htmlFor="lang-python">Python</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang-java" />
              <Label htmlFor="lang-java">Java</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang-csharp" />
              <Label htmlFor="lang-csharp">C#</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang-php" />
              <Label htmlFor="lang-php">PHP</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Framework</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="framework-react" />
              <Label htmlFor="framework-react">React</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="framework-angular" />
              <Label htmlFor="framework-angular">Angular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="framework-vue" />
              <Label htmlFor="framework-vue">Vue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="framework-django" />
              <Label htmlFor="framework-django">Django</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="framework-spring" />
              <Label htmlFor="framework-spring">Spring</Label>
            </div>
          </div>
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
