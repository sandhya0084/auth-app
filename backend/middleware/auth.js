// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my-super-secret-key-2025'; // Keep same as in server.js

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Save user info for use in route
    next(); // Proceed to the protected route
  });
}

module.exports = authenticateToken;