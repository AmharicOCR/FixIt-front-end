// This is a standalone WebSocket server implementation
// In a production environment, you might want to use a service like Pusher or Socket.IO Cloud

const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

// Create HTTP server
const server = http.createServer()

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Store active connections and room memberships
const activeConnections = new Map()
const rooms = new Map()

// Helper function to get users in a room
const getUsersInRoom = (roomId) => {
  if (!rooms.has(roomId)) return []

  const userIds = Array.from(rooms.get(roomId))
  return userIds
    .map((userId) => {
      const socketId = activeConnections.get(userId)
      const socket = io.sockets.sockets.get(socketId)
      return socket
        ? {
            id: userId,
            name: socket.handshake.query.name || "Anonymous",
            avatar: socket.handshake.query.avatar || "/placeholder.svg",
            initials: socket.handshake.query.initials || "AN",
            status: socket.handshake.query.status || "online",
          }
        : null
    })
    .filter(Boolean)
}

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId

  if (userId) {
    // Store user connection
    activeConnections.set(userId, socket.id)
    console.log(`User ${userId} connected with socket ID: ${socket.id}`)

    // Join user to their personal room
    socket.join(`user:${userId}`)

    // Send welcome notification
    socket.emit("notification", {
      id: Date.now().toString(),
      title: "Connected to FixIt",
      description: "You are now receiving real-time updates",
      type: "system",
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  // Handle joining rooms
  socket.on("join_room", (roomId) => {
    if (!roomId || !userId) return

    socket.join(`room:${roomId}`)

    // Add user to room members
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add(userId)
  })

  // Handle leaving rooms
  socket.on("leave_room", (roomId) => {
    if (!roomId || !userId) return

    socket.leave(`room:${roomId}`)

    // Remove user from room members
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(userId)
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    if (userId) {
      // Remove user connection
      activeConnections.delete(userId)
      console.log(`User ${userId} disconnected`)

      // Remove user from all rooms
      rooms.forEach((roomUsers, roomId) => {
        roomUsers.delete(userId)
      })
    }
  })
})

// Start the server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`)
})
