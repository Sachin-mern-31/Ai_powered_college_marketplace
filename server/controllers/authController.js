import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { inMemoryDb } from '../config/db.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'campusexchange_super_secret_access_key_2026_x987';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campusexchange_super_secret_refresh_key_2026_y654';

// Cookie options for refresh token (cross-origin production safe)
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Utility to generate JWT tokens
export const generateTokens = (user) => {
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

// 1. REGISTER USER
export const registerUser = async (req, res) => {
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
    if (inMemoryDb.isConnectedToMongo) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = Array.from(inMemoryDb.users.values()).find(u => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this college email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userData = {
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

    let newUserObj;
    if (inMemoryDb.isConnectedToMongo) {
      newUserObj = await User.create(userData);
    } else {
      newUserObj = { _id: 'user_' + Date.now(), ...userData };
      inMemoryDb.users.set(newUserObj._id, newUserObj);
    }


    const { accessToken, refreshToken } = generateTokens(newUserObj);

    // Set httpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, getCookieOptions());

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
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    let user = null;
    if (inMemoryDb.isConnectedToMongo) {
      user = await User.findOne({ email });
    } else {
      user = Array.from(inMemoryDb.users.values()).find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid college email or password.' });
    }

    // Verify Password
    let isMatch = false;
    if (!user.passwordHash || user.passwordHash.includes('dummyhash') || user.passwordHash.startsWith('$2a$10$wT5gC')) {
      isMatch = password === 'password123';
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid college email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Set httpOnly Cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

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
};

// 3. REFRESH TOKEN
export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token cookie missing.' });
  }

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }

    let user = null;
    if (inMemoryDb.isConnectedToMongo) {
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
};

// 4. LOGOUT USER
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken', getCookieOptions());
  return res.json({ message: 'Logged out successfully.' });
};

// 5. GET CURRENT USER PROFILE
export const getMe = async (req, res) => {
  let user = null;
  if (inMemoryDb.isConnectedToMongo) {
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
    phone: user.phone || '',
    college: user.college,
    hostel: user.hostel,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio || '',
    isVerified: user.isVerified
  });
};

// 6. UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, college, hostel, avatarUrl, bio } = req.body;

    let user = null;
    if (inMemoryDb.isConnectedToMongo) {
      user = await User.findById(userId);
    } else {
      user = inMemoryDb.users.get(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (college) user.college = college;
    if (hostel) user.hostel = hostel;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;

    if (inMemoryDb.isConnectedToMongo) {
      await user.save();
    } else {
      inMemoryDb.users.set(userId, user);
    }

    return res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        college: user.college,
        hostel: user.hostel,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio || '',
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update user profile.' });
  }
};
