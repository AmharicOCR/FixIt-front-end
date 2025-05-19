import { io, type Socket } from "socket.io-client"

// Socket.io client instance
let socket: Socket | null = null

export const initializeSocket = (userId: string) => {
  if (!socket) {
    // Connect to the WebSocket server
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001", {
      query: { userId },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Log connection status
    socket.on("connect", () => {
      console.log("WebSocket connected")
    })

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err)
    })

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason)
    })
  }

  return socket
}

export const getSocket = () => {
  return socket
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
