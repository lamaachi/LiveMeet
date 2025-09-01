const { SOCKET_EVENTS, MESSAGE_TYPES, VALIDATION } = require('../utils/constants');
const logger = require('../utils/logger');

class ChatController {
  constructor(socketService) {
    this.socketService = socketService;
  }
  
  /**
   * Handles a user's request to create a new chat room.
   * @param {Socket} socket - The socket instance of the user.
   * @param {object} data - The data sent by the user, containing userId and username.
   */
  handleCreateRoom(socket, data) {
    try {
      const { userId, username } = data;

      // Basic validation for incoming data
      if (!userId || !username) {
        return socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Creating a room requires a userId and username.'
        });
      }

      // Generate a unique room ID
      const roomId = this.socketService.createRoom();
      
      // Automatically have the user join the room they created
      const success = this.socketService.joinRoom(socket, roomId, { userId, username, socketId: socket.id });

      if (success) {
        // Notify the user that the room was created and they've joined
        socket.emit(SOCKET_EVENTS.ROOM_CREATED, {
          roomId,
          success: true,
          message: `Room created successfully with ID: ${roomId}`
        });
      } else {
        // Handle the unlikely case where joining the new room fails
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Failed to join the newly created room.'
        });
      }
    } catch (error) {
      logger.error('Error in handleCreateRoom:', error);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'An unexpected error occurred while creating the room.'
      });
    }
  }

  /**
   * Handles a user's request to join an existing chat room.
   * @param {Socket} socket - The socket instance of the user.
   * @param {object} data - The data sent by the user, containing roomId, userId, and username.
   */
  handleJoinRoom(socket, data) {
    try {
      const { roomId, userId, username } = data;

      // Detailed validation for all required fields
      if (!roomId || !userId || !username) {
        return socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'To join a room, you must provide a room ID, user ID, and username.'
        });
      }

      // Check if the room exists before attempting to join
      if (!this.socketService.roomExists(roomId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, {
          message: `The room with ID '${roomId}' does not exist.`
        });
      }

      // Attempt to add the user to the specified room
      const success = this.socketService.joinRoom(socket, roomId, { userId, username, socketId: socket.id });

      if (success) {
        // Confirm to the user that they have successfully joined the room
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
          roomId,
          success: true,
          message: `You have successfully joined room: ${roomId}`
        });
      } else {
        // Handle cases where joining might fail (e.g., room is full, user is banned)
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'There was an issue joining the room. Please try again.'
        });
      }
    } catch (error) {
      logger.error('Error in handleJoinRoom:', error);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'An internal server error occurred while trying to join the room.'
      });
    }
  }

  // Handle sending messages
  handleSendMessage(socket, data) {
    try {
      const { roomId, message, messageType = MESSAGE_TYPES.TEXT } = data;
      const userInfo = this.socketService.getUserInfo(socket.id);

      if (!userInfo) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'You must join a room first'
        });
        return;
      }

      if (!roomId || !message) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Missing required fields: roomId, message'
        });
        return;
      }

      // Validate message length
      if (message.length > VALIDATION.MAX_MESSAGE_LENGTH) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: `Message too long. Maximum ${VALIDATION.MAX_MESSAGE_LENGTH} characters.`
        });
        return;
      }

      // Create message object
      const messageData = {
        id: this.generateMessageId(),
        roomId,
        userId: userInfo.userId,
        username: userInfo.username,
        message,
        messageType,
        timestamp: new Date()
      };

      // Send message to room
      const success = this.socketService.sendMessage(roomId, messageData);

      if (success) {
        // Confirm message sent
        socket.emit(SOCKET_EVENTS.MESSAGE_SENT, {
          messageId: messageData.id,
          success: true
        });
      } else {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Failed to send message'
        });
      }
    } catch (error) {
      logger.error('Error in handleSendMessage:', error);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'Internal server error'
      });
    }
  }

  // Handle typing indicators
  handleTyping(socket, data) {
    try {
      const { roomId, isTyping } = data;
      const userInfo = this.socketService.getUserInfo(socket.id);

      if (!userInfo || !roomId) {
        return;
      }

      this.socketService.setTypingIndicator(roomId, socket.id, isTyping);
    } catch (error) {
      logger.error('Error in handleTyping:', error);
    }
  }

  // Handle user leaving a room
  handleLeaveRoom(socket, data) {
    try {
      const success = this.socketService.leaveRoom(socket);
      
      if (success) {
        socket.emit(SOCKET_EVENTS.LEAVE_ROOM, {
          success: true,
          message: 'Successfully left room'
        });
      } else {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Failed to leave room'
        });
      }
    } catch (error) {
      logger.error('Error in handleLeaveRoom:', error);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'Internal server error'
      });
    }
  }

  // Handle user disconnection
  handleDisconnect(socket, reason) {
    try {
      this.socketService.disconnectUser(socket.id);
      logger.info(`User disconnected: ${socket.id}, reason: ${reason}`);
    } catch (error) {
      logger.error('Error in handleDisconnect:', error);
    }
  }

  // Generate unique message ID
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = ChatController;
