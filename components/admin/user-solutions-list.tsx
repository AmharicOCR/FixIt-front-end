import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ThumbsUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UserSolutionsListProps {
  userId: string
}

export function UserSolutionsList({ userId }: UserSolutionsListProps) {
  const solutions = [
    {
      id: "1",
      title: "Fix for TypeError: Cannot read property 'map' of undefined",
      status: "approved",
      errorId: "1",
      errorTitle: "TypeError: Cannot read property 'map' of undefined in React component",
      submittedAt: "May 17, 2023",
      votes: 32,
    },
    {
      id: "5",
      title: "Resolving React Router DOM dependency issue",
      status: "pending",
      errorId: "5",
      errorTitle: "Cannot resolve module 'react-router-dom'",
      submittedAt: "May 21, 2023",
      votes: 8,
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        {solutions.length > 0 ? (
          <div className="space-y-4">
            {solutions.map((solution) => (
              <div key={solution.id} className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/admin/solutions/${solution.id}`} className="font-medium hover:underline">
                      {solution.title}
                    </Link>
                    <Badge
                      variant={
                        solution.status === "approved"
                          ? "success"
                          : solution.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {solution.status.charAt(0).toUpperCase() + solution.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Link
                      href={`/admin/errors/${solution.errorId}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      For error: {solution.errorTitle}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Submitted on {solution.submittedAt}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {solution.votes} votes
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/solutions/${solution.id}`}>
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
            <h3 className="mt-4 text-lg font-medium">No solutions found</h3>
            <p className="text-sm text-muted-foreground">This user hasn't submitted any solutions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
