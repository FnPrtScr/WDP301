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
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
      })
      socket.on('sendMessage', async (data) => {
        const { roomId, message } = data
        try {
          io.to(+roomId).emit('receiveMessage', data);
        } catch (error) {
          socket.emit('errorMessage', { error: error.message });
        }
      });

      // Lắng nghe việc tải file từ client
      // socket.on('file upload', (filePath) => {
      //   io.emit('file upload', filePath);
      // });
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
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
