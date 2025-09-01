const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import services and controllers
const SocketService = require('./services/socketService');
const ChatController = require('./controllers/chatController');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

class ChatServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });
    
    this.port = process.env.PORT || 3001;
    this.socketService = new SocketService(this.io);
    this.chatController = new ChatController(this.socketService);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    });
    this.app.use(limiter);

    // Logging
    this.app.use(morgan('combined'));
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        connections: this.socketService.getConnectionCount()
      });
    });

    // API routes
    this.app.use('/api', require('./routes/api'));
    
    // 404 handler - catch all other routes
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      logger.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);
      
      // Handle user creating a room
      socket.on('create_room', (data) => {
        this.chatController.handleCreateRoom(socket, data);
      });
      
      // Handle user joining
      socket.on('join_room', (data) => {
        this.chatController.handleJoinRoom(socket, data);
      });

      // Handle messages
      socket.on('send_message', (data) => {
        this.chatController.handleSendMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing', (data) => {
        this.chatController.handleTyping(socket, data);
      });

      // Handle user leaving
      socket.on('leave_room', (data) => {
        this.chatController.handleLeaveRoom(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`User disconnected: ${socket.id}, reason: ${reason}`);
        this.chatController.handleDisconnect(socket, reason);
      });

      // Handle connection errors
      socket.on('connect_error', (error) => {
        logger.error('Connection error:', error);
      });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      logger.info(`🚀 Socket.IO Chat Server running on port ${this.port}`);
      logger.info(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
      logger.info(`🔗 Socket.IO endpoint: ws://localhost:${this.port}`);
    });
  }
  
  gracefulShutdown() {
    logger.info('🛑 Starting graceful shutdown...');
    
    this.server.close(() => {
      logger.info('✅ Server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
}

// Create and start server
const server = new ChatServer();

// Handle graceful shutdown
process.on('SIGTERM', () => server.gracefulShutdown());
process.on('SIGINT', () => server.gracefulShutdown());

// Start the server
server.start();
