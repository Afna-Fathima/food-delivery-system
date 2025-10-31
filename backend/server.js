const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};

const io = socketIO(server, {
  cors: corsOptions,
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.set('io', io);

// Database Connection
db();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food Delivery API', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running', port: PORT });
});

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins restaurant room for real-time updates
  socket.on('join-restaurant', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    console.log(`Socket ${socket.id} joined restaurant-${restaurantId}`);
  });

  // User joins customer room for order updates
  socket.on('join-customer', (customerId) => {
    socket.join(`customer-${customerId}`);
    console.log(`Socket ${socket.id} joined customer-${customerId}`);
  });

  // Leave room
  socket.on('leave-restaurant', (restaurantId) => {
    socket.leave(`restaurant-${restaurantId}`);
    console.log(`Socket ${socket.id} left restaurant-${restaurantId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
