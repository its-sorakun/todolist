const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');

// 1. JWT Cookie Protection (For the React Frontend)
exports.protectCookie = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user no longer exists' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// 2. Dual Authentication (Cookie OR API Key)
// Use this for the Notes CRUD so both the UI and Kiko can access it.
exports.protectDual = async (req, res, next) => {
  try {
    // Check for API Key first (Kiko)
    const apiKeyHeader = req.header('x-api-key') || req.header('authorization')?.replace('Bearer ', '');
    
    if (apiKeyHeader) {
      const apiKeyDoc = await ApiKey.findOne({ rawKey: apiKeyHeader }).populate('user');
      
      if (!apiKeyDoc || !apiKeyDoc.user) {
        return res.status(401).json({ error: 'Invalid API Key' });
      }

      // Update last used timestamp asynchronously
      apiKeyDoc.lastUsedAt = new Date();
      apiKeyDoc.save().catch(e => console.error(e));

      req.user = apiKeyDoc.user;
      return next();
    }

    // Fallback to checking the cookie (Frontend UI)
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    }

    res.status(401).json({ error: 'Not authorized. Provide a JWT Cookie or X-API-Key header.' });
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
