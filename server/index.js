require('dotenv').config();
const app = require('./src/app');
const seedDatabase = require('./src/config/seed');
const prisma = require('./src/config/prisma');

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    // Ensure database connection
    await prisma.$connect();
    console.log('📦 Connected to Database');

    // Run seed if necessary
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 API and Auth server listening on http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
