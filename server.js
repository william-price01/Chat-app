const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getUser,
  getActiveUsers,
  userLeave,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Chat Bot";

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    // joins room
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
    // /runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getActiveUsers(user.room),
    });
  });
  //listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
