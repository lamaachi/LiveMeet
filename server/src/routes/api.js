const express = require('express');
const router = express.Router();

// Get server status
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Get available rooms
router.get('/rooms', (req, res) => {
  try {
    // This would typically come from a database
    const rooms = [
      { id: 'general', name: 'General', type: 'public', userCount: 0 },
      { id: 'random', name: 'Random', type: 'public', userCount: 0 },
      { id: 'help', name: 'Help & Support', type: 'public', userCount: 0 }
    ];
    
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room info
router.get('/rooms/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    
    // This would typically come from a database
    const room = {
      id: roomId,
      name: roomId.charAt(0).toUpperCase() + roomId.slice(1),
      type: 'public',
      userCount: 0,
      createdAt: new Date().toISOString()
    };
    
    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room info' });
  }
});

module.exports = router;
