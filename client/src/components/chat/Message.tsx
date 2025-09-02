import React from 'react';
import { format } from 'date-fns';

interface MessageProps {
  message: {
    id: string;
    userId: string;
    username: string;
    message: string;
    messageType: string;
    timestamp: Date;
  };
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp: Date) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div className={`message-bubble ${isOwnMessage ? 'message-sent' : 'message-received'}`}>
          {!isOwnMessage && (
            <div className="text-xs font-medium text-gray-500 mb-1">
              {message.username}
            </div>
          )}
          <div className="text-sm">
            {message.message}
          </div>
          <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
