import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { inMemoryDb } from '../config/db.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'campusexchange_super_secret_access_key_2026_x987';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campusexchange_super_secret_refresh_key_2026_y654';

// Utility to generate JWT tokens
const generateTokens = (user) => {
  const payload = {
    userId: user._id || user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    college: user.college
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken, payload };
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, hostel } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Validate College Email Domain
    const isCollegeDomain = email.includes('.edu') || email.includes('.ac.') || email.includes('college') || email.includes('student');
    if (!isCollegeDomain) {
      return res.status(400).json({ 
        message: 'Please use a valid college email address (e.g. name@stanford.edu, student@mit.edu).' 
      });
    }

    // Check existing
    let existingUser = null;
    if (!inMemoryDb.isInMemory) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = Array.from(inMemoryDb.users.values()).find(u => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this college email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserObj = {
      _id: 'user_' + Date.now(),
      name,
      email,
      passwordHash,
      college: college || 'University Campus',
      hostel: hostel || 'Main Quad',
      role: 'student',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      isVerified: true,
      createdAt: new Date()
    };

    if (!inMemoryDb.isInMemory) {
      const created = await User.create(newUserObj);
      newUserObj._id = created._id;
    } else {
      inMemoryDb.users.set(newUserObj._id, newUserObj);
    }

    const { accessToken, refreshToken, payload } = generateTokens(newUserObj);

    // Set httpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      message: 'Account registered successfully!',
      accessToken,
      user: {
        id: newUserObj._id,
        name: newUserObj.name,
        email: newUserObj.email,
        college: newUserObj.college,
        hostel: newUserObj.hostel,
        role: newUserObj.role,
        avatarUrl: newUserObj.avatarUrl,
        isVerified: newUserObj.isVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    let user = null;
    if (!inMemoryDb.isInMemory) {
      user = await User.findOne({ email });
    } else {
      user = Array.from(inMemoryDb.users.values()).find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid college email or password.' });
    }

    // Verify Password (handle demo hashed vs standard bcrypt)
    let isMatch = false;
    if (user.passwordHash?.startsWith('$2a$10$wT5gC')) {
      isMatch = password === 'password123';
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid college email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Set httpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Logged in successfully.',
      accessToken,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        hostel: user.hostel,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// 3. REFRESH TOKEN
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token cookie missing.' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }

    let user = null;
    if (!inMemoryDb.isInMemory) {
      user = await User.findById(decoded.userId);
    } else {
      user = inMemoryDb.users.get(decoded.userId);
    }

    if (!user) {
      return res.status(403).json({ message: 'User account no longer exists.' });
    }

    const { accessToken } = generateTokens(user);
    return res.json({ accessToken });
  });
});

// 4. LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return res.json({ message: 'Logged out successfully.' });
});

// 5. GET CURRENT USER PROFILE
router.get('/me', verifyJWT, async (req, res) => {
  let user = null;
  if (!inMemoryDb.isInMemory) {
    user = await User.findById(req.user.userId).select('-passwordHash');
  } else {
    user = inMemoryDb.users.get(req.user.userId);
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    college: user.college,
    hostel: user.hostel,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified
  });
});

export default router;
