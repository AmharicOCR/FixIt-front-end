import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, MessageSquare, User, Clock, Edit, Eye } from "lucide-react"

interface ErrorActivityLogProps {
  errorId: string
}

export function ErrorActivityLog({ errorId }: ErrorActivityLogProps) {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      userInitial: "JD",
      action: "submitted this error",
      time: "May 15, 2023",
      type: "create",
    },
    {
      id: 2,
      user: "Admin",
      userInitial: "A",
      action: "approved this error",
      time: "May 16, 2023",
      type: "approve",
    },
    {
      id: 3,
      user: "Jane Smith",
      userInitial: "JS",
      action: "submitted a solution",
      time: "May 17, 2023",
      type: "solution",
    },
    {
      id: 4,
      user: "Mike Johnson",
      userInitial: "MJ",
      action: "commented on this error",
      time: "May 18, 2023",
      type: "comment",
    },
    {
      id: 5,
      user: "John Doe",
      userInitial: "JD",
      action: "edited the error description",
      time: "May 19, 2023",
      type: "edit",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "create":
        return <User className="h-4 w-4 text-blue-500" />
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "solution":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "edit":
        return <Edit className="h-4 w-4 text-orange-500" />
      case "view":
        return <Eye className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback>{activity.userInitial}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <div className="flex items-center pt-1">
                  {getIcon(activity.type)}
                  <span className="text-xs text-muted-foreground ml-1">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
