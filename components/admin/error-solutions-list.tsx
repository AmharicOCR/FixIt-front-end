import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

interface ErrorSolutionsListProps {
  errorId: string
}

export function ErrorSolutionsList({ errorId }: ErrorSolutionsListProps) {
  const solutions = [
    {
      id: "1",
      title: "Fix for TypeError: Cannot read property 'map' of undefined",
      status: "approved",
      submittedBy: "Jane Smith",
      submittedByInitial: "JS",
      submittedAt: "May 17, 2023",
      votes: 32,
      comments: 5,
      description:
        "This error occurs because you're trying to map over an array that is initially undefined. You need to add a check before mapping to ensure the array exists.",
    },
    {
      id: "2",
      title: "Alternative solution using optional chaining",
      status: "pending",
      submittedBy: "Mike Johnson",
      submittedByInitial: "MJ",
      submittedAt: "May 18, 2023",
      votes: 18,
      comments: 2,
      description:
        "You can use optional chaining to prevent this error. Replace products.map with products?.map to safely handle the case when products is undefined.",
    },
    {
      id: "3",
      title: "Using default empty array pattern",
      status: "approved",
      submittedBy: "Sarah Williams",
      submittedByInitial: "SW",
      submittedAt: "May 19, 2023",
      votes: 24,
      comments: 3,
      description:
        "Initialize your state with an empty array instead of undefined. This way, even before your API call completes, you'll be mapping over an empty array which is safe.",
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        {solutions.length > 0 ? (
          <div className="space-y-6">
            {solutions.map((solution) => (
              <div key={solution.id} className="rounded-lg border p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/admin/solutions/${solution.id}`} className="text-lg font-medium hover:underline">
                        {solution.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
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
                        <span className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {solution.votes}
                        </span>
                        <span className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {solution.comments}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/solutions/${solution.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                  </div>

                  <p className="text-muted-foreground">{solution.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{solution.submittedByInitial}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{solution.submittedBy}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{solution.submittedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No solutions yet</h3>
            <p className="text-sm text-muted-foreground">This error doesn't have any solutions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
