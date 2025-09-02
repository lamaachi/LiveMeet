import React from 'react';

interface TypingIndicatorProps {
  users: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  const formatTypingText = (users: string[]) => {
    if (users.length === 1) {
      return `${users[0]} is typing...`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing...`;
    } else {
      return `${users[0]} and ${users.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-md">
        <div className="message-bubble message-received">
          <div className="flex items-center space-x-2">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <span className="text-xs text-gray-500">
              {formatTypingText(users)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
