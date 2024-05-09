const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const badWords = require("bad-words");
const getMessage = require("./utilis/getMessage.js");
const generateMessage = require("./utilis/getMessage.js");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

io.on("connection", (socket) =>{

    socket.emit("message", generateMessage("Welcome user!"));
    socket.broadcast.emit("message", generateMessage("User has joined!"));

    socket.on("message", (message, callback) =>{
        const badWordsStatus = new badWords();
        if(badWordsStatus.isProfane(message)){
            return callback("Your message contains inappropriate words!");
        }

        io.emit("message", getMessage(message));
        callback();
    });

    socket.on("location", (location, callback) =>{
        io.emit("location", generateMessage(location));
        callback();
    });
});

server.listen(process.env.PORT, () =>{
    console.log("seriver is running!");
})