import express from 'express';
import { 
  getAdminStats, 
  getFlaggedListings, 
  updateListingStatus, 
  getAllUsers 
} from '../controllers/adminController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth + admin verification to all admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

// 1. GET SYSTEM METRICS & STATS
router.get('/stats', getAdminStats);

// 2. GET FLAGGED LISTINGS
router.get('/flagged-listings', getFlaggedListings);

// 3. UPDATE LISTING MODERATION STATUS
router.put('/listings/:id/status', updateListingStatus);

// 4. GET ALL USERS
router.get('/users', getAllUsers);

export default router;
