"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSocket } from "@/contexts/socket-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRealTimeUserStatus } from "@/hooks/use-real-time-data"

export default function LiveCollaborationPage() {
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [currentRoom, setCurrentRoom] = useState("general")
  const [userStatus, setUserStatus] = useRealTimeUserStatus("user-123", "online")

  // Mock user data
  const currentUser = {
    id: "user-123",
    name: "John Doe",
    avatar: "/placeholder.svg",
    initials: "JD",
  }

  // Available chat rooms
  const rooms = [
    { id: "general", name: "General" },
    { id: "frontend-team", name: "Frontend Team" },
    { id: "backend-team", name: "Backend Team" },
    { id: "error-triage", name: "Error Triage" },
  ]

  useEffect(() => {
    if (!socket) return

    // Join the initial room
    socket.emit("join_room", currentRoom)

    // Listen for new messages
    const handleNewMessage = (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage])
    }

    // Listen for active users update
    const handleActiveUsers = (users: any[]) => {
      setActiveUsers(users)
    }

    socket.on("new_message", handleNewMessage)
    socket.on("active_users", handleActiveUsers)

    // Request active users list
    socket.emit("get_active_users", currentRoom)

    // Clean up listeners on unmount
    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("active_users", handleActiveUsers)
      socket.emit("leave_room", currentRoom)
    }
  }, [socket, currentRoom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !socket) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: currentUser,
      room: currentRoom,
      timestamp: new Date().toISOString(),
    }

    // Emit the message to the server
    socket.emit("send_message", newMessage)

    // Optimistically add to our messages
    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  const handleRoomChange = (roomId: string) => {
    if (!socket || roomId === currentRoom) return

    // Leave current room
    socket.emit("leave_room", currentRoom)

    // Join new room
    socket.emit("join_room", roomId)
    setCurrentRoom(roomId)
    setMessages([]) // Clear messages when changing rooms

    // Request active users for the new room
    socket.emit("get_active_users", roomId)
  }

  const handleStatusChange = (status: string) => {
    setUserStatus(status)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Collaboration</h1>
        <p className="text-muted-foreground">Collaborate in real-time with your team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Status */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Your Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        userStatus === "online"
                          ? "bg-green-500"
                          : userStatus === "away"
                            ? "bg-amber-500"
                            : "bg-gray-300"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{userStatus}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={userStatus === "online" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleStatusChange("online")}
                >
                  Online
                </Button>
                <Button
                  size="sm"
                  variant={userStatus === "away" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleStatusChange("away")}
                >
                  Away
                </Button>
                <Button
                  size="sm"
                  variant={userStatus === "offline" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleStatusChange("offline")}
                >
                  Offline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Rooms</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                      currentRoom === room.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleRoomChange(room.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{room.name}</span>
                      {currentRoom === room.id && <Badge variant="secondary">Current</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Active Users</CardTitle>
              <CardDescription>{activeUsers.length} users in this room</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {activeUsers.length > 0 ? (
                  activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${
                            user.status === "online"
                              ? "bg-green-500"
                              : user.status === "away"
                                ? "bg-amber-500"
                                : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No active users in this room</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="border-border/40 shadow-sm h-[calc(100vh-16rem)]">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {rooms.find((room) => room.id === currentRoom)?.name || "Chat"}
                  </CardTitle>
                  <CardDescription>
                    {isConnected ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Disconnected
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {activeUsers.length} {activeUsers.length === 1 ? "user" : "users"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender.id === currentUser.id ? "justify-end" : ""}`}>
                      {msg.sender.id !== currentUser.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                          <AvatarFallback>{msg.sender.initials}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] ${
                          msg.sender.id === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                        } rounded-lg px-3 py-2`}
                      >
                        {msg.sender.id !== currentUser.id && (
                          <p className="text-xs font-medium mb-1">{msg.sender.name}</p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-right mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {msg.sender.id === currentUser.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                          <AvatarFallback>{msg.sender.initials}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!isConnected}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!isConnected || !message.trim()}>
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
