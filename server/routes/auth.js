import express from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser, 
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

// 1. REGISTER
router.post('/register', registerUser);

// 2. LOGIN
router.post('/login', loginUser);

// 3. REFRESH TOKEN
router.post('/refresh', refreshToken);

// 4. LOGOUT
router.post('/logout', logoutUser);

// 5. GET CURRENT USER PROFILE
router.get('/me', verifyJWT, getMe);

// 6. UPDATE USER PROFILE
router.put('/profile', verifyJWT, updateProfile);

export default router;
