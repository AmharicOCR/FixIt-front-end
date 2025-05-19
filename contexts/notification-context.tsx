"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "./socket-context"
import { useToast } from "@/components/ui/use-toast"

export type Notification = {
  id: string
  title: string
  description: string
  type: "error" | "comment" | "solution" | "assignment" | "status" | "team"
  read: boolean
  createdAt: string
  link?: string
  sender?: {
    name: string
    avatar?: string
    initials: string
  }
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { socket } = useSocket()
  const { toast } = useToast()

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  useEffect(() => {
    if (!socket) return

    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])

      // Show toast for new notifications
      toast({
        title: notification.title,
        description: notification.description,
        action: notification.link ? (
          <a href={notification.link} className="text-primary hover:underline">
            View
          </a>
        ) : undefined,
      })
    }

    // Set up event listeners for different notification types
    socket.on("error_notification", handleNewNotification)
    socket.on("comment_notification", handleNewNotification)
    socket.on("solution_notification", handleNewNotification)
    socket.on("assignment_notification", handleNewNotification)
    socket.on("status_notification", handleNewNotification)
    socket.on("team_notification", handleNewNotification)

    // Clean up event listeners
    return () => {
      socket.off("error_notification", handleNewNotification)
      socket.off("comment_notification", handleNewNotification)
      socket.off("solution_notification", handleNewNotification)
      socket.off("assignment_notification", handleNewNotification)
      socket.off("status_notification", handleNewNotification)
      socket.off("team_notification", handleNewNotification)
    }
  }, [socket, toast])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
