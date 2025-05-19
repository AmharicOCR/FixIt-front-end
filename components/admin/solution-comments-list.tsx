import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

interface SolutionCommentsListProps {
  solutionId: string
}

export function SolutionCommentsList({ solutionId }: SolutionCommentsListProps) {
  const comments = [
    {
      id: "1",
      user: "John Doe",
      userInitial: "JD",
      content: "This solution worked perfectly for me! Thanks for sharing.",
      timestamp: "May 18, 2023",
    },
    {
      id: "2",
      user: "Sarah Williams",
      userInitial: "SW",
      content: "I had to make a small modification for it to work with my React version, but the core idea is solid.",
      timestamp: "May 19, 2023",
    },
    {
      id: "3",
      user: "Mike Johnson",
      userInitial: "MJ",
      content:
        "Could you explain a bit more about why initializing with an empty array works better than the conditional check?",
      timestamp: "May 20, 2023",
    },
    {
      id: "4",
      user: "Jane Smith",
      userInitial: "JS",
      content:
        "Sure @Mike - initializing with an empty array means .map() will always work (it just won't produce any elements if the array is empty). With a conditional check, you have to remember to add it every time you use the array.",
      timestamp: "May 21, 2023",
    },
  ]

  return (
    <div className="space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{comment.userInitial}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-medium">No comments yet</h3>
          <p className="text-sm text-muted-foreground">This solution doesn't have any comments yet</p>
        </div>
      )}
    </div>
  )
}
