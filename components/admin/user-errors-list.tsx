import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UserErrorsListProps {
  userId: string
}

export function UserErrorsList({ userId }: UserErrorsListProps) {
  const errors = [
    {
      id: "1",
      title: "TypeError: Cannot read property 'map' of undefined in React component",
      status: "approved",
      category: "React",
      language: "JavaScript",
      submittedAt: "May 15, 2023",
      views: 245,
      solutions: 8,
    },
    {
      id: "5",
      title: "Cannot resolve module 'react-router-dom'",
      status: "pending",
      category: "React",
      language: "JavaScript",
      submittedAt: "May 19, 2023",
      views: 76,
      solutions: 1,
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        {errors.length > 0 ? (
          <div className="space-y-4">
            {errors.map((error) => (
              <div key={error.id} className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/admin/errors/${error.id}`} className="font-medium hover:underline">
                      {error.title}
                    </Link>
                    <Badge
                      variant={
                        error.status === "approved"
                          ? "success"
                          : error.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{error.language}</Badge>
                    <Badge variant="outline">{error.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Submitted on {error.submittedAt}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{error.views} views</span>
                      <span>•</span>
                      <span>{error.solutions} solutions</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/errors/${error.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No errors found</h3>
            <p className="text-sm text-muted-foreground">This user hasn't submitted any errors yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
