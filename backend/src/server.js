const app = require('./app');
const env = require('./config/env');
const { inMemoryStore } = require('./config/supabase');
const { seedInMemoryStore } = require('./config/seedData');

const PORT = env.PORT || 3001;

async function startServer() {
  // Start HTTP server immediately
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running and listening on port ${PORT}`);
  });

  // Seed memory store asynchronously; do not block server startup
  seedInMemoryStore(inMemoryStore)
    .then(() => console.log('🌱 In-memory demo data seeded successfully.'))
    .catch((err) => console.warn('⚠️ Seeding in-memory store failed:', err && err.message));

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
