import React from 'react';
import { Users, Circle } from 'lucide-react';

interface User {
  userId: string;
  username: string;
  status: string;
}

interface UserListProps {
  users: User[];
  currentUser: {
    userId: string;
    username: string;
  };
}

const UserList: React.FC<UserListProps> = ({ users, currentUser }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'busy':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Online Users</h2>
          <span className="text-sm text-gray-500">({users.length})</span>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No users online</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.userId}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  user.userId === currentUser.userId
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <Circle
                    className={`h-3 w-3 absolute -bottom-1 -right-1 ${getStatusColor(
                      user.status
                    )}`}
                    fill="currentColor"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium truncate ${
                        user.userId === currentUser.userId
                          ? 'text-primary-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {user.username}
                      {user.userId === currentUser.userId && ' (You)'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {getStatusText(user.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
