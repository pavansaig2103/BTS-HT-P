const app = require('./app');
const env = require('./config/env');
const { inMemoryStore } = require('./config/supabase');
const { seedInMemoryStore } = require('./config/seedData');

const PORT = env.PORT || 3001;

async function startServer() {
  // Seed memory store with demo workflow for guaranteed offline / test experience
  await seedInMemoryStore(inMemoryStore);

  const server = app.listen(PORT, () => {
    console.log(`
  ======================================================
  🚀 AccessFlow AI Backend Server Active
  🌐 Port: ${PORT}
  🌍 Environment: ${env.NODE_ENV}
  🩺 Health check: http://localhost:${PORT}/health
  👥 Frontend URL: ${env.FRONTEND_URL}
  ======================================================
    `);
  });

  const handleShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
