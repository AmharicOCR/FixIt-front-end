"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/contexts/socket-context"

// Generic hook for real-time data updates
export function useRealTimeData<T>(
  initialData: T,
  channel: string,
  eventTypes: string[] = ["update"],
): [T, (newData: T) => void] {
  const [data, setData] = useState<T>(initialData)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || !channel) return

    // Set up listeners for all event types
    const handlers: { [key: string]: (update: any) => void } = {}

    eventTypes.forEach((eventType) => {
      const handler = (update: any) => {
        setData((prevData) => {
          // If the update is a function, call it with the previous data
          if (typeof update === "function") {
            return update(prevData)
          }

          // If the update is an object, merge it with the previous data
          if (typeof update === "object" && update !== null) {
            if (Array.isArray(prevData)) {
              // If data is an array, handle differently based on the update type
              if (update.action === "add") {
                return [...prevData, update.item]
              } else if (update.action === "remove") {
                return prevData.filter((item: any) => item.id !== update.id)
              } else if (update.action === "update") {
                return prevData.map((item: any) => (item.id === update.item.id ? { ...item, ...update.item } : item))
              }
            }

            // For objects, merge the update with previous data
            return { ...prevData, ...update }
          }

          // If it's a direct replacement, use the update directly
          return update
        })
      }

      handlers[eventType] = handler
      socket.on(`${channel}_${eventType}`, handler)
    })

    // Clean up listeners on unmount
    return () => {
      eventTypes.forEach((eventType) => {
        socket.off(`${channel}_${eventType}`, handlers[eventType])
      })
    }
  }, [socket, channel, eventTypes])

  // Function to update data and emit to socket
  const updateData = (newData: T) => {
    setData(newData)

    // Emit update to socket if available
    if (socket && channel) {
      socket.emit(`${channel}_update`, newData)
    }
  }

  return [data, updateData]
}

// Specialized hook for real-time error updates
export function useRealTimeError(errorId: string, initialData: any) {
  return useRealTimeData(initialData, `error_${errorId}`, ["update", "comment", "solution"])
}

// Specialized hook for real-time team updates
export function useRealTimeTeam(teamId: string, initialData: any) {
  return useRealTimeData(initialData, `team_${teamId}`, ["update", "new_member", "new_error"])
}

// Specialized hook for real-time user status
export function useRealTimeUserStatus(userId: string, initialStatus = "offline") {
  const [status, setStatus] = useState(initialStatus)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || !userId) return

    // Listen for user status changes
    const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus)
    }

    socket.on(`user_${userId}_status`, handleStatusChange)

    // Clean up listener on unmount
    return () => {
      socket.off(`user_${userId}_status`, handleStatusChange)
    }
  }, [socket, userId])

  // Function to update user status
  const updateStatus = (newStatus: string) => {
    setStatus(newStatus)

    // Emit status update to socket if available
    if (socket) {
      socket.emit("update_user_status", { userId, status: newStatus })
    }
  }

  return [status, updateStatus] as const
}
