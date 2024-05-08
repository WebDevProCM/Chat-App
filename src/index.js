const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

io.on("connection", () =>{
    // console.log("user joined");
});

server.listen(process.env.PORT, () =>{
    console.log("seriver is running!");
})