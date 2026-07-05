const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
// Note: In local development, ensure your MongoDB service is running or provide a valid connection string in the .env file.
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lightweight CRM API' });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = { app, server };
