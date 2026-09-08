import express from 'express';
import { 
  getListings, 
  getListingById, 
  createListing, 
  updateListing, 
  deleteListing 
} from '../controllers/listingController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

// 1. GET LISTINGS (Search, Filter, Category, Price, Pagination)
router.get('/', getListings);

// 2. GET LISTING BY ID
router.get('/:id', getListingById);

// 3. CREATE NEW LISTING (Protected + AI Moderation Check)
router.post('/', verifyJWT, createListing);

// 4. UPDATE LISTING (Owner only or Admin)
router.put('/:id', verifyJWT, updateListing);

// 5. DELETE LISTING (Owner or Admin)
router.delete('/:id', verifyJWT, deleteListing);

export default router;
