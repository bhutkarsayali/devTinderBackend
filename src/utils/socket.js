const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    core: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // Handle the events
    socket.on("joinChat", () => {});
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
