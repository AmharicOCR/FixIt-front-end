// This file would be used to create a custom server that integrates Socket.IO
// In a production app, you might use this with a separate WebSocket server

const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { setupSocketServer } = require("./app/api/socket/route")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Set up Socket.IO with the server
  const io = setupSocketServer(server)

  // Store the io instance globally for use in API routes
  global.socketIo = io

  const port = process.env.PORT || 3000
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
