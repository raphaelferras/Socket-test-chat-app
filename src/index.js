const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

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
    socket.broadcast.emit('message', 'a new user has joined')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profane words')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })
})


// Start the server UP
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})