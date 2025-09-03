import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { X } from 'lucide-react';

interface RoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
}

const RoomsModal: React.FC<RoomsModalProps> = ({ isOpen, onClose, onJoinRoom }) => {
  const { socket } = useSocket();
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && socket) {
      socket.emit('get_rooms');
      socket.on('rooms_list', ({ rooms }) => {
        setRooms(rooms);
      });
    }

    return () => {
      if (socket) {
        socket.off('rooms_list');
      }
    };
  }, [isOpen, socket]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {rooms.length > 0 ? (
            <ul className="space-y-2">
              {rooms.map((roomId) => (
                <li key={roomId} className="flex items-center justify-between p-2 border rounded-lg">
                  <span>{roomId}</span>
                  <button
                    onClick={() => onJoinRoom(roomId)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No rooms available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsModal;
