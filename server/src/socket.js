const socketIo = require('socket.io');

let io;
const players = new Map();

const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('join_world', (userData) => {
      players.set(socket.id, {
        id: socket.id,
        address: userData.address,
        position: userData.position || [0, 0, 0],
        avatar: userData.avatar || {}
      });
      
      // Broadcast new player to others
      socket.broadcast.emit('player_joined', players.get(socket.id));
      
      // Send current players to the new user
      socket.emit('current_players', Array.from(players.values()));
    });

    socket.on('move', (position) => {
      if (players.has(socket.id)) {
        const player = players.get(socket.id);
        player.position = position;
        socket.broadcast.emit('player_moved', { id: socket.id, position });
      }
    });

    socket.on('chat_message', (msg) => {
      const player = players.get(socket.id);
      if (player) {
        io.emit('new_message', {
          sender: player.address,
          text: msg,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
      players.delete(socket.id);
      io.emit('player_left', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { init, getIo };
