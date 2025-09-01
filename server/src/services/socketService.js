const { SOCKET_EVENTS, USER_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

class SocketService {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> Set of socketIds
    this.users = new Map(); // socketId -> userInfo
    this.typingUsers = new Map(); // roomId -> Set of typing socketIds
  }

  /**
   * Creates a new room with a unique ID.
   * @returns {string} The newly generated room ID.
   */
  createRoom() {
    // Generate a unique room ID, for example, using a timestamp and a random string
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.rooms.set(roomId, new Set());
    logger.info(`Room created with ID: ${roomId}`);
    return roomId;
  }

  /**
   * Checks if a room with the given ID exists.
   * @param {string} roomId - The ID of the room to check.
   * @returns {boolean} - True if the room exists, false otherwise.
   */
  roomExists(roomId) {
    return this.rooms.has(roomId);
  }

  /**
   * Retrieves the total number of active socket connections.
   * @returns {number} The current number of connected clients.
   */
  getConnectionCount() {
    return this.io.engine.clientsCount;
  }

  // Join a room
  joinRoom(socket, roomId, userInfo) {
    try {
      // Leave previous room if any
      this.leaveRoom(socket);

      // Join the new room
      socket.join(roomId);
      
      // Store user info
      this.users.set(socket.id, {
        ...userInfo,
        roomId,
        status: USER_STATUS.ONLINE,
        joinedAt: new Date()
      });

      // Add to room
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(socket.id);

      // Notify others in the room
      socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        userId: userInfo.userId,
        username: userInfo.username,
        timestamp: new Date()
      });

      // Send room info to the joining user
      const roomUsers = this.getRoomUsers(roomId);
      socket.emit(SOCKET_EVENTS.ROOM_UPDATE, {
        roomId,
        users: roomUsers,
        timestamp: new Date()
      });

      logger.info(`User ${userInfo.username} joined room ${roomId}`);
      return true;
    } catch (error) {
      logger.error('Error joining room:', error);
      return false;
    }
  }

  // Leave a room
  leaveRoom(socket) {
    const userInfo = this.users.get(socket.id);
    if (!userInfo) return false;

    const { roomId, username } = userInfo;
    
    try {
      // Leave the room
      socket.leave(roomId);
      
      // Remove from room tracking
      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).delete(socket.id);
        if (this.rooms.get(roomId).size === 0) {
          this.rooms.delete(roomId);
        }
      }

      // Remove typing indicator
      this.removeTypingIndicator(roomId, socket.id);

      // Notify others in the room
      socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
        userId: userInfo.userId,
        username,
        timestamp: new Date()
      });

      // Remove user info
      this.users.delete(socket.id);

      logger.info(`User ${username} left room ${roomId}`);
      return true;
    } catch (error) {
      logger.error('Error leaving room:', error);
      return false;
    }
  }

  // Send message to room
  sendMessage(roomId, messageData) {
    try {
      this.io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
        ...messageData,
        timestamp: new Date()
      });
      return true;
    } catch (error) {
      logger.error('Error sending message:', error);
      return false;
    }
  }

  // Handle typing indicator
  setTypingIndicator(roomId, socketId, isTyping) {
    try {
      if (!this.typingUsers.has(roomId)) {
        this.typingUsers.set(roomId, new Set());
      }

      if (isTyping) {
        this.typingUsers.get(roomId).add(socketId);
      } else {
        this.typingUsers.get(roomId).delete(socketId);
      }

      // Notify others in the room
      const typingUsers = this.getTypingUsers(roomId);
      this.io.to(roomId).emit(SOCKET_EVENTS.TYPING, {
        roomId,
        typingUsers,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      logger.error('Error setting typing indicator:', error);
      return false;
    }
  }

  // Remove typing indicator
  removeTypingIndicator(roomId, socketId) {
    if (this.typingUsers.has(roomId)) {
      this.typingUsers.get(roomId).delete(socketId);
    }
  }

  // Get users in a room
  getRoomUsers(roomId) {
    if (!this.rooms.has(roomId)) return [];
    
    const socketIds = this.rooms.get(roomId);
    return Array.from(socketIds)
      .map(socketId => this.users.get(socketId))
      .filter(Boolean);
  }

  // Get typing users in a room
  getTypingUsers(roomId) {
    if (!this.typingUsers.has(roomId)) return [];
    
    const socketIds = this.typingUsers.get(roomId);
    return Array.from(socketIds)
      .map(socketId => this.users.get(socketId))
      .filter(Boolean)
      .map(user => ({
        userId: user.userId,
        username: user.username
      }));
  }

  // Get user info
  getUserInfo(socketId) {
    return this.users.get(socketId);
  }

  // Update user status
  updateUserStatus(socketId, status) {
    const userInfo = this.users.get(socketId);
    if (userInfo) {
      userInfo.status = status;
      this.users.set(socketId, userInfo);
    }
  }

  // Disconnect user
  disconnectUser(socketId) {
    const userInfo = this.users.get(socketId);
    if (userInfo) {
      this.leaveRoom({ id: socketId, leave: () => {} });
    }
  }

  // Get all rooms
  getAllRooms() {
    return Array.from(this.rooms.keys());
  }

  // Get room info
  getRoomInfo(roomId) {
    if (!this.rooms.has(roomId)) return null;
    
    return {
      roomId,
      userCount: this.rooms.get(roomId).size,
      users: this.getRoomUsers(roomId)
    };
  }
}

module.exports = SocketService;
