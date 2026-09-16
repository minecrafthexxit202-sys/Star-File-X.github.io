const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('./')); // Phục vụ file index.html

// Quản lý các phòng (Room) theo Mã 9 Số của bên Gửi
io.on('connection', (socket) => {
  // Bên gửi tạo phòng dựa trên Mã 9 Số
  socket.on('register-sender', (senderCode) => {
    socket.join(senderCode);
    socket.senderCode = senderCode;
  });

  // Bên nhận gửi yêu cầu kết nối tới Mã 9 Số của bên gửi
  socket.on('request-pair', ({ senderCode, receiverTempCode }) => {
    // Bắn thông báo xác minh tới đúng Tab của bên gửi
    io.to(senderCode).emit('incoming-pair-request', receiverTempCode);
  });

  // Phản hồi chấp nhận/từ chối
  socket.on('respond-pair', ({ senderCode, receiverTempCode, accepted }) => {
    io.to(senderCode).emit('pair-result', { receiverTempCode, accepted });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Star File X Signal Server đang chạy tại: http://localhost:${PORT}`);
});
