import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, MessageSquare, User, Clock } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      userInitial: "JD",
      action: "submitted a new error",
      target: "TypeError: Cannot read property 'map' of undefined",
      time: "5 minutes ago",
      type: "error",
    },
    {
      id: 2,
      user: "Jane Smith",
      userInitial: "JS",
      action: "submitted a solution for",
      target: "TypeError: Cannot read property 'map' of undefined",
      time: "15 minutes ago",
      type: "solution",
    },
    {
      id: 3,
      user: "Mike Johnson",
      userInitial: "MJ",
      action: "commented on",
      target: "Fix for TypeError in React components",
      time: "30 minutes ago",
      type: "comment",
    },
    {
      id: 4,
      user: "Sarah Williams",
      userInitial: "SW",
      action: "registered a new account",
      target: "",
      time: "1 hour ago",
      type: "user",
    },
    {
      id: 5,
      user: "Admin",
      userInitial: "A",
      action: "approved error",
      target: "SyntaxError: Unexpected token in JSON at position 0",
      time: "2 hours ago",
      type: "moderation",
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
      case "user":
        return <User className="h-4 w-4 text-purple-500" />
      case "moderation":
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback>{activity.userInitial}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                  {activity.target && <span className="font-medium text-muted-foreground">"{activity.target}"</span>}
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
