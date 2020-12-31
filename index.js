const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.send(__dirname + "/chatUi/index.html"); // this is an iframe
});

// WebSocket connections

io.on("connection", (socket) => {
  console.log("a user connected");
});

http.listen(port, () => console.log(`listening on :${port}`));
