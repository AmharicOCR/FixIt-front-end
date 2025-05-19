"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Socket } from "socket.io-client"
import { initializeSocket, closeSocket } from "@/lib/socket"

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    // Initialize socket connection
    const socketInstance = initializeSocket(userId)
    setSocket(socketInstance)

    // Set up event listeners
    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    socketInstance.on("connect", onConnect)
    socketInstance.on("disconnect", onDisconnect)

    // Set initial connection state
    setIsConnected(socketInstance.connected)

    // Clean up on unmount
    return () => {
      socketInstance.off("connect", onConnect)
      socketInstance.off("disconnect", onDisconnect)
      closeSocket()
    }
  }, [userId])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
