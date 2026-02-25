import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// load environment variables from .env file
dotenv.config();

// parse port from env as number (env vars are strings)
const rawPort = process.env.PORT || '4000';
const PORT = parseInt(rawPort, 10);

// establish database connection first
connectDB().then(() => {
  // bind to all network interfaces (useful for LAN testing)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
