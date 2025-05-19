import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, MessageSquare, Edit, Eye } from "lucide-react"

interface UserActivityLogProps {
  userId: string
}

export function UserActivityLog({ userId }: UserActivityLogProps) {
  const activities = [
    {
      id: 1,
      action: "submitted a new error",
      target: "TypeError: Cannot read property 'map' of undefined",
      time: "May 15, 2023",
      type: "error",
    },
    {
      id: 2,
      action: "submitted a solution for",
      target: "TypeError: Cannot read property 'map' of undefined",
      time: "May 17, 2023",
      type: "solution",
    },
    {
      id: 3,
      action: "commented on",
      target: "Fix for TypeError in React components",
      time: "May 18, 2023",
      type: "comment",
    },
    {
      id: 4,
      action: "viewed error",
      target: "SyntaxError: Unexpected token in JSON at position 0",
      time: "May 19, 2023",
      type: "view",
    },
    {
      id: 5,
      action: "updated profile information",
      target: "",
      time: "May 20, 2023",
      type: "profile",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "solution":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "view":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "profile":
        return <Edit className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-4 mt-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getIcon(activity.type)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.action}{" "}
                  {activity.target && <span className="font-medium text-muted-foreground">"{activity.target}"</span>}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
