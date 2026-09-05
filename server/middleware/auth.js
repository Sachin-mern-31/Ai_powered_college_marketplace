import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { inMemoryDb } from '../config/db.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'campusexchange_super_secret_access_key_2026_x987';

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized access. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired or invalid.' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication verification failed.' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
