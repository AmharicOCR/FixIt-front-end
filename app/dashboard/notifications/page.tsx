"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/contexts/notification-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [filter, setFilter] = useState<string>("all")

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setFilter}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="error">Errors</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="solution">Solutions</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={clearNotifications} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {filter === "all"
              ? "All Notifications"
              : filter === "unread"
                ? "Unread Notifications"
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 py-4 ${!notification.read ? "bg-muted/30" : ""}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Avatar className="h-10 w-10">
                    {notification.sender?.avatar ? (
                      <AvatarImage
                        src={notification.sender.avatar || "/placeholder.svg"}
                        alt={notification.sender.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {notification.sender?.initials || notification.type.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              notification.type === "error"
                                ? "border-red-500 text-red-500"
                                : notification.type === "comment"
                                  ? "border-blue-500 text-blue-500"
                                  : notification.type === "solution"
                                    ? "border-green-500 text-green-500"
                                    : notification.type === "team"
                                      ? "border-purple-500 text-purple-500"
                                      : "border-amber-500 text-amber-500"
                            }
                          `}
                        >
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="default" className="bg-primary text-primary-foreground">
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{notification.description}</p>
                    {notification.link && (
                      <div className="mt-2">
                        <Link href={notification.link} className="text-sm text-primary hover:underline">
                          View details
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
