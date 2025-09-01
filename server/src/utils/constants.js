// Socket.IO event constants
const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_SENT: 'message_sent',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  ROOM_UPDATE: 'room_update',
  ERROR: 'error'
};

// Message types
const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

// Room types
const ROOM_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct'
};

// User status
const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
};

// Rate limiting
const RATE_LIMITS = {
  MESSAGE: 10, // messages per minute
  TYPING: 30,  // typing events per minute
  JOIN: 5      // room joins per minute
};

// Validation
const VALIDATION = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_USERNAME_LENGTH: 30,
  MAX_ROOM_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6
};

module.exports = {
  SOCKET_EVENTS,
  MESSAGE_TYPES,
  ROOM_TYPES,
  USER_STATUS,
  RATE_LIMITS,
  VALIDATION
};
