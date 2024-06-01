'use strict';
const socketIO = require('socket.io');
const { CLIENT_URL } = process.env;
let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: CLIENT_URL,
        credentials: true,
      },
    });

    // Lắng nghe sự kiện "connection" khi có một client kết nối
    io.on("connection", (socket) => {
      console.log('added connection');
      socket.on("notifications", () => {
        io.emit("notifications");
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
