require('dotenv').config();

module.exports = {
  // Database Configuration
  mongoURI: process.env.MONGODB_URI || process.env.MONGO_URI,

  // Authentication
  jwtSecret: process.env.JWT_SECRET,

  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS Configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Socket.IO Configuration
  socketCorsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',

  // Add other environment variables as needed
};
