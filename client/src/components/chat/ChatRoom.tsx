import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { Send, Users, MessageCircle, Settings, LogOut } from 'lucide-react';
import Message from './Message';
import MessageInput from './MessageInput';
import UserList from './UserList';
import TypingIndicator from './TypingIndicator';
import ConnectionStatus from '../UI/ConnectionStatus';
import LoginModal from '../Auth/LoginModal';

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  messageType: string;
  timestamp: Date;
}

interface User {
  userId: string;
  username: string;
  status: string;
}

interface ChatRoomProps {
  roomId: string;
  roomName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, roomName }) => {
  const { socket, isConnected: socketIsConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ userId: string; username: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (socket) {
      // Socket event listeners
      socket.on('message_received', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('user_joined', (data: { userId: string; username: string }) => {
        setUsers(prev => [...prev, { ...data, status: 'online' }]);
      });

      socket.on('user_left', (data: { userId: string; username: string }) => {
        setUsers(prev => prev.filter(user => user.userId !== data.userId));
      });

      socket.on('room_update', (data: { users: User[] }) => {
        setUsers(data.users);
      });

      socket.on('typing', (data: { typingUsers: { username: string }[] }) => {
        setTypingUsers(data.typingUsers.map(u => u.username));
      });

      socket.on('error', (error: { message: string }) => {
        console.error('Socket error:', error.message);
      });

      return () => {
        socket.off('message_received');
        socket.off('user_joined');
        socket.off('user_left');
        socket.off('room_update');
        socket.off('typing');
        socket.off('error');
      };
    }
  }, [socket]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      joinRoom(user);
    } else {
      setShowLoginModal(true);
    }
  }, [socket]);

  const joinRoom = (user: { userId: string; username: string }) => {
    if (socket && user) {
      socket.emit('join_room', {
        roomId,
        userId: user.userId,
        username: user.username
      });
    }
  };

  const handleLogin = (username: string) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = { userId, username };
    
    setCurrentUser(user);
    localStorage.setItem('chatUser', JSON.stringify(user));
    setShowLoginModal(false);
    
    joinRoom(user);
  };

  const handleSendMessage = (message: string) => {
    if (socket && currentUser && message.trim()) {
      socket.emit('send_message', {
        roomId,
        message: message.trim(),
        messageType: 'text'
      });
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && currentUser) {
      socket.emit('typing', {
        roomId,
        isTyping
      });
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leave_room', { roomId });
      setCurrentUser(null);
      localStorage.removeItem('chatUser');
      setShowLoginModal(true);
      setMessages([]);
      setUsers([]);
    }
  };

  if (!currentUser) {
    return (
      <LoginModal 
        isOpen={showLoginModal} 
        onLogin={handleLogin} 
        onClose={() => setShowLoginModal(false)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{roomName}</h1>
                <p className="text-sm text-gray-500">
                  {users.length} {users.length === 1 ? 'person' : 'people'} online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ConnectionStatus isConnected={socketIsConnected} />
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLeaveRoom}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                title="Leave Room"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.userId === currentUser.userId}
            />
          ))}
          
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} />
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <MessageInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            disabled={!socketIsConnected}
          />
        </div>
      </div>

      {/* User List Sidebar */}
      {showUserList && (
        <div className="w-80 bg-white border-l border-gray-200">
          <UserList users={users} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
