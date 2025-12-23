// backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authenticateToken = require('./middleware/auth'); // ← Our middleware

const app = express();
const PORT = 3000;
const JWT_SECRET = 'my-super-secret-key-2025';

// Middleware (applied globally)
app.use(express.json());
app.use(cors());

// Fake users database
const users = [
  { id: 1, username: 'admin', password: 'admin123' },
  { id: 2, username: 'user',  password: 'password' },
  { id: 3, username: 'test',  password: 'test123' }
];

// ==================== ROUTES ====================

// Public route: Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Protected route: Uses middleware
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome! This is protected data.',
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

// Optional: Add more protected routes easily
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'This is your dashboard',
    user: req.user.username,
    data: ['sales', 'reports', 'analytics']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
  console.log(`Use credentials: admin / admin123`);
});