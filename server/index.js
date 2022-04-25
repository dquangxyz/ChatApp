const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")


app.use(cors())

const server = http.createServer(app)

//Initialize Socket.io (to be on port 3001, and communicate with port 3000 from front-end)
//connect back-end to front-end
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //specify which server will call our Socket.io server
        methods: ["GET", "POST"]
    }
})

//Set up connection
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    //when receive event "join_room" (from front-end), do the function with the delivered data (room)
    socket.on("join_room", (room) => {
        socket.join(room)
        console.log(`User with ID: ${socket.id} joined the room: ${room}`)
    })

    socket.on("send_message", (messageData) => {
        socket.to(messageData.room).emit("receive_message", messageData)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

//Listen to selected port
//React by default runs on port 3000, so we choose another port for Socket.io
server.listen(3001, () => {
    console.log("Server is running")
})
