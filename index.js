const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = 5001;

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
app.use(cors());

const io = new Server(server, {
  perMessageDeflate: false,
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://trosv.vercel.app",
  },
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  console.log("someone has connected");
  //
  socket.on("addUser", (userId) => {
    addNewUser(userId, socket.id);
    console.log(onlineUsers);
    console.log("someone has logined");
  });
  //
  socket.on("sendNotification", (notification) => {
    console.log(notification);
    const user = getUser(notification.receiverId);
    console.log(user);
    user && io.to(user.socketId).emit("getNotification", notification);
  });

  socket.on("disconnect", () => {
    console.log("someone has left");

    removeUser(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
