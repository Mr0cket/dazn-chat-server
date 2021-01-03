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

io.on("connection", (socket) => {
  // include the room that the user is in. this is identified by the eventId in the url.
  socket.on("join", ({ username, eventId }) => {
    socket.user = { username, eventId };
    socket.join(eventId);
    console.log(`user ${username} connected. eventId: ${eventId}`);
    socket.broadcast.emit("join", `${username} has joined event ${eventId}`);
  });

  socket.on("chat message", (msg) => {
    console.log(`message from ${socket.id}: ${msg}`);
    io.to(user.eventId).emit("chat message", socket.user + ": " + msg);
  });

  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.user.username);
      }
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.user} has disconnected:`, reason);
  });
});

http.listen(port, () => console.log(`listening on :${port}`));
