import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [status, setStatus] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API base URL based on environment
  const getApiUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:8888/.netlify/functions/api';
    }
    return '/api'; // In production, this will be redirected to functions
  };

  // Fetch server status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/status`);
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/rooms`);
      const data = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific room
  const fetchRoom = async (roomId) => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/rooms/${roomId}`);
      const data = await response.json();
      setSelectedRoom(data.room);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchRooms();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LiveMeet API Test</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {loading && <div>Loading...</div>}

      {/* Server Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Server Status</h2>
        {status && (
          <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            <p><strong>Status:</strong> {status.status}</p>
            <p><strong>Version:</strong> {status.version}</p>
            <p><strong>Uptime:</strong> {Math.round(status.uptime)} seconds</p>
            <p><strong>Timestamp:</strong> {new Date(status.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Rooms List */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Available Rooms</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {rooms.map(room => (
            <div 
              key={room.id} 
              style={{ 
                background: '#f0f8ff', 
                padding: '10px', 
                borderRadius: '5px',
                cursor: 'pointer',
                border: selectedRoom?.id === room.id ? '2px solid blue' : '1px solid #ddd'
              }}
              onClick={() => fetchRoom(room.id)}
            >
              <h3>{room.name}</h3>
              <p>Type: {room.type} | Users: {room.userCount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Room Details */}
      {selectedRoom && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Room Details</h2>
          <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
            <h3>{selectedRoom.name}</h3>
            <p><strong>ID:</strong> {selectedRoom.id}</p>
            <p><strong>Type:</strong> {selectedRoom.type}</p>
            <p><strong>Users:</strong> {selectedRoom.userCount}</p>
            <p><strong>Created:</strong> {new Date(selectedRoom.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Test Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={fetchStatus}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Refresh Status
        </button>
        <button 
          onClick={fetchRooms}
          style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Refresh Rooms
        </button>
      </div>
    </div>
  );
};

export default ApiTest;