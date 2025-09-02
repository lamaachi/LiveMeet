# LiveMeet - Real-time Chat Application
![Uploading image.png…]()

A modern, real-time chat application built with React, TypeScript, Socket.IO, and Tailwind CSS.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Typing Indicators**: See when other users are typing
- **User Presence**: Real-time user online/offline status
- **Room-based Chat**: Join different chat rooms
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: Simple username-based login
- **Connection Status**: Visual connection indicator
- **Auto-scroll**: Messages automatically scroll to bottom
- **Message Validation**: Input validation and rate limiting

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Winston** - Logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Setup

1. **Start the server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the client**
   ```bash
   cd client
   npm install
   npm start
   ```

3. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Troubleshooting

If you encounter issues with the main server, try the simple server:
```bash
cd server
npm run simple
```

## 📱 Usage

1. **Join Chat**: Enter a username to join the chat
2. **Send Messages**: Type your message and press Enter or click Send
3. **View Users**: Click the users icon to see who's online
4. **Connection Status**: Check the connection indicator in the header

## 🔧 Configuration

Create a `.env` file in the server directory:
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
LOG_LEVEL=info
```

---

**Happy Chatting! 🎉**

