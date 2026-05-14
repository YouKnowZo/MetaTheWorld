require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const socketManager = require('./src/socket');
const seedDatabase = require('./src/config/seed');
const prisma = require('./src/config/prisma');

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

// Initialize Real-time Layer
socketManager.init(server);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Connected to Database');
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 API, Auth and Real-time server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
