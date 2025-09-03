const express = require('express');
const serverless = require('serverless-http');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

// In-memory store for rooms and users (not suitable for production)
const rooms = new Map();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('create_room', ({ username }) => {
    const roomId = `room_${Math.random().toString(36).substr(2, 5)}`;
    socket.join(roomId);
    rooms.set(roomId, { users: [{ id: socket.id, username }] });
    socket.emit('room_created', { roomId });
    io.to(roomId).emit('room_update', { users: rooms.get(roomId).users });
  });

  socket.on('join_room', ({ roomId, username }) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      const room = rooms.get(roomId);
      room.users.push({ id: socket.id, username });
      io.to(roomId).emit('room_update', { users: room.users });
    } else {
      socket.emit('error', { message: 'Room not found' });
    }
  });

  socket.on('send_message', ({ roomId, message, username }) => {
    io.to(roomId).emit('message_received', { username, message });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      const userIndex = room.users.findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        io.to(roomId).emit('room_update', { users: room.users });
      }
    });
  });
});

// This is the magic that makes it work with Netlify Functions
module.exports.handler = serverless(app);

// We need to also export the server for local development
if (process.env.NODE_ENV !== 'production') {
  server.listen(3001, () => {
    console.log('Socket.IO server running on http://localhost:3001');
  });
}
