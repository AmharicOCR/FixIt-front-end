import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export function PendingApprovals() {
  const pendingErrors = [
    {
      id: "1",
      title: "TypeError: Cannot read property 'map' of undefined in React component",
      submittedBy: "John Doe",
      submittedAt: "May 15, 2023",
      category: "React",
      language: "JavaScript",
    },
    {
      id: "2",
      title: "SyntaxError: Unexpected token in JSON at position 0",
      submittedBy: "Jane Smith",
      submittedAt: "May 16, 2023",
      category: "JavaScript",
      language: "JavaScript",
    },
  ]

  const pendingSolutions = [
    {
      id: "1",
      title: "Fix for TypeError: Cannot read property 'map' of undefined",
      submittedBy: "Mike Johnson",
      submittedAt: "May 17, 2023",
      errorId: "1",
    },
    {
      id: "2",
      title: "Solution for SyntaxError in JSON parsing",
      submittedBy: "Sarah Williams",
      submittedAt: "May 18, 2023",
      errorId: "2",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Pending Errors
          </CardTitle>
          <Badge>{pendingErrors.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingErrors.map((error) => (
              <div key={error.id} className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/admin/errors/${error.id}`} className="font-medium hover:underline">
                      {error.title}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{error.language}</Badge>
                    <Badge variant="outline">{error.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      By {error.submittedBy} on {error.submittedAt}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <X className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <Check className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingErrors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No pending errors</h3>
                <p className="text-sm text-muted-foreground">All submitted errors have been reviewed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Pending Solutions
          </CardTitle>
          <Badge>{pendingSolutions.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingSolutions.map((solution) => (
              <div key={solution.id} className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/admin/solutions/${solution.id}`} className="font-medium hover:underline">
                      {solution.title}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`/admin/errors/${solution.errorId}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      For error #{solution.errorId}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      By {solution.submittedBy} on {solution.submittedAt}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <X className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <Check className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingSolutions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No pending solutions</h3>
                <p className="text-sm text-muted-foreground">All submitted solutions have been reviewed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
