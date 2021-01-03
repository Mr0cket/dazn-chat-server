const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});
const corsMiddleware = require("cors")(); // import & create an instance of the middleware
app.use(corsMiddleware);

// WebSocket connections
const eventRooms = {}; // e.g: {8k3h8bepmyl3x0i91zk7n6rys: {title: "Newcastle vs. Leicester", socketsConnected: 2}}

io.on("connection", (socket) => {
  // include the room that the user is in. this is identified by the eventId in the url.
  socket.on("join", (user) => {
    socket.user = user;
    const { username, eventId } = user;
    console.log("eventId type:", typeof eventId);

    socket.join(eventId);
    console.log("rooms:", socket.rooms);
    console.log(`user ${username} connected. eventId: ${eventId}`);
    socket.emit("join", `${username} has joined event ${eventId}`); // later: .to(eventId).broadcast.emit
  });

  socket.on("chat message", (msg) => {
    console.log(`message from ${socket.user.username}: ${msg}`);
    io.to(socket.user.eventId).emit("chat message", socket.user.username + ": " + msg);
  });

  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.user.username);
      }
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.user.username} has disconnected:`, reason);
  });
});

http.listen(port, () => console.log(`listening on :${port}`));
