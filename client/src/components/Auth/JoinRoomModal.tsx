import React, { useState, useEffect } from 'react';
import { X, Hash, Plus, ArrowRight } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string, username: string) => void;
  onCreateRoom: (username: string) => void;
  isLoading?: boolean;
  error?: string;
  isCreatingDefault?: boolean;
  initialRoomId?: string;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onJoinRoom,
  onCreateRoom,
  isLoading = false,
  error,
  isCreatingDefault = false,
  initialRoomId = ''
}) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId);
  const [isCreatingRoom, setIsCreatingRoom] = useState(isCreatingDefault);

  useEffect(() => {
    if (isOpen) {
      setIsCreatingRoom(isCreatingDefault);
      setRoomId(initialRoomId);
    }
  }, [isOpen, isCreatingDefault, initialRoomId]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      onJoinRoom(roomId.trim(), username.trim());
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onCreateRoom(username.trim());
    }
  };

  const handleClose = () => {
    setUsername('');
    setRoomId('');
    setIsCreatingRoom(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isCreatingRoom ? 'Create a New Room' : 'Join a Room'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isCreatingRoom ? (
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label htmlFor="username-create" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="username-create"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg"
              >
                {isLoading ? 'Creating...' : 'Create and Join'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label htmlFor="username-join" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="username-join"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                  Room ID
                </label>
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter room ID"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !username.trim() || !roomId.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg"
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsCreatingRoom(!isCreatingRoom)}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              {isCreatingRoom ? 'Want to join a room instead?' : 'Or, create a new room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;
