const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const badWords = require("bad-words");
const getTools = require("./utilis/getTools.js");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

io.on("connection", (socket) =>{

    socket.on("room", (roomData, callback) =>{
        const user = getTools.addUser(roomData.username, roomData.room, socket.id);
        if(user.error){
            return callback(user.error);
        }

        socket.join(user.room);
        socket.emit("message", getTools.generateMessage(`Welcome ${user.username}!`, "System"));
        socket.broadcast.to(user.room).emit("message", getTools.generateMessage(`${user.username} has joined!`, "System"));
        callback();
    })

    socket.on("message", (message, callback) =>{
        const user = getTools.getUserById(socket.id);
        if(user.error){
            return callback(user.error);
        }
        const badWordsStatus = new badWords();
        if(badWordsStatus.isProfane(message)){
            return callback("Your message contains inappropriate words!");
        }

        io.to(user.room).emit("message", getTools.generateMessage(message, user.username));
        callback();
    });

    socket.on("location", (location, callback) =>{
        const user = getTools.getUserById(socket.id);
        if(user.error){
            return callback(user.error);
        }
        io.to(user.room).emit("location", getTools.generateMessage(location, user.username));
        callback();
    });

    socket.on("disconnect", () =>{
        const user = getTools.getUserById(socket.id);
        getTools.removeUser(user.username, user.room);
        io.emit("message", getTools.generateMessage(`${user.username} has left!`, "System"));
    })
});

server.listen(process.env.PORT, () =>{
    console.log("seriver is running!");
})