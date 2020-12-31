const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chatUi/index.html"); // this is an iframe
});

// WebSocket connections

io.on("connection", (socket) => {
  socket.on("join", (user) => {
    socket.user = user;
    console.log(`user ${user} connected`);
    socket.broadcast.emit("join", `${user} has joined the room`);
  });
  socket.on("disconnect", (reason) => {
    console.log(`${socket.user} has disconnected:`, reason);
  });
  socket.on("chat message", (msg) => {
    console.log(`message from ${socket.id}: ${msg}`);
    io.emit("chat message", socket.user + ": " + msg);
  });
});

http.listen(port, () => console.log(`listening on :${port}`));
