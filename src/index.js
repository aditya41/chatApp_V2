const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    socket.broadcast.emit('message', 'a new user has joined')
    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        io.emit('A user has left')
    })
    socket.on('location', (message) => {
        console.log(message)
        io.emit('message', `https://google.com/maps?q=${message.latitude},${message.longitude}`)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})