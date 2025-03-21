const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const stockData = require('./stockData');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up CORS
app.use(cors());
app.use(express.json());

// Configure Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// API Routes
app.get('/api/stock/history', (req, res) => {
  res.json(stockData.getStockHistory());
});

app.get('/api/stock/info', (req, res) => {
  res.json(stockData.getStockInfo());
});

app.get('/api/user/position', (req, res) => {
  res.json(stockData.getUserPosition());
});

app.post('/api/trade', (req, res) => {
  const { action, shares } = req.body;
  
  if (!action || !shares) {
    return res.status(400).json({ 
      success: false, 
      message: 'Action and shares are required' 
    });
  }
  
  const result = stockData.executeTrade(action, shares);
  
  if (result.success) {
    // Broadcast updated position to all clients
    io.emit('position_update', stockData.getUserPosition());
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data to the newly connected client
  socket.emit('stock_info', stockData.getStockInfo());
  socket.emit('position_update', stockData.getUserPosition());
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Handle trade requests via socket
  socket.on('trade', (data) => {
    const { action, shares } = data;
    const result = stockData.executeTrade(action, shares);
    
    if (result.success) {
      // Broadcast updated position to all clients
      io.emit('position_update', stockData.getUserPosition());
      socket.emit('trade_result', result);
    } else {
      socket.emit('trade_result', result);
    }
  });
});

// Start price update interval (every second)
const priceUpdateInterval = setInterval(() => {
  const updatedStock = stockData.updateStockPrice();
  io.emit('stock_update', updatedStock);
}, 1000);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  clearInterval(priceUpdateInterval);
  io.close();
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
}); 