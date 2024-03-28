const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')

const publicDir = path.join(__dirname, '../public');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

//Setup static directory to server
app.use(express.static(publicDir))

io.on('connection', (socket) => {
    console.log('new WebSocket connection')
    socket.emit('message', 'welcome')
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

// Start the server UP
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})