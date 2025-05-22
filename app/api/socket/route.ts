// import type { Server as NetServer } from "http"
// import { Server as SocketIOServer } from "socket.io"

// export const dynamic = "force-dynamic"

// // Store active connections
// const activeConnections = new Map()

// // This is a workaround for Socket.IO with Next.js App Router
// // In a production app, you would use a proper WebSocket server
// export async function GET(req: Request) {
//   // This is a placeholder for the actual WebSocket server implementation
//   // In a real app, you would set up a separate Socket.IO server
//   return new Response("WebSocket server endpoint", { status: 200 })
// }

// // This function would be used in a custom server setup
// export const setupSocketServer = (server: NetServer) => {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   })

//   io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId as string

//     if (userId) {
//       // Store user connection
//       activeConnections.set(userId, socket.id)
//       console.log(`User ${userId} connected with socket ID: ${socket.id}`)

//       // Join user to their personal room
//       socket.join(`user:${userId}`)

//       // Example: Send welcome message
//       socket.emit("notification", {
//         id: Date.now().toString(),
//         title: "Connected to FixIt",
//         description: "You are now receiving real-time updates",
//         type: "system",
//         read: false,
//         createdAt: new Date().toISOString(),
//       })
//     }

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       if (userId) {
//         activeConnections.delete(userId)
//         console.log(`User ${userId} disconnected`)
//       }
//     })

//     // Handle joining error rooms
//     socket.on("join_error_room", (errorId) => {
//       socket.join(`error:${errorId}`)
//       console.log(`Socket ${socket.id} joined room for error ${errorId}`)
//     })

//     // Handle leaving error rooms
//     socket.on("leave_error_room", (errorId) => {
//       socket.leave(`error:${errorId}`)
//       console.log(`Socket ${socket.id} left room for error ${errorId}`)
//     })

//     // Handle joining team rooms
//     socket.on("join_team_room", (teamId) => {
//       socket.join(`team:${teamId}`)
//       console.log(`Socket ${socket.id} joined room for team ${teamId}`)
//     })
//   })

//   return io
// }

// // Helper function to send notification to a specific user
// export const sendNotificationToUser = (userId: string, notification: any) => {
//   const io = global.socketIo
//   if (io) {
//     io.to(`user:${userId}`).emit(`${notification.type}_notification`, notification)
//   }
// }

// // Helper function to send notification to all users in an error room
// export const sendNotificationToErrorRoom = (errorId: string, notification: any) => {
//   const io = global.socketIo
//   if (io) {
//     io.to(`error:${errorId}`).emit(`${notification.type}_notification`, notification)
//   }
// }

// // Helper function to send notification to all users in a team room
// export const sendNotificationToTeam = (teamId: string, notification: any) => {
//   const io = global.socketIo
//   if (io) {
//     io.to(`team:${teamId}`).emit(`${notification.type}_notification`, notification)
//   }
// }
