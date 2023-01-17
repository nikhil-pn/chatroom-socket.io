const { log } = require("console");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 3001;
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

const usernames = {};
const rooms = [
  { name: "globalChat", creator: "anonymous" },
  { name: "nofood", creator: "anonymous" },
  { name: "foodie", creator: "anonymous" },
];
//we need to write all the socket realeated func inside the io.on()
io.on("connection", (socket) => {
  socket.on("createUser", (username) => {
    socket.username = username;
    usernames[username] = username;
    socket.currentRoom = "globalChat";

    socket.join("globalChat");

    socket.emit("updateChat", "INFO", "you have joined Global Chat");

    socket.broadcast.to("globalChat").emit("updateChat", "INFO",  username + " has joined global room")

    io.sockets.emit("updateUsers", usernames);
    socket.emit("updateRooms", rooms, "globalChat")

  });
  socket.on("message", (data) => {
    console.log("msg recieved here", data);
    io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data);
  });
  socket.on("updateRooms", (data) => {
        socket.broadcast.to(socket.currentRoom).emit("updateChat", "INFO", socket.username+ "left the room")
        socket.leave(socket.currentRoom)
        socket.currentRoom = data
        socket.join(data)
        socket.emit("updateChat", "INFO", "You have joined the room", socket.username)
    });
});

server.listen(PORT, () => {
  console.log("Server is running at PORT", PORT);
});
